#include <Arduino.h>
#include <LoggerFactory.hpp>
#include <Matrix.hpp>

#include <WiFi.h>
#include <PubSubClient.h>

#include "secrets.h"
#include <cstring>

#include <MQTT.hpp>

#define SERIAL_LOGGER_BAUD_RATE 115200

#include <ArduinoJson.h>

bool TryGetString(JsonObject obj, const char* key, char* value)
{
  if (obj.containsKey(key))
  {
    strcpy(value, obj[key]);
    return true;
  }
  return false;
}

bool TryGetUInt16Array(JsonObject obj, const char* key, uint16_t* arr, size_t len)
{
  if (obj.containsKey(key) && obj[key].is<JsonArray>())
  {
    JsonArray arrJson = obj[key].as<JsonArray>();
    if (arrJson.size() <= len)
    {
      size_t i = 0;
      for (JsonVariant v : arrJson)
      {
        arr[i++] = static_cast<uint16_t>(v.as<int>());
      }
      return true;
    }
  }
  return false;
}

template <typename T>
bool TryGetValue(JsonObject obj, const char* key, T* value)
{
  if (obj.containsKey(key))
  {
    *value = obj[key].as<T>();
    return true;
  }
  return false;
}

WiFiClient espClient;

void setup() {
  SerialLogger::Begin();

  delay(2000); // Wait for serial to work, so the initial message is displayed.

  Logger.Info("Serial started at BAUD[%d]", SERIAL_LOGGER_BAUD_RATE);

  Matrix::Begin();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  // TODO: Need to do this non-blocking
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Logger.Info("Connecting to WiFi..");
  }

  MQTT::AddTopicHandler("matrix/scale", [](const JsonObject& obj) {
    Logger.Info("Scale");
    uint16_t width, height;
    if (TryGetValue(obj, "width", &width) && TryGetValue(obj, "height", &height))
    {
      Matrix::Scale(width, height);
    }
  });

  MQTT::AddTopicHandler("matrix/text", [](const JsonObject& obj) {
    Logger.Info("Text");
    char text[512];
    if (TryGetString(obj, "payload", text))
    {
      Logger.Info("Text: %s", text);
    }

    int color;
    if (TryGetValue(obj, "color", &color))
    {
      Logger.Info("Color: %d", color);
    }

    Matrix::SetText(static_cast<uint16_t>(color), text);
  });

  MQTT::AddTopicHandler("matrix/image", [](const JsonObject& obj) {
    Logger.Info("Image");
    // Need to set image
    // TODO: This needs update -> we can scale..
    uint16_t* image = new uint16_t[16 * 16];
    if (TryGetUInt16Array(obj, "payload", image, 16 * 16))
    {
      Logger.Info("Image: %d", image);
      Matrix::SetImage(image);
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
