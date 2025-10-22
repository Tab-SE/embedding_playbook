import { UserMenu } from './index';
import { ThemeSelector } from '../Themes';


export const MainNav = (props) => {
  const { setTheme, base_path } = props;

  return (
    <div className="border-b dark:border-stone-600 bg-stone-600 dark:bg-stone-900 shadow-xl px-3">
      <div className="h-18 px-4 mb-2">
        <div className="flex items-center justify-between space-x-4 pt-3">
          <ThemeSelector setTheme={setTheme} />
          <UserMenu base_path={base_path} />
        </div>
      </div>
    </div>
  )
}
