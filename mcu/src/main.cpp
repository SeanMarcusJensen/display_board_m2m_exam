#include <Arduino.h>
#include <LoggerFactory.hpp>

#define SERIAL_LOGGER_BAUD_RATE 115200

class TestClass
{
public:
  void Test()
  {
    auto logger = LoggerFactory::Create(this);
    logger->Info("Hello from inside test class");
  }

};

void setup() {
  SerialLogger::Begin();

  delay(2000); // Wait for serial to work, so the initial message is displayed.
  TestClass c;
  Logger.Info("Serial started at BAUD[%lu]", SERIAL_LOGGER_BAUD_RATE);
  c.Test();
}

void loop() {
  // put your main code here, to run repeatedly:
}
