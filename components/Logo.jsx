import Image from 'next/image';

export const Logo = (props) => {
  const { src, width, height, alt, text, fetchPriority, ...rest  } = props;

  const imageSize = Number(width) || 40;
  const imageSrc = src || "/img/tableau/tableau_logo.png";

  const imageProps = {
    src: imageSrc,
    width: imageSize,
    height: height || imageSize,
    alt: alt || "application logo",
    ...rest, // Spread remaining props, excluding fetchPriority
  };

  // Add placeholder and blurDataURL only for images larger than 40x40
  if (imageSize > 40) {
    imageProps.placeholder = "blur";
    imageProps.blurDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  }

  return (
    <>
      <Image {...imageProps}  alt={imageProps.alt} />
      {text && <p className='pl-3 items-center justify-center'>{text}</p>}
    </>
  );
}
