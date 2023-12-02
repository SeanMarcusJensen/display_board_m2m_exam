#ifndef I_LOGGER_H
#define I_LOGGER_H

#include <Arduino.h>

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