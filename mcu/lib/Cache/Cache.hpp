#ifndef CACHE_HPP
#define CACHE_HPP

#include <Arduino.h>
#include <algorithm>
#include <FS.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>

#include <SerialLogger.h>
namespace Cache
{
    JsonObject GetJsonObject(const char* path)
    {
        if (!SPIFFS.exists(path))
        {
            Serial.println("File does not exist");
            return JsonObject();
        }

        File file = SPIFFS.open(path);
        if (!file)
        {
            Serial.println("Failed to open file for reading");
            return JsonObject();
        }

        Logger.Trace("Parsing file");
        DynamicJsonDocument doc(8196);
        DeserializationError error = deserializeJson(doc, file);
        if (error)
        {
            Serial.println("Failed to parse file");
            return JsonObject();
        }

        serializeJsonPretty(doc, Serial);

        file.close();
        Logger.Trace("Parsed file");
        return doc.as<JsonObject>();
    }

    bool SetJsonObject(JsonObject obj, const char* path)
    {
        if (obj.isNull())
        {
            Logger.Debug("Object is null");
            return true;
        }

        if (!SPIFFS.exists(path))
        {
            Serial.println("File does not exist");
            return false;
        }

        File file = SPIFFS.open(path, FILE_WRITE);
        if (!file)
        {
            Serial.println("Failed to open file for writing");
            return false;
        }

        serializeJson(obj, file);
        file.close();
        return true;
    }
}

#endif