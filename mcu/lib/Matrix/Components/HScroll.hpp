#ifndef H_SCROLL_HPP 
#define H_SCROLL_HPP 


#include <Components/IRenderedComponent.h>
#include <ILogger.h>
#include <LoggerFactory.hpp>
#include <Components/Image.hpp>

enum class ScrollDirection
{
    None    = 0,
    Left    = 1,
    Right   = 2,
};

class HScroll : public IRenderedComponent
{
private:
    int8_t _speed;
    ScrollDirection _direction;

    std::shared_ptr<ILogger> _logger; 
    std::unique_ptr<IRenderedComponent> _component;

public:
    static std::unique_ptr<IRenderedComponent> Create(std::unique_ptr<IRenderedComponent> component, int8_t speed = 1, ScrollDirection direction = ScrollDirection::Left)
    {
        return std::unique_ptr<HScroll>(new HScroll(std::move(component), speed, direction));
    }

    /// @brief Horizontal Scrollable Component
    /// @param width width of the rendered component
    /// @param height height of the rendered component
    /// @param component the component to render
    /// @param x index to start rendering at
    /// @param y index to start rendering at
    /// @param speed the speed at which to scroll the component
    HScroll(std::unique_ptr<IRenderedComponent> component, int8_t speed = 1, ScrollDirection direction = ScrollDirection::Left)
        : IRenderedComponent(0,0,0,0), _component(std::move(component)), _speed(speed), _direction(direction)
    {
        _logger = LoggerFactory::Create("Scrollable");
    }

    void SetRenderable(std::unique_ptr<IRenderedComponent> renderable)
    {
        _logger->Trace("Setting renderable");
        _component = std::move(renderable);
    }

    bool Configure(const std::unique_ptr<Adafruit_NeoMatrix>& matrix) override
    {
        _logger->Trace("Scrollable::Configure()");
        auto configured = _component->Configure(matrix);

        _x = _component->GetX();
        _y = _component->GetY();
        _width = _component->GetWidth();
        _height = _component->GetHeight();

        if (_direction == ScrollDirection::None)
        {
            _x = 0;
        }

        return configured;
    }

    void Render(const std::unique_ptr<Adafruit_NeoMatrix>& matrix) override
    {
        _logger->Trace("Scrollable::Render()");

        _component->Render(matrix);
        if (_direction == ScrollDirection::Left)
        {
            if ((_x -= _speed) <= (_width * -1))
            {
                _logger->Trace("Resetting X");
                _x = _width;
            }
        }
        else if (_direction == ScrollDirection::Right)
        {
            if ((_x += _speed) >= (_width))
            {
                _logger->Trace("Resetting X");
                _x = _width * -1;
            }
        }
        _component->SetX(_x);
        _component->SetY(_y);
    }
};

#endif