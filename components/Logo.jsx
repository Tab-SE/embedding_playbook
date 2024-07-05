import Image from 'next/image';

export const Logo = (props) => {
  const { src, width, height, alt } = props;

  return (
    <Image
      src={src ? src : "/img/themes/pacifica/pacifica.png"}
      width={width ? width : "45"}
      height={height ? height : "45"}
      alt={alt ? alt : "application logo"}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    />
  );
}
