import Img from '../img/img'

function Logo() {

  return (
  <>
  <span className='mr-2'>
    <Img
      src='svg/logo_color.svg'
      alt='Tableau Software (logo)'
      width={40}
      height={40}
    />
  </span>
  <span>
    Embedding Playbook
  </span>
  </>
  );
}

export default Logo;
