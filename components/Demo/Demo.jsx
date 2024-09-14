import { NavigationMd, Navigation } from 'components';

export const Demo = (props) => {
  const { children, basePath, crumbs } = props;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <NavigationMd />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Navigation basePath={basePath} crumbs={crumbs} />
        {children}
      </div>
    </div>
  );
}
