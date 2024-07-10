import Image from 'next/image';

export const Logo = (props) => {
  const { src, width, height, alt, text } = props;

  return (
    <>
      <Image
        src={src ? src : "/img/tableau/tableau_logo.png"}
        width={width ? width : "45"}
        height={height ? height : "45"}
        alt={alt ? alt : "application logo"}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
      />
      {text ? <p className='pl-3 items-center justify-center'>{text}</p> : null}
    </>

  );
}