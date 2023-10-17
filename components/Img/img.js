// higher-order component abstracting the IMGX custom loader
import Image from 'next/image'
import { useConfig } from 'nextra-theme-docs'
import { useState, useEffect } from 'react';

function imageLoader({ src, width, quality }) {
  const url = new URL(`https://tableauembeddingplaybook.imgix.net/${src}`);
  const params = url.searchParams;
  params.set('auto', params.getAll('auto').join(',') || 'format');
  params.set('fit', params.get('fit') || 'max');
  params.set('w', params.get('w') || width.toString());
  params.set('q', (quality || 50).toString());
  return url.href;
}
 
function Img(props) {
  // default theme is light, default base64 placeholder image is transparent black https://png-pixel.com/
  const [blurDataURL, setBlurDataURL] = useState('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkmAkAAJ8AmzsOXcYAAAAASUVORK5CYII=');

  const { darkMode } = useConfig();

  useEffect(() => {
    handleBlurDataURL();
  }, []);
  
  const handleBlurDataURL = () => {
    if (darkMode) {
      // https://png-pixel.com/
      setBlurDataURL('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8PxMAAp0BmiC7I60AAAAASUVORK5CYII=');
    } else {
      setBlurDataURL('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkmAkAAJ8AmzsOXcYAAAAASUVORK5CYII=');
    }
  }

  return (
    <Image 
      alt={props.alt} 
      src={props.src} 
      width={props.width}
      height={props.height}
      loader={imageLoader}
      sizes="(min-width: 320px) 25vw, 50vw, 75vw, 100vw"
      placeholder="blur"
      blurDataURL={`data:image/png;base64,${blurDataURL}`}
    />
  )
}

export default Img;
