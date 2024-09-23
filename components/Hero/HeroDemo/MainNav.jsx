import { useContext } from 'react';

import { Button } from "components/ui/";

import { DisplayContext } from 'components/context';
import { UserMenu } from './index';
import { ThemeSelector } from '../Themes';


export const MainNav = (props) => {
  const { setTheme } = props;
  const { setDisplay } = useContext(DisplayContext);

  const handleFullSized = (event) => {
    if (setDisplay){
      setDisplay('fullsized');
    }
  }

  const handleMinimized = (event) => {
    if (setDisplay){
      setDisplay('minimized');
    }
  }

  return (
    <div className="border-b dark:border-stone-600 bg-stone-600 dark:bg-stone-900 shadow-xl px-3">
      <div className="h-3 mb-2">
        <Button
          className="h-3 w-3 text-[6px] bg-red-500 dark:bg-red-500 p-1 mx-1 border-white border rounded-full shadow-xl"
          onClick={handleMinimized}
        >✕</Button>
        <Button
          className="h-3 w-3 text-[6px] bg-yellow-400 dark:bg-yellow-500 p-1 mx-1 border-white border rounded-full shadow-xl"
          onClick={handleMinimized}
        >─</Button>
        <Button
          className="h-3 w-3 text-[6px] bg-green-500 dark:bg-green-500 p-1 mx-1 border-white border rounded-full shadow-xl"
          onClick={handleFullSized}
        >☐</Button>
      </div>
      <div className="h-18 px-4 mb-2">
        <div className="flex items-center justify-between space-x-4 pt-3">
          <ThemeSelector setTheme={setTheme} />
          <UserMenu />
        </div>
      </div>
    </div>
  )
}
