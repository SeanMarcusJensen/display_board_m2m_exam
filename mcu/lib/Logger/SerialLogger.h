#ifndef SERIALLOGGER_H
#define SERIALLOGGER_H

#include <Arduino.h>

#include <ILogger.h>

#ifndef SERIAL_LOGGER_BAUD_RATE
#define SERIAL_LOGGER_BAUD_RATE 115200
#endif

/// @brief Serial Logger is an abstraction layer on top of serial communication,
/// to simplify message logging with context to serial.

class SerialLogger : public ILogger
{
private:
    String _logName;
public:
    SerialLogger(String loggerName) : _logName(loggerName) { };
    static void Begin()
    {
        Serial.begin(SERIAL_LOGGER_BAUD_RATE);
    }

    static ILogger& getInstance();

    /// @brief Logs the message to serial with severity as prefix:
    /// format: [%severity%][millis()] %message%
    /// @param severity The prefix of the log message
    /// @param message Your Log message.
    void Log(const String& severity, const char* format, ...) override;

    /// @brief Logs formatted message to serial with prefix: [INFO][millis] %message%
    /// @param format Formatted String
    /// @param  ARGS to insert to the formatted string.
    void Info(const char* format, ...) override;

    /// @brief Logs formatted message to serial with prefix: [TRACE][millis] %message%
    /// @param format Formatted String
    /// @param  ARGS to insert to the formatted string.
    virtual void Trace(const char* format, ...) = 0;

    /// @brief Logs formatted message to serial with prefix: [DEBUG][millis] %message%
    /// @param format Formatted String
    /// @param  ARGS to insert to the formatted string.
    virtual void Debug(const char* format, ...) = 0;

    /// @brief Logs formatted message to serial with prefix: [ERROR][millis] %message%
    /// @param format Formatted String
    /// @param  ARGS to insert to the formatted string.
    void Error(const char* format, ...) override;
};

extern ILogger& Logger; 

#endif // SERIALLOGGER_H