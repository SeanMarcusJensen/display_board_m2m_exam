#ifndef TEXT_HPP
#define TEXT_HPP

#include <Components/IRenderedComponent.h>
#include <ILogger.h>
#include <LoggerFactory.hpp>

class Text : public IRenderedComponent
{
private:
    char* _text;
    uint16_t _color;
    std::shared_ptr<ILogger> _logger;

private:
    void _calculateTextSize(const std::unique_ptr<Adafruit_NeoMatrix>& matrix)
    {
        int16_t x1, y1;
        matrix->getTextBounds(_text, _x, _y, &x1, &y1, &_width, &_height);
    }

public:
    ~Text()
    {
        delete[] _text;
    }

    Text(uint16_t color, const char* format, ...)
        : IRenderedComponent(0, 0, 0, 0), _color(color)
    {
        _logger = LoggerFactory::Create("Text");

        _text = new char[512];

        va_list args;
        va_start(args, format);
        vsnprintf(_text, 511, format, args);
        va_end(args);
    }

    bool Configure(const std::unique_ptr<Adafruit_NeoMatrix>& matrix) override
    {
        _logger->Trace("Matrix: w(%d), h(%d)", matrix->width(), matrix->height());
        _calculateTextSize(matrix);
        _logger->Trace("Text: w(%d), h(%d)", _width, _height);
        _logger->Trace("Setting Size to %d", 1);
        matrix->setTextSize(1);
        matrix->setTextColor(_color);
        _x = matrix->width();
        _y = (matrix->height() - _height) / 2; // Center text
        return true;
    }

    void Render(const std::unique_ptr<Adafruit_NeoMatrix>& matrix) override
    {
        matrix->setCursor(_x, _y);
        matrix->print(F(_text));
        _logger->Trace("Text[w(%d), h(%d)]: %s", _width, _height, _text);
        _logger->Trace("Cursor: x(%d), y(%d)", _x, _y);
    }
};

#endif