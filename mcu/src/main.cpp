#include <Arduino.h>
#include <LoggerFactory.hpp>
#include <Matrix.hpp>

#include <WiFi.h>

#include "secrets.h"
#include <cstring>

#include <MQTT.hpp>
#include <Cache.hpp>
#include <JsonUtils.hpp>
#include <FS.h>
#include <SPIFFS.h>

#define SERIAL_LOGGER_BAUD_RATE 115200


WiFiClient espClient;

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

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  // TODO: Need to do this non-blocking
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Logger.Info("Connecting to WiFi..");
  }

  MQTT::AddTopicHandler("matrix/scale", [](const JsonObject& obj) {
    Logger.Info("Scale");
    uint16_t width, height;
    if (JSON::TryGetValue(obj, "width", &width) && JSON::TryGetValue(obj, "height", &height))
    {
      Matrix::Scale(width, height);
      Cache::SetJsonObject(obj, "/scale.json");
    }
  });

  MQTT::AddTopicHandler("matrix/text", [](const JsonObject& obj) {
    Logger.Info("Text");
    char text[512];

    if (JSON::TryGetString(obj, "payload", text, 512))
    {
      Logger.Info("Text: %s", text);
    }

    int color;
    if (JSON::TryGetValue(obj, "color", &color))
    {
      Logger.Info("Color: %d", color);
    }

    Matrix::SetText(static_cast<uint16_t>(color), text);

    obj["type"] = "text";
    Cache::SetJsonObject(obj, "/content.json");
  });

  MQTT::AddTopicHandler("matrix/image", [](const JsonObject& obj) {
    // TODO: This needs update -> we can scale..
    uint16_t* image = new uint16_t[16 * 16];
    if (JSON::TryGetUInt16Array(obj, "payload", image, 16 * 16))
    {
      Logger.Info("Image: %d", image);
      Matrix::SetImage(image);
      obj["type"] = "image";
      Cache::SetJsonObject(obj, "/content.json");
    }
  });

  // TODO: Setup MQTT
  MQTT::Connect(espClient, "matrix/+");
}

void loop() {
  // put your main code here, to run repeatedly:
  MQTT::Loop();
  Matrix::Loop();
}
