import { ThemeSelect } from './ThemeSelect';
import { UserMenu } from './UserMenu';

export const MainNav = () => {
  return (
    <div className="border-b dark:border-stone-600 bg-stone-400 dark:bg-stone-900 shadow-xl px-3">
      <div className="h-18 px-4 mb-2">
        <div className="flex items-center justify-between space-x-4 pt-3">
          <ThemeSelect />
          <UserMenu />
        </div>
      </div>
    </div>
  )
}
