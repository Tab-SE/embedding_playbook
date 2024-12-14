export const rgbToHex = (rgb) => {
  const match = rgb.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/);
  if (!match) return null;

  const [, r, g, b] = match;
  return (
    '#' +
    [r, g, b]
      .map((x) => parseInt(x).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

export const hexToHsl = (hex) => {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '');

  // Parse the r, g, b values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Convert r, g, b to a range of 0 to 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find the maximum and minimum values to get the lightness
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100) + '%',
    l: Math.round(l * 100) + '%',
  };
}

export const adjustLightness = (color) => {
  let h, s, l;

  if (color.startsWith('#')) {
    const hsl = hexToHsl(color);
    h = hsl.h;
    s = parseInt(hsl.s);
    l = parseInt(hsl.l);
  } else {
    return 'white'; // or handle other color formats if needed
  }
  // If the text color is dark, use a lighter background; if light, use a darker background
  return l > 50 ? `hsl(${h}, ${s}%, 30%)` : `hsl(${h}, ${s}%, 90%)`;
}
