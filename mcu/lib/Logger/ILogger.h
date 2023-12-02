#ifndef I_LOGGER_H
#define I_LOGGER_H

#include <Arduino.h>

/// @brief Default interface for logging.
/// Can be used for serial, file or whatever logging.
class ILogger
{
public:
    virtual void Log(const String& severity, const char* format, ...) = 0;
    virtual void Info(const char* format, ...) = 0;
    virtual void Debug(const char* format, ...) = 0;
    virtual void Trace(const char* format, ...) = 0;
    virtual void Error(const char* format, ...) = 0;
};

#endif