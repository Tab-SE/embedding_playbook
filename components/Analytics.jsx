import { useState, useRef } from 'react';

export const Analytics = (props) => {
  const { src, height, width, hideTabs, device, toolbar } = props;
  // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const ref = useRef(null); 
  const [interactive, setInteractive] = useState(false);

  return (
    <section className='bg-colorblind-lgray rounded pb-3'> 

    </section>
  )
}
