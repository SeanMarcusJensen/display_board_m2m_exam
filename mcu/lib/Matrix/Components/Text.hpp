#ifndef TEXT_HPP
#define TEXT_HPP

#include <Components/IRenderedComponent.h>
#include <Color.h>
#include <ILogger.h>
#include <LoggerFactory.hpp>

class Text : public IRenderedComponent
{
private:
    const char* _text;
    int32_t _x;
    int32_t _y;
    uint16_t _textWidth;
    uint16_t _textHeight;
    Color _color;
    std::shared_ptr<ILogger> _logger;

private:
    void _calculateTextSize(const std::unique_ptr<Adafruit_NeoMatrix>& matrix)
    {
        int16_t x1, y1;
        matrix->getTextBounds(_text, _x, _y, &x1, &y1, &_textWidth, &_textHeight);
    }


public:
    Text(const char* text, Color color)
        : _text(text), _color(color)
        {
            _x = 0;
            _y = 0;
            _logger = LoggerFactory::Create(this);
        }

    bool Configure(const std::unique_ptr<Adafruit_NeoMatrix>& matrix) override
    {
        _logger->Trace("Matrix: w(%d), h(%d)", matrix->width(), matrix->height());
        _calculateTextSize(matrix);
        _logger->Trace("Text: w(%d), h(%d)", _textWidth, _textHeight);
        _logger->Trace("Setting Size to %d", 1);
        matrix->setTextSize(1);
        _x = matrix->width();
        _y = 0;
        return true;
    }

    void Render(const std::unique_ptr<Adafruit_NeoMatrix>& matrix) override
    {
        matrix->setTextColor(matrix->Color(_color.r, _color.g, _color.b));
        matrix->setCursor(_x, _y);
        matrix->print(F(_text));
        _logger->Trace("Text: %s", _text);
        _logger->Trace("X: %d", _x);
        _logger->Trace("Text Length: %d", _textWidth);
        if (--_x <= (_textWidth * -1))
        {
            _logger->Trace("Resetting X");
            _x = matrix->width();
            if (++_y >= matrix->height()) _y = 0;
        }
    }
};

#endif