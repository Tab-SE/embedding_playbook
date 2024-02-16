import LogoColor from '../public/svg/logo_color.svg';

export const Logo = (props) => {

  return (
  <>
  <span className='mr-2'>
    <LogoColor 
      src={props.src ? props.src : '/svg/logo_color.svg?w=40&h=40'}
      alt={props.alt ? props.alt : 'Tableau Software (logo)'}
      width={props.width ? props.width : 40}
      height={props.width ? props.width : 40}
      full={props.full ? props.full : 'false'} 
    />
  </span>
  <p className='invisible md:visible'>
    {props.name ? props.name : 'Embed Tableau'}
  </p>
  </>
  );
}
