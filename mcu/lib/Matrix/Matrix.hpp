#ifndef MATRIX_HPP
#define MATRIX_HPP

#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>
#include <memory>
#include <ILogger.h>
#include <LoggerFactory.hpp>
#include <Components/IRenderedComponent.h>
#include <Color.h>
#include <Components/Text.hpp>

#ifndef PSTR
#define PSTR // Make Arduino Due happy
#endif

#define PIN 10


/// @brief Class for using NeoPixel matrices with the GFX graphics library.
/// Scalable
class LedMatrix
{
private:
    std::unique_ptr<Adafruit_NeoMatrix> _matrix;
    std::unique_ptr<IRenderedComponent> _renderable;
    std::shared_ptr<ILogger> _logger;

public:
    LedMatrix(std::unique_ptr<Adafruit_NeoMatrix> matrix)
        : _matrix(std::move(matrix))
    {
        _logger = LoggerFactory::Create(this);
    }

    void Begin()
    {
        _matrix->begin();
        _matrix->setBrightness(10);
        _matrix->setTextWrap(false);
    }

    void SetMatrix(std::unique_ptr<Adafruit_NeoMatrix> matrix)
    {
        _logger->Trace("Setting matrix");
        _matrix = std::move(matrix);
        Begin();
    }

    void SetRenderable(std::unique_ptr<IRenderedComponent> renderable)
    {
        _logger->Trace("Setting renderable");
        _renderable = std::move(renderable);
        _renderable->Configure(_matrix);
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
    // TODO: Change at runtime for size.
    LedMatrix myMatrix(std::unique_ptr<Adafruit_NeoMatrix>(new Adafruit_NeoMatrix(
        16, 16, PIN,
        NEO_MATRIX_TOP + NEO_MATRIX_RIGHT +
        NEO_MATRIX_ROWS + NEO_MATRIX_ZIGZAG,
        NEO_GRB + NEO_KHZ800)));
}

namespace Matrix
{
    void Begin()
    {
        myMatrix.Begin();
        myMatrix.SetRenderable(std::unique_ptr<IRenderedComponent>(new Text(Color {255, 0, 0}, "League of Legends")));
    }

    int count = 0;
    int high = 0;
    void Loop() {
        myMatrix.Loop();
        delay(100); // TODO: Move to non blocking timer.
        count++;
    }
}

#endif