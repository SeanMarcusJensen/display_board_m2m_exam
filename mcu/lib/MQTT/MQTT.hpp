#ifndef MQTT_HPP
#define MQTT_HPP 

#include <Arduino.h>
#include <map>
#include <functional>
#include <ArduinoJson.h>
#include <LoggerFactory.hpp>
#include <SerialLogger.h>
#include <PubSubClient.h>

#include <secrets.h>


namespace
{
    std::unique_ptr<PubSubClient> client;
    std::map<String, std::function<void(const JsonObject&)>> _handlers;
    DynamicJsonDocument _mqttDoc(8192);

    void HandleMessage(const char* topic, byte* payload, unsigned int length)
    {
        DeserializationError error = deserializeJson(_mqttDoc, payload, length); // Parse the payload
        if (error)
        {
            Logger.Debug("deserializeJson() failed: %s", error.c_str());
            return;
        }

        JsonObject obj = _mqttDoc.as<JsonObject>();

        for (auto& kv : _handlers)
        {
            if (kv.first == topic)
            {
                kv.second(obj);
                break;
            }
        }
    }
}

namespace MQTT 
{
    bool Connect(Client& espClient, const String& url, const String& username, const String& password, const String& topic)
    {
        client = std::unique_ptr<PubSubClient>(new PubSubClient(espClient));
        client->setBufferSize(4096);
        client->setServer(url.c_str(), MQTT_PORT);
        client->setCallback(HandleMessage);

        while (!client->connected()) {
            Logger.Info("Connecting to MQTT...");
            String client_id = "esp32-client-";
            client_id += String(WiFi.macAddress());
            if (client->connect(client_id.c_str(), username.c_str(), password.c_str())) {
                Logger.Info("connected");
            } else {
                Logger.Info("failed with state %d", client->state());
                delay(2000);
            }
        }

        client->subscribe(topic.c_str());
        return true;
    }

    void Loop()
    {
        client->loop();
    }

    bool IsConnected()
    {
        return client->connected();
    }

    void AddTopicHandler(String topic, std::function<void(const JsonObject&)> callback)
    {
        _handlers[topic] = callback;
    }

}
#endif