import Img from '../Img/Img'
import Image from 'next/image'

function Logo(props) {

  return (
  <>
  <span className='mr-2'>
    <Image
      src={props.src ? props.src : '/svg/logo_color.svg?w=40&h=40'}
      alt={props.alt ? props.alt : 'Tableau Software (logo)'}
      width={props.width ? props.width : 40}
      height={props.width ? props.width : 40}
      full={props.full ? props.full : 'false'}
    />
  </span>
  <p className='invisible md:visible'>
    {props.name ? props.name : 'Embedding Playbook'}
  </p>
  </>
  );
}

export default Logo;
