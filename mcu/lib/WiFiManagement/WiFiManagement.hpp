#ifndef WIFI_MANAGEMENT_CPP
#define WIFI_MANAGEMENT_CPP

#include <Arduino.h>
#include <algorithm>
#include <FS.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>
#include <SerialLogger.h>

#include <WiFi.h>
#include <WiFiManager.h>
#include <Cache.hpp>
#include <JsonUtils.hpp>

namespace
{
    WiFiManager _wifiManager;

    const char* _mqttUserName = "Username";
    WiFiManagerParameter _mqttUserNameParameter(_mqttUserName, "Username", "myusername", 50);

    const char* _mqttPassword = "Password";
    WiFiManagerParameter _mqttPasswordParameter(_mqttPassword, "Password", "mysecretpassword", 50);

    const char* _mqttURL = "MqttURL";
    WiFiManagerParameter _mqttURLParameter(_mqttURL, "MqttURL", "m8be6714.ala.us-east-1.emqxsl.com", 100);

    const char* _matrixName = "MatrixName";
    WiFiManagerParameter _mqttTopicParameter(_matrixName, "TopicPrefix", "matrix", 100);

    DynamicJsonDocument _configurationJSON(512);
};

namespace WiFiManagement
{
    void OnTimeoutCallback(std::function<void()> callback)
    {
        _wifiManager.setConfigPortalTimeoutCallback(callback);
    }

    String ReadPropertyFromFile(const String& property)
    {
        auto configuration = Cache::GetJsonObject("/config.json");
        char* value = new char[101];
        if (JSON::TryGetString(configuration, property.c_str(), value, 101))
        {
            return configuration[property];
        }
        return String();
    }

    WiFiManager& GetManager()
    {
        return _wifiManager;
    }

    bool OpenCredentialPage(unsigned long timeoutInSeconds = 120)
    {
        if (!_wifiManager.autoConnect("ESP32-SETUP", "MySecretPassword"))
        {
            _wifiManager.addParameter(&_mqttUserNameParameter);
            _wifiManager.addParameter(&_mqttPasswordParameter);
            _wifiManager.addParameter(&_mqttURLParameter);
            _wifiManager.addParameter(&_mqttTopicParameter);

            _wifiManager.setConfigPortalTimeout(timeoutInSeconds); // 3 minutes

            _wifiManager.setSaveConfigCallback([&]() {
                _configurationJSON[_mqttPassword] = _mqttPasswordParameter.getValue();
                _configurationJSON[_mqttUserName] = _mqttUserNameParameter.getValue();
                _configurationJSON[_mqttURL] = _mqttURLParameter.getValue();
                _configurationJSON[_matrixName] = _mqttTopicParameter.getValue();
                Cache::SetJsonObject(_configurationJSON.as<JsonObject>(), "/config.json");
            });

            return _wifiManager.startConfigPortal("ESP32-SETUP", "MySecretPassword");
        }
        return true;
    }
};

#endif