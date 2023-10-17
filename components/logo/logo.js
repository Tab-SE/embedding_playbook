import Img from '../img/img'

function Logo() {

  return (
  <>
  <span className='mr-2'>
    <Img
      src='svg/viz.svg'
      alt='Tableau Software (logo)'
      width={32}
      height={32}
    />
  </span>
  <span>
    Embedding Playbook
  </span>
  </>
  );
}

export default Logo;
