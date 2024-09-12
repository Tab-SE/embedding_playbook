import { NavigationSm, Breadcrumbs, UserMenu } from "components";

export const Navigation = (props) => {
  const { crumbs } = props;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <NavigationSm />
      <Breadcrumbs crumbs={crumbs} />
      <div className="relative ml-auto flex-1 md:grow-0"/>
      <UserMenu />
    </header>
  )
}
