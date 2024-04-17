import { Superstore } from './Superstore';
import { NTO } from './NTO';

export const Themes = (props) => {
  const { theme } = props;
  const SheetComponent = theme?.component;

  if (SheetComponent) {
    return (
      <SheetComponent />
    )
  }

  // if above check fails, load Superstore by default
  return (
    <Superstore />
  )
}

export { Superstore, NTO };
export { ThemeSelector } from './ThemeSelector';
