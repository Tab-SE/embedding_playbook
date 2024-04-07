import { Superstore } from './Superstore';
import { NTO } from './NTO';

export const Themes = (props) => {
  const { theme } = props;
  console.log('theme props', theme);

  // declare selectable
  const sheetMap = {
    superstore: Superstore,
    nto: NTO,
  };

  if (theme && sheetMap[theme.name]) {
    const SheetComponent = sheetMap[theme.name];
    return <SheetComponent />;
  }

  return (
    <Superstore />
  )
}

export { ThemeSelector } from './ThemeSelector'
