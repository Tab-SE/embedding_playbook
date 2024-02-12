import { Workbooks } from '../Workbooks';
import { ThemeSelect } from '../ThemeSelect';
import { UserNav } from '../UserNav';

export const MainNav = () => {

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Workbooks className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSelect />
          <UserNav />
        </div>
      </div>
    </div>
  )
}