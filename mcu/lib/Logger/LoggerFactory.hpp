#ifndef LOGGER_FACTORY_HPP
#define LOGGER_FACTORY_HPP

#include <Arduino.h>
#include <SerialLogger.h>
#include <memory>

class LoggerFactory
{
private:
public:
    template <typename T>
    static std::shared_ptr<ILogger> Create(T name)
    {
        std::shared_ptr<ILogger> loggerInstance = std::make_shared<SerialLogger>(typeid(T).name());
        return loggerInstance;
    }
};

#endif
