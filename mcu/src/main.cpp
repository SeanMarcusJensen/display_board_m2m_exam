#include <Arduino.h>
#include <SerialLogger.h>

#define SERIAL_LOGGER_BAUD_RATE 115200

void setup() {
  Logger.Begin();
  delay(2000); // Wait for serial to work, so the initial message is displayed.
  Logger.Info("Serial started at BAUD[%d]", SERIAL_LOGGER_BAUD_RATE);
}

void loop() {
  // put your main code here, to run repeatedly:
}
