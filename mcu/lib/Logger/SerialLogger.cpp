#include "SerialLogger.h"

SerialLogger::SerialLogger() { }

SerialLogger& SerialLogger::getInstance()
{
    static SerialLogger instance;
    return instance;
}

void SerialLogger::Begin()
{
    Serial.begin(SERIAL_LOGGER_BAUD_RATE);
}

void SerialLogger::Log(const String& severity, const String& message)
{
    size_t bufferSize = 1 + severity.length() + message.length() + 20;
    char buffer[bufferSize];

    snprintf(buffer, sizeof(buffer), " [%s][%lu] %s", severity.c_str(), millis(), message.c_str());

    Serial.println(buffer);
}

void SerialLogger::Info(const String& message)
{
    SerialLogger::Log("INFO", message);
}

void SerialLogger::Info(const char* format, ...)
{
    char logMessage[512];
    va_list args;
    va_start(args, format);
    vsnprintf(logMessage, sizeof(logMessage), format, args);
    va_end(args);

    SerialLogger::Info(String(logMessage));
}

void SerialLogger::Error(const String& message)
{
    SerialLogger::Log("ERROR", message);
}

void SerialLogger::Error(const char* format, ...)
{
    char logMessage[512];
    va_list args;
    va_start(args, format);
    vsnprintf(logMessage, sizeof(logMessage), format, args);
    va_end(args);

    SerialLogger::Error(String(logMessage));
}

SerialLogger& Logger = SerialLogger::getInstance();