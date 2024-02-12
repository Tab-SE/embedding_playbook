import { ThemeSelect } from '../ThemeSelect';
import { UserNav } from '../UserNav';

export const MainNav = () => {
  return (
    <div className="border-b">
      <div className="h-16 px-4">
        <div className="flex items-center justify-between space-x-4">
          <div>
            <ThemeSelect />
          </div>
          <div>
            <UserNav />
          </div>
        </div>
      </div>
    </div>
  )
}
