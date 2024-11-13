import { NavigationSm, Breadcrumbs, UserMenu } from 'components';

export const Navigation = (props) => {
  const { basePath, crumbs } = props;

  return (
    <header className="sticky top-0 z-30 flex h-4 mt-6 items-center gap-4 border-b bg-background px-4 sm:static sm:border-0 sm:bg-transparent sm:px-6">
      <NavigationSm />
      <h1 className="text-lg font-bold">Welcome to Ebikes LLC</h1>
      {/* <Breadcrumbs basePath={basePath} crumbs={crumbs} /> */}
      <div className="relative ml-auto flex-1 md:grow-0" />
      <UserMenu />
    </header>
  );
};
