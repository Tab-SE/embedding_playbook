'use client';
import { useEffect } from 'react';

const loadFont = (fontName, weight = '400', style = 'normal') => {
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@${weight}&display=swap`;
  link.rel = 'stylesheet';
  // document.head.appendChild(link);
  const iframe = document.getElementById('extension_frame') as HTMLIFrameElement;
  if (iframe && iframe.contentDocument) {
    iframe.contentDocument.head.appendChild(link);
    // Optionally set the font on body or specific elements
    const style = document.createElement('style');
    style.textContent = `body { font-family: '${fontName}', sans-serif; }`;
    iframe.contentDocument.head.appendChild(style);
    // Trigger a reload of the iframe to ensure onload fires
    iframe.src = iframe.src; // This will reload the iframe
  }
};

const FontSelector = ({ selectedFont }) => {
  useEffect(() => {
    // Load the selected font dynamically
    loadFont(selectedFont);

    // Optional: Cleanup function to remove the font link if needed
    return () => {
      const links = document.querySelectorAll(`link[href*="${selectedFont}"]`);
      links.forEach((link) => link.remove());
    };
  }, [selectedFont]);

  return (
    <div style={{ fontFamily: selectedFont }}>
      <h1>This is a dynamic font example!</h1>
      <p>Your selected font is: {selectedFont}</p>
    </div>
  );
};

export { FontSelector };
