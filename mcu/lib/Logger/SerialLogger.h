#ifndef SERIALLOGGER_H
#define SERIALLOGGER_H

#include <Arduino.h>

#ifndef SERIAL_LOGGER_BAUD_RATE
#define SERIAL_LOGGER_BAUD_RATE 115200
#endif

/// @brief Serial Logger is an abstraction layer on top of serial communication,
/// to simplify message logging with context to serial.
class SerialLogger {
public:
    static SerialLogger& getInstance();

    /// @brief Starts the Serial Communication.
    /// Serial.Begin() with the BAUD RATE defined in SERIAL_LOGGER_BAUD_RATE
    void Begin();

    /// @brief Logs the message to serial with severity as prefix:
    /// format: [%severity%][millis()] %message%
    /// @param severity The prefix of the log message
    /// @param message Your Log message.
    void Log(const char* severity, const String& message);

    /// @brief Logs message to serial with prefix: [INFO][millis] %message%
    /// @param message The message to be logged.
    void Info(const String& message);

    /// @brief Logs formatted message to serial with prefix: [INFO][millis] %message%
    /// @param format Formatted String
    /// @param  ARGS to insert to the formatted string.
    void Info(const char* format, ...);

    /// @brief Logs message to serial with prefix: [ERROR][millis] %message%
    /// @param message The message to be logged.
    void Error(const String& message);

    /// @brief Logs formatted message to serial with prefix: [ERROR][millis] %message%
    /// @param format Formatted String
    /// @param  ARGS to insert to the formatted string.
    void Error(const char* format, ...);

private:
    SerialLogger();
};

extern SerialLogger& Logger; 

#endif // SERIALLOGGER_H