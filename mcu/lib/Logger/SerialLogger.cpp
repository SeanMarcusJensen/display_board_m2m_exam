#include "SerialLogger.h"

void SerialLogger::Log(const String& severity, const char* format, va_list args)
{
    char logMessage[512];
    vsnprintf(logMessage, sizeof(logMessage), format, args);

    size_t bufferSize = 1 + severity.length() + sizeof(logMessage) + sizeof(unsigned long) + _logName.length();

    char buffer[bufferSize];

    snprintf(buffer, sizeof(buffer), " [%s][%s][%lu] %s", _logName.c_str(), severity.c_str(), millis(), logMessage);

    Serial.println(buffer);
} 


void SerialLogger::Log(const String& severity, const char* format, ...)
{
    va_list args;
    va_start(args, format);
    SerialLogger::Log(severity, format, args);
    va_end(args);
}

void SerialLogger::Info(const char* format, ...)
{
    va_list args;
    va_start(args, format);
    SerialLogger::Log("INFO", format, args); 
    va_end(args);
}

void SerialLogger::Trace(const char* format, ...)
{
    va_list args;
    va_start(args, format);
    SerialLogger::Log("TRACE", format, args); 
    va_end(args);
}

void SerialLogger::Debug(const char* format, ...)
{
    va_list args;
    va_start(args, format);
    SerialLogger::Log("DEBUG", format, args); 
    va_end(args);
}

void SerialLogger::Error(const char* format, ...)
{
    va_list args;
    va_start(args, format);
    SerialLogger::Log("ERROR", format, args); 
    va_end(args);
}

ILogger& SerialLogger::getInstance() {
    static SerialLogger instance("Default");
    return instance;
}

ILogger& Logger = SerialLogger::getInstance();