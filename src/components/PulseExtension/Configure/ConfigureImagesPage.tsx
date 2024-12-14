// app/components/pulseextension/configure/configureImages.tsx
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from 'components/ui';

const ConfigureImages = () => {
  const images = [
    '/img/extensionconfigure/ConfigureAnchorChartVegaLite.png',
    '/img/extensionconfigure/ConfigureLineVegaLite.png',
    '/img/extensionconfigure/ConfigureBarVegaLite.png'
  ];

  return (
    <Carousel>
      {images.map((image, index) => (
        <div key={index}>
          <img src={image} alt={`Slide ${index + 1}`} />
        </div>
      ))}
    </Carousel>
  );
};

// pages/ConfigureImagesPage.tsx

export const ConfigureImagesPage = () => {
  return (
    <div>
      <h1>Configure Chart Images</h1>
      <ConfigureImages />
    </div>
  );
};

