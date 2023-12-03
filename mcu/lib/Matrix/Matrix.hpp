#ifndef MATRIX_HPP
#define MATRIX_HPP

#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>
#include <memory>
#include <ILogger.h>
#include <LoggerFactory.hpp>

#ifndef PSTR
#define PSTR // Make Arduino Due happy
#endif

#define PIN 10

struct Color
{
    uint8_t r;
    uint8_t g;
    uint8_t b;
};

class RenderableComponent
{
public:
    virtual void Render(const std::shared_ptr<Adafruit_NeoMatrix>& matrix) = 0;
};

class Text : public RenderableComponent
{
private:
    const char* _text;
    int32_t _x;
    int32_t _y;
    Color _color;
    std::shared_ptr<ILogger> _logger;

private:
  int _calculateTextWidth(const std::shared_ptr<Adafruit_NeoMatrix>& matrix)
    {
        int16_t x1, y1;
        uint16_t w, h;
        matrix->getTextBounds(_text, _x, _y, &x1, &y1, &w, &h);
        return w;
    }

    int _calculateTextHeight(const std::shared_ptr<Adafruit_NeoMatrix>& matrix)
    {
        int16_t x1, y1;
        uint16_t w, h;
        matrix->getTextBounds(_text, _x, _y, &x1, &y1, &w, &h);
        return h;
    }

public:
    Text(const char* text, Color color)
        : _text(text), _color(color)
        {
            _x = 0;
            _y = 0;
            _logger = LoggerFactory::Create(this);
        }

    void Render(const std::shared_ptr<Adafruit_NeoMatrix>& matrix) override
    {
        matrix->setTextColor(matrix->Color(_color.r, _color.g, _color.b));
        matrix->setCursor(_x, _y);
        matrix->print(F(_text));
        _logger->Trace("Text: %s", _text);
        _logger->Trace("X: %d", _x);
        int64_t textLength = (_calculateTextWidth(matrix) * -1);
        _logger->Trace("Text Length: %d", textLength);
        if (--_x < textLength)
        {
            _logger->Trace("Resetting X");
            _x = matrix->width();
            if (++_y >= matrix->height()) _y = 0;
        }
    }
};

/// @brief Class for using NeoPixel matrices with the GFX graphics library.
/// Scalable
class LedMatrix
{
private:
    std::shared_ptr<Adafruit_NeoMatrix> _matrix;
    std::shared_ptr<RenderableComponent> _renderable;
    std::shared_ptr<ILogger> _logger;

public:
    LedMatrix(std::shared_ptr<Adafruit_NeoMatrix> matrix)
        : _matrix(std::move(matrix))
        {
        _logger = LoggerFactory::Create(this);
        }

    void Begin()
    {
        _matrix->setBrightness(10);
        _matrix->setTextWrap(false);
    }

    void SetRenderable(std::shared_ptr<RenderableComponent> renderable)
    {
        _logger->Trace("Setting renderable");
        _renderable = renderable;
    }

    void Loop()
    {
        if (_renderable == nullptr) return;
        _logger->Debug("Clearing screen");
        _matrix->fillScreen(0);
        // render something.
        _logger->Debug("Rendering");
        _renderable->Render(_matrix);
        _logger->Debug("Rendered");

        _logger->Debug("Showing");
        _matrix->show();
    }
};


namespace
{
    LedMatrix myMatrix(std::make_shared<Adafruit_NeoMatrix>(
        16, 16, PIN,
        NEO_MATRIX_TOP + NEO_MATRIX_RIGHT +
        NEO_MATRIX_ROWS + NEO_MATRIX_ZIGZAG,
        NEO_GRB + NEO_KHZ800));

}

namespace Matrix
{
    void Begin()
    {
        myMatrix.Begin();
        myMatrix.SetRenderable(std::make_shared<Text>("Hello World!", Color {255, 0, 0}));
    }

    void Loop() {
        myMatrix.Loop();
        delay(100);
    }
}

#endif