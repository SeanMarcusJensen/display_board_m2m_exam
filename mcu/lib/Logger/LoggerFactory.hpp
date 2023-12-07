#ifndef LOGGER_FACTORY_HPP
#define LOGGER_FACTORY_HPP

#include <Arduino.h>
#include <SerialLogger.h>
#include <memory>
#include <type_traits>

class LoggerFactory
{
public:
    static std::shared_ptr<ILogger> Create(String name)
    {
        return std::make_shared<SerialLogger>(name);
    }
};

#endif
