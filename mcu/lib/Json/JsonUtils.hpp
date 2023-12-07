#ifndef JSON_UTILS_HPP
#define JSON_UTILS_HPP

#include <ArduinoJson.h>

namespace JSON
{
    bool TryGetString(JsonObject obj, const char* key, char* value, size_t len)
    {
        if (obj.containsKey(key))
        {
            strncpy(value, obj[key], len - 1);
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
}

#endif