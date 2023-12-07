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
#include <Components/Image.hpp>
#include <functional>
#include <ArduinoJson.h>
#include <JsonUtils.hpp>

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
        _logger = LoggerFactory::Create("LedMatrix");
    }

    uint16_t Width() const
    {
        return _matrix->width();
    }

    uint16_t Height() const
    {
        return _matrix->height();
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
        _matrix.swap(matrix);
        Begin();
        _renderable->Configure(_matrix);
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
    void Scale(const uint16_t& width, const uint16_t& height)
    {
        myMatrix.SetMatrix(std::unique_ptr<Adafruit_NeoMatrix>(new Adafruit_NeoMatrix(
            width, height, PIN,
            NEO_MATRIX_TOP + NEO_MATRIX_RIGHT +
            NEO_MATRIX_ROWS + NEO_MATRIX_ZIGZAG,
            NEO_GRB + NEO_KHZ800)));
    }

    void SetText(const uint16_t color, const char* component)
    {
        myMatrix.SetRenderable(std::unique_ptr<IRenderedComponent>(new Text(color, component)));
    }

    void SetImage(uint16_t* image)
    {
        myMatrix.SetRenderable(std::unique_ptr<IRenderedComponent>(new Image(myMatrix.Width(), myMatrix.Height(), image)));
    }

    void Begin(const std::function<JsonObject(const char*)> getCache)
    {
        JsonObject scale = getCache("/spiffs/scale.json");
        int width, height;
        if (JSON::TryGetValue(scale, "width", &width) && JSON::TryGetValue(scale, "height", &height))
        {
            Scale(static_cast<uint16_t>(width), static_cast<uint16_t>(height));
        }
        else
        {
            Scale(16, 16);
        }

        JsonObject content = getCache("/spiffs/content.json");
        char type[32];
        if (JSON::TryGetString(content, "type", type, 32))
        {
            if (strcmp(type, "text") == 0)
            {
                char text[512];
                int color;
                if (JSON::TryGetString(content, "payload", text, 512) && JSON::TryGetValue(content, "color", &color))
                {
                    SetText(static_cast<uint16_t>(color), text);
                }
            }
            else if (strcmp(type, "image") == 0)
            {
                uint16_t* image = new uint16_t[myMatrix.Width() * myMatrix.Height()];
                if (JSON::TryGetUInt16Array(content, "payload", image, myMatrix.Width() * myMatrix.Height()))
                {
                    SetImage(image);
                }
            }
        }

        myMatrix.Begin();
    }

    void Loop() {
        myMatrix.Loop();
        delay(100); // TODO: Move to non blocking timer.
    }
}

#endif