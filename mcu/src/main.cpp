#include <Arduino.h>
#include <LoggerFactory.hpp>
#include <Matrix.hpp>

#include <WiFi.h>

#include "secrets.h"
#include "CA_CERT.h"
#include <cstring>

#include <MQTT.hpp>
#include <Cache.hpp>
#include <JsonUtils.hpp>
#include <FS.h>
#include <SPIFFS.h>
#include <WiFiClientSecure.h>
#include <WiFiManagement.hpp>

#define SERIAL_LOGGER_BAUD_RATE 115200


// WiFiClient espClient;
WiFiClientSecure espClientSecure;
String mqttUrl;
String username;
String password;
String matrixName;

void setup() {
  SerialLogger::Begin();

  delay(2000); // Wait for serial to work, so the initial message is displayed.

  Logger.Info("Serial started at BAUD[%d]", SERIAL_LOGGER_BAUD_RATE);

  if (!SPIFFS.begin(true)) {
      Logger.Error("Failed to mount SPIFFS. Formatting...");
      SPIFFS.format();
      if (!SPIFFS.begin()) {
          Logger.Error("Failed to mount SPIFFS after formatting.");
          esp_restart();
      }
  }

  Matrix::Begin(Cache::GetJsonObject);

  // TODO: ADD WiFiManager
  WiFiManagement::OpenCredentialPage();

  mqttUrl = WiFiManagement::ReadPropertyFromFile("MqttURL");
  username= WiFiManagement::ReadPropertyFromFile("Username");
  password= WiFiManagement::ReadPropertyFromFile("Password");
  matrixName = WiFiManagement::ReadPropertyFromFile("MatrixName");

  Logger.Info("Setting CACert");

  espClientSecure.setCACert(EMQX_CA_CERT);

  Logger.Info("CACert set");

  MQTT::AddTopicHandler(String(matrixName + "/scale").c_str(), [](const JsonObject& obj) {
    Logger.Info("Scale");
    uint16_t width, height;
    if (JSON::TryGetValue(obj, "width", &width) && JSON::TryGetValue(obj, "height", &height))
    {
      Matrix::Scale(width, height);
      Cache::SetJsonObject(obj, "/scale.json");
    }
  });

  MQTT::AddTopicHandler(String(matrixName + "/text").c_str(), [](const JsonObject& obj) {
    Logger.Info("Text");
    char text[512];
    int color;
    int speed;
    int scrollDirection;

    if (!JSON::TryGetString(obj, "payload", text, 512))
    {
      Logger.Debug("No Payload");
      return;
    }

    if (!JSON::TryGetValue(obj, "color", &color))
    {
      Logger.Debug("No Color");
      return;
    }

    if (!JSON::TryGetValue(obj, "scrollSpeed", &speed))
    {
      Logger.Debug("No scrollspeed");
      return;
    }

    if (!JSON::TryGetValue(obj, "scrollDirection", &scrollDirection))
    {
      Logger.Debug("No scrollDirection");
      return;
    }

    Logger.Info("Color: %d", color);
    Logger.Info("Text: %s", text);
    Logger.Info("ScrollDirection: %d", scrollDirection);
    Logger.Info("Speed: %d", speed);

    Matrix::SetText(static_cast<uint16_t>(color), text, speed, scrollDirection);

    obj["type"] = "text";
    Cache::SetJsonObject(obj, "/content.json");
  });

  MQTT::AddTopicHandler(String(matrixName + "/image").c_str(), [](const JsonObject& obj) {
    uint16_t width, height;
    Matrix::GetScale(&width, &height);
    uint16_t* image = new uint16_t[width * height];
    int speed;
    int scrollDirection;
    if (!JSON::TryGetValue(obj, "scrollSpeed", &speed))
    {
      speed = 0;
    }

    if (!JSON::TryGetValue(obj, "scrollDirection", &scrollDirection))
    {
      // NONE
      scrollDirection = 0;
    }

    if (!JSON::TryGetUInt16Array(obj, "payload", image, width * height))
    {
      return;
    }

    Logger.Info("ScrollDirection: %d", scrollDirection);
    Logger.Info("Image: %d", image);
    Logger.Info("Speed: %d", speed);

    Matrix::SetImage(image, speed, scrollDirection);
    obj["type"] = "image";
    Cache::SetJsonObject(obj, "/content.json");
  });

  MQTT::Connect(
    espClientSecure,
    mqttUrl,
    username,
    password,
    String(matrixName + "/+").c_str());
}

void loop() {
  // Need to run regardless of MQTT connection.
  Matrix::Loop();

  if (MQTT::IsConnected())
  {
    MQTT::Loop();
  }
  else
  {
    Logger.Info("MQTT Disconnected");
    // TODO: Add reconnect logic
    MQTT::Connect(
      espClientSecure,
      mqttUrl,
      username,
      password,
      String(matrixName + "/+").c_str());
  }
}
