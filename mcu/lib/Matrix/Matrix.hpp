#ifndef MATRIX_HPP
#define MATRIX_HPP

#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>

#ifndef PSTR
#define PSTR // Make Arduino Due happy
#endif

#define PIN 10

namespace
{
    Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(16, 16, PIN,
      NEO_MATRIX_TOP + NEO_MATRIX_RIGHT +
      NEO_MATRIX_ROWS + NEO_MATRIX_ZIGZAG,
      NEO_GRB + NEO_KHZ800);

    const uint16_t colors[] = {
    matrix.Color(255, 0, 0), matrix.Color(0, 255, 0), matrix.Color(0, 0, 255) };

    int x    = matrix.width();
    int y    = 0;
    int pass = 0;
}


/// @brief Class for using NeoPixel matrices with the GFX graphics library.
// class LedMatrix
// {
// private:
//     Adafruit_NeoMatrix _matrix = Adafruit_NeoMatrix(16, 16, PIN);

// public:
//     LedMatrix(/* args */);
//     ~LedMatrix();

//     void Begin()
//     {

//     }

// };


namespace Matrix
{
    void Begin()
    {
        matrix.begin();
        matrix.setTextWrap(false);
        matrix.setBrightness(10);
        matrix.setTextColor(colors[0]);
    }

    int CalculateTextWidth(const char* text, int16_t x = 0, int16_t y = 0)
    {
        int16_t x1, y1;
        uint16_t w, h;
        matrix.getTextBounds(text, x, y, &x1, &y1, &w, &h);
        return w;
    }

    int CalculateTextHeight(const char* text, int16_t x = 0, int16_t y = 0)
    {
        int16_t x1, y1;
        uint16_t w, h;
        matrix.getTextBounds(text, x, y, &x1, &y1, &w, &h);
        return h;
    }

    void Loop() {
        matrix.fillScreen(0);
        matrix.setCursor(x, 0);
        matrix.print(F("SICK"));
        if (--x < CalculateTextWidth("SICK") * -1)
        {
            x = matrix.width();
            if (++pass >= 3) pass = 0;
            matrix.setTextColor(colors[pass]);
        }

        // matrix.print(F("Howdy"));
        // if(--x < -36) {
        //     x = matrix.width();
        //     if(++pass >= 3) pass = 0;
        //     matrix.setTextColor(colors[pass]);
        // }
        matrix.show();
        delay(100);
    }
}

#endif