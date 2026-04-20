import { NavigationMd, Navigation } from 'components';

export const Demo = (props) => {
  const { children, settings, pageName } = props;

  const {
    base_path,
    app_name,
    app_logo,
    nav_logo,
    header_logo,
    header_brand_logo,
    ai_chat,
    ai_avatar,
    sections,
    nav_logo_style,
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
    <div className="flex h-full w-full flex-col bg-muted/40 overflow-auto">
      <NavigationMd
        base_path={base_path}
        crumbs={crumbs}
        app_name={app_name}
        app_logo={app_logo}
        nav_logo={nav_logo}
        ai_chat={ai_chat}
        ai_avatar={ai_avatar}
        sections={sections}
        nav_logo_style={nav_logo_style}
      />
      <main className="flex flex-col sm:pl-14 bg-demoBackground flex-grow">
        <Navigation
          base_path={base_path}
          crumbs={crumbs}
          app_name={app_name}
          app_logo={app_logo}
          nav_logo={nav_logo}
          header_logo={header_logo}
          header_brand_logo={header_brand_logo}
          ai_chat={ai_chat}
          ai_avatar={ai_avatar}
          sections={sections}
          nav_logo_style={nav_logo_style}
        />
        {children}
      </main>
    </div>
  );
}
