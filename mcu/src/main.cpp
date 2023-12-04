#include <Arduino.h>
#include <LoggerFactory.hpp>
#include <Matrix.hpp>

#define SERIAL_LOGGER_BAUD_RATE 115200

void setup() {
  SerialLogger::Begin();

  delay(2000); // Wait for serial to work, so the initial message is displayed.

  Logger.Info("Serial started at BAUD[%d]", SERIAL_LOGGER_BAUD_RATE);
  Matrix::Begin();
}

void loop() {
  // put your main code here, to run repeatedly:
  Matrix::Loop();
}
