#ifndef CACHE_HPP
#define CACHE_HPP

#include <Arduino.h>
#include <algorithm>
#include <FS.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>

#include <SerialLogger.h>

namespace
{
    DynamicJsonDocument _doc(8192);
}

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
        DeserializationError error = deserializeJson(_doc, file);
        if (error)
        {
            Serial.println("Failed to parse file");
            return JsonObject();
        }

        serializeJsonPretty(_doc, Serial);

        file.close();
        Logger.Trace("Parsed file");
        return _doc.as<JsonObject>();
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