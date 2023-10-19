import Img from '../img/img'

function Logo() {

  return (
  <>
  <span className='mr-2'>
    <Img
      src='svg/logo_color.svg?w=40&h=40'
      alt='Tableau Software (logo)'
      width={40}
      height={40}
      full={false}
      sizes='(max-width: 32px)'
    />
  </span>
  <span>
    Embedding Playbook
  </span>
  </>
  );
}

export default Logo;
