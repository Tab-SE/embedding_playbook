import { Superstore } from 'components';
import { Commonwealth } from 'components';
import { BranchManager } from 'components';

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
