// higher-order component abstracting the IMGX custom loader
import Image from 'next/image'

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
  return (
    <Image 
      loader={imageLoader}
      alt={props.alt} 
      src={props.src} 
      width={props.width}
      height={props.height}
    />
  )
}

export default Img;
