#include <Arduino.h>
#include <LoggerFactory.hpp>

#define SERIAL_LOGGER_BAUD_RATE 115200

class TestClass
{
public:
  void Test()
  {
    auto testLogger = LoggerFactory::Create(this);
    int count = 0;
    testLogger->Info("Does this work");
    testLogger->Info("Does this work [%d]", count);
    testLogger->Trace("Does this work");
    testLogger->Trace("Does this work [%d]", count);
    testLogger->Debug("Does this work");
    testLogger->Debug("Does this work [%d]", count);
    testLogger->Error("Does this work");
    testLogger->Error("Does this work [%d]", count);
  }

};

std::shared_ptr<ILogger> testLogger;

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
