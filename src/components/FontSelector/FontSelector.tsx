'use client';
import { useEffect } from 'react';
import { fetchFont } from '../../libs';
const FontSelector = ({ fontName, weight }) => {

  useEffect(() => {
    let safeName = fontName.replace(/\+/g, ' ');
    fetchFont(safeName, weight).then((fontCss) => {;
    const style = document.createElement('style');
    if (fontCss){
      style.textContent = fontCss;
      document.head.appendChild(style);
    }
    });
    return () => {
      // Clean up
      const styles = document.head.getElementsByTagName('style');
      for (let i = 0; i < styles.length; i++) {
        if (styles[i] && styles[i].textContent && styles[i].textContent?.includes(safeName)) {
          styles[i].remove();
          break;
        }
      }
    };
  }, [fontName, weight]);

  return <></>;
};

export { FontSelector };
