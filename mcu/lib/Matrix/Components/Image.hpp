#ifndef IMAGE_HPP
#define IMAGE_HPP

#include <Components/IRenderedComponent.h>
#include <Color.h>
#include <ILogger.h>
#include <LoggerFactory.hpp>

class Image : public IRenderedComponent
{
private:
    std::shared_ptr<ILogger> _logger; 
    uint16_t _width;
    uint16_t _height;
    uint16_t* _image;

public:
    Image(uint16_t width, uint16_t height, uint16_t* image)
    {
        _logger = LoggerFactory::Create(this);
        _width = width;
        _height = height;
        _image = new uint16_t[width * height];
        SetImage(image);
    }

    ~Image()
    {
        _logger->Trace("Image::~Image()");
        delete _image;
    }

    void SetImage(uint16_t* image)
    {
        _logger->Trace("Image::SetImage()");
        delete _image;
        _image = image;
        // Prevent memory leaks
        // memcpy(_image, image, _width * _height * sizeof(uint16_t));
    }

    bool Configure(const std::unique_ptr<Adafruit_NeoMatrix>& matrix) override
    {
        return true;
    }

    void Render(const std::unique_ptr<Adafruit_NeoMatrix>& matrix) override
    {
        _logger->Trace("Image::Render()");
        matrix->drawRGBBitmap(0, 0, _image, _width, _height);
        _logger->Trace("Image::Render() DONE");
    }

};


#endif