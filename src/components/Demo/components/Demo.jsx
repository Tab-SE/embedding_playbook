import { NavigationMd, Navigation } from 'components';

export const Demo = (props) => {
  const { children, settings, pageName } = props;

  const {
    base_path,
    app_name,
    app_logo,
    auth_logo,
    ai_chat,
    ai_avatar,
    sections,
  } = settings;

  const crumbs = {
    [app_name]: {
      path: '/',
      child: {
        [pageName]: {
          path: `${pageName ? pageName.toLowerCase() : ''}`,
          child: null
        }
      }
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-background overflow-auto">
      <NavigationMd
        base_path={base_path}
        crumbs={crumbs}
        app_name={app_name}
        app_logo={app_logo}
        auth_logo={auth_logo}
        ai_chat={ai_chat}
        ai_avatar={ai_avatar}
        sections={sections}
      />
      <main className="flex flex-col sm:pl-14 bg-demoBackground flex-grow">
        <Navigation
          base_path={base_path}
          crumbs={crumbs}
          app_name={app_name}
          app_logo={app_logo}
          ai_chat={ai_chat}
          ai_avatar={ai_avatar}
          sections={sections}
        />
        {children}
      </main>
    </div>
  );
}
