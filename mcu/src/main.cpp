#include <Arduino.h>
#include <LoggerFactory.hpp>
#include <Matrix.hpp>

#include <WiFi.h>
#include <PubSubClient.h>

#include "secrets.h"
#include <cstring>

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


void callback(char* topic, byte* payload, unsigned int length) {
  Logger.Info("Message arrived [%s]", topic);
  Logger.Info("Payload: %s", payload);

  // TWO IMAGES
  StaticJsonDocument<512> doc; // Create a StaticJsonDocument with a capacity of 512 bytes. Adjust if necessary.
  DeserializationError error = deserializeJson(doc, payload, length); // Parse the payload

  if (error)
  { // Test if parsing succeeds.
    Logger.Info("deserializeJson() failed with code %s", error.c_str());
    return;
  }

  JsonObject obj = doc.as<JsonObject>(); // Get the JsonObject from the JsonDocument.

  // Now you can use the JsonObject.
  // For example, let's print it to the serial:
  serializeJson(obj, Serial);
  if (strcmp(topic, "matrix/text") == 0)
  {
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

      Matrix::SetComponent(static_cast<uint16_t>(color), text);
  }
  else if (strcmp(topic, "matrix/image") == 0)
  {
    Logger.Info("Image");
    // Need to set image
    // Matrix::SetComponent(obj["image"].as<char*>());
  }
  else
  {
    Logger.Info("Unknown message");
  }
}


WiFiClient espClient;
PubSubClient client(espClient);

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

  // TODO: Setup MQTT
  client.setServer(MQTT_BROKER, MQTT_PORT);
  client.setCallback(callback);
  while (!client.connected()) {
    Logger.Info("Connecting to MQTT...");
    String client_id = "esp32-client-";
    client_id += String(WiFi.macAddress());
    if (client.connect(client_id.c_str())) {
      Logger.Info("connected");
    } else {
      Logger.Info("failed with state %d", client.state());
      delay(2000);
    }
  }
  client.subscribe("matrix/+");
}

void loop() {
  // put your main code here, to run repeatedly:
  client.loop();
  Matrix::Loop();
}
