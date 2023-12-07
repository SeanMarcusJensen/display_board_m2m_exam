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
        File file = SPIFFS.open(path);
        if (!file)
        {
            Serial.println("Failed to open file for reading");
            return JsonObject();
        }

        size_t size = file.size();
        if (size > 1024)
        {
            Serial.println("File size is too large");
            return JsonObject();
        }

        std::unique_ptr<char[]> buf(new char[size]);
        file.readBytes(buf.get(), size);

        StaticJsonDocument<1024> doc;
        DeserializationError error = deserializeJson(doc, buf.get());
        if (error)
        {
            Serial.println("Failed to parse file");
            return JsonObject();
        }

        return doc.as<JsonObject>();
    }

    bool SetJsonObject(JsonObject obj, const char* path)
    {
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