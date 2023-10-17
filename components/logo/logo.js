import { useState, useEffect } from 'react';
import { useConfig } from 'nextra-theme-docs'
import Img from '../img/img'

function Logo() {
  const [logo, setLogo] = useState('');
  const { darkMode } = useConfig();

  const handleSetLogo = () => {
    if (darkMode) {
    } else {
    }
  }
  
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
