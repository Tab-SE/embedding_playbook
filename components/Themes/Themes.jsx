import { Superstore } from 'components';
import { HVS_Pacifica } from 'components';

export const Themes = (props) => {
  const { theme } = props;
  const SheetComponent = theme?.component;

  if (SheetComponent) {
    return (
      <SheetComponent />
    )
  }

  // if above check fails, load HVS_Pacifica by default
  return (
    <HVS_Pacifica />
  )
}
