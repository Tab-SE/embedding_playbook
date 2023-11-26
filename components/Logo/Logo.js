import Img from '../Img/Img'

function Logo(props) {

  return (
  <>
  <span className='mr-2'>
    <Img
      src={props.src ? props.src : 'svg/logo_color.svg?w=40&h=40'}
      alt={props.alt ? props.alt : 'Tableau Software (logo)'}
      width={props.width ? props.width : 40}
      height={props.width ? props.width : 40}
      full={props.full ? props.full : false}
      sizes={props.sizes ? props.sizes : '(max-width: 32px)'}
    />
  </span>
  <p className='invisible md:visible'>
    {props.name ? props.name : 'Embedding Playbook'}
  </p>
  </>
  );
}

export default Logo;
