#include "SerialLogger.h"
#include <time.h>

SerialLogger::SerialLogger() { }

SerialLogger& SerialLogger::getInstance() {
    static SerialLogger instance;
    return instance;
}

void SerialLogger::Begin() {
    Serial.begin(SERIAL_LOGGER_BAUD_RATE);
}

void SerialLogger::Log(const char* severity, const String& message) {
    size_t bufferSize = 1 + sizeof(severity) + message.length() + 20;
    char* buffer = new char[bufferSize];

    sprintf(buffer, " [%s][%lu] %s", severity, millis(), message.c_str());

    Serial.println(buffer);

    delete[] buffer;
}

void SerialLogger::Info(const String& message) {
    SerialLogger::Log("INFO", message);
}

void SerialLogger::Info(const char* format, ...)
{
    char logMessage[512];
    va_list args;
    va_start(args, format);
    vsnprintf(logMessage, sizeof(logMessage), format, args);
    va_end(args);

    SerialLogger::Info(logMessage);
}

void SerialLogger::Error(const String& message) {
    SerialLogger::Log("ERROR", message);
}

void SerialLogger::Error(const char* format, ...)
{
    char logMessage[512];
    va_list args;
    va_start(args, format);
    vsnprintf(logMessage, sizeof(logMessage), format, args);
    va_end(args);

    SerialLogger::Error(logMessage);
}

SerialLogger& Logger = SerialLogger::getInstance();