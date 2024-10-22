import { NavigationMd, Navigation } from 'components';

export const Demo = (props) => {
  const { children, basePath, crumbs } = props;

  return (
    <div className="flex h-full w-full flex-col bg-muted/40 overflow-auto">
      <NavigationMd />
      <main className="flex flex-col sm:pl-14 bg-demoBackground flex-grow">
        <Navigation basePath={basePath} crumbs={crumbs} />
        {children}
      </main>
    </div>
  );
}
