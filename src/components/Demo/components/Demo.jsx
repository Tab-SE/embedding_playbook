import { NavigationMd, Navigation } from 'components';

export const Demo = (props) => {
  const {
    children,
    basePath,
    base_path,
    crumbs,
    app_name,
    ai_chat,
    ai_avatar,
    sections,
  } = props;

  return (
    <div className="flex h-full w-full flex-col bg-muted/40 overflow-auto">
      <NavigationMd
        basePath={basePath}
        base_path={base_path}
        crumbs={crumbs}
        app_name={app_name}
        ai_chat={ai_chat}
        ai_avatar={ai_avatar}
        sections={sections}
      />
      <main className="flex flex-col sm:pl-14 bg-demoBackground flex-grow">
        <Navigation
          basePath={basePath}
          base_path={base_path}
          crumbs={crumbs}
          app_name={app_name}
          ai_chat={ai_chat}
          ai_avatar={ai_avatar}
          sections={sections}
        />
        {children}
      </main>
    </div>
  );
}
