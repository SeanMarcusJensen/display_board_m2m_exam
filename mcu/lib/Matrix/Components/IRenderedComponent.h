#ifndef I_RENDERED_COMPONENT_H
#define I_RENDERED_COMPONENT_H

#include <memory>
#include <Adafruit_NeoMatrix.h>

class IRenderedComponent
{
public:
    virtual bool Configure(const std::unique_ptr<Adafruit_NeoMatrix>& matrix) = 0;
    virtual void Render(const std::unique_ptr<Adafruit_NeoMatrix>& matrix) = 0;
};

#endif