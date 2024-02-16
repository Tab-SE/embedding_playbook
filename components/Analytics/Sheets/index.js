import { Superstore } from './Superstore';
import { NTO } from './NTO'; 


export const Sheets = (props) => {
  const { theme } = props;

  if (theme) {
    if (theme.value === 'nto') {
      return (
        <NTO />
      )
    }
  }

  return (
    <Superstore />
  )
}
