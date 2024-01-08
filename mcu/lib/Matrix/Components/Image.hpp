#ifndef IMAGE_HPP
#define IMAGE_HPP

#include <Components/IRenderedComponent.h>
#include <ILogger.h>
#include <LoggerFactory.hpp>

class Image : public IRenderedComponent
{
private:
    std::shared_ptr<ILogger> _logger; 
    std::unique_ptr<uint16_t> _image;

public:
    Image(uint16_t width, uint16_t height, std::unique_ptr<uint16_t> image, int16_t x = 0, int16_t y = 0)
        : IRenderedComponent(width, height, x, y), _image(std::move(image))
    {
        _logger = LoggerFactory::Create("Image");
        _width = width;
        _height = height;
    }

    ~Image()
    {
        _logger->Trace("Image::~Image()");
    }

    void SetImage(uint16_t* image)
    {
        _logger->Trace("Image::SetImage()");
        _image = std::unique_ptr<uint16_t>(image);
    }

    bool Configure(const std::unique_ptr<Adafruit_NeoMatrix>& matrix) override
    {
        return true;
    }

    void Render(const std::unique_ptr<Adafruit_NeoMatrix>& matrix) override
    {
        _logger->Trace("Image::Render()");
        matrix->drawRGBBitmap(_x, _y, _image.get(), _width, _height);
        _logger->Trace("Image::Render() DONE");
    }
};


#endif