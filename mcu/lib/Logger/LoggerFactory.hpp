#ifndef LOGGER_FACTORY_HPP
#define LOGGER_FACTORY_HPP

#include <Arduino.h>
#include <SerialLogger.h>
#include <memory>
#include <type_traits>

class LoggerFactory
{
public:
    template <class T>
    static std::shared_ptr<ILogger> Create(T name)
    {
        return std::make_shared<SerialLogger>(typeid(T).name());
    }
};

#endif
