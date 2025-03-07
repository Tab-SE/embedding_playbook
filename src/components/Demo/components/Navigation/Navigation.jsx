import { NavigationSm, Breadcrumbs, UserMenu } from "components";

export const Navigation = (props) => {
  const { base_path, crumbs } = props;

  return (
    <header className="sticky top-0 z-30 flex h-20 mt-6 items-center gap-4 border-b bg-background px-4 sm:static sm:border-0 sm:bg-transparent sm:px-6">
      <NavigationSm />
      <Breadcrumbs
        base_path={base_path}
        crumbs={crumbs}
      />
      <div className="relative ml-auto flex-1 md:grow-0"/>
      <UserMenu />
    </header>
  )
}
