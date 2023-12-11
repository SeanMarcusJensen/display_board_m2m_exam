#ifndef I_RENDERED_COMPONENT_H
#define I_RENDERED_COMPONENT_H

#include <memory>
#include <Adafruit_NeoMatrix.h>

class IRenderedComponent
{
protected:
    uint16_t _width;
    uint16_t _height;
    int16_t _x;
    int16_t _y;

public:
    IRenderedComponent(uint16_t width, uint16_t height, int16_t x = 0, int16_t y = 0)
        : _width(width), _height(height), _x(x), _y(y)
    {

    }

    virtual uint16_t GetWidth()
    {
        return _width;
    }

    virtual uint16_t GetHeight()
    {
        return _height;
    }

    virtual void SetWidth(uint16_t width)
    {
        _width = width;
    }

    virtual void SetHeight(uint16_t height)
    {
        _height = height;
    }

    virtual void SetX(int16_t x)
    {
        _x = x;
    }

    virtual void SetY(int16_t y)
    {
        _y = y;
    }

    virtual int16_t GetX()
    {
        return _x;
    }

    virtual int16_t GetY()
    {
        return _y;
    }

    virtual bool Configure(const std::unique_ptr<Adafruit_NeoMatrix>& matrix) = 0;
    virtual void Render(const std::unique_ptr<Adafruit_NeoMatrix>& matrix) = 0;
};

#endif