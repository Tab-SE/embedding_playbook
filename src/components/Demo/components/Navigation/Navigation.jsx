import { NavigationSm, Breadcrumbs, UserMenu } from "components";

export const Navigation = (props) => {
  const {
    base_path,
    crumbs,
    app_name,
    app_logo,
    header_logo,
    ai_chat,
    ai_avatar,
    sections,
  } = props;

  return (
    <header className="sticky top-0 z-30 flex h-20 pt-6 items-center gap-4 border-b bg-navBackground px-4 sm:static sm:border-0 sm:bg-transparent sm:px-6">
      <NavigationSm
        base_path={base_path}
        crumbs={crumbs}
        app_name={app_name}
        app_logo={app_logo}
        header_logo={header_logo}
        ai_chat={ai_chat}
        ai_avatar={ai_avatar}
        sections={sections}
      />
      {header_logo && (
        <div className="hidden md:flex items-center gap-3">
          <img src={header_logo} alt={app_name} className="h-8 object-contain" />
        </div>
      )}
      <Breadcrumbs
        base_path={base_path}
        crumbs={crumbs}
      />
      <div className="relative ml-auto flex-1 md:grow-0"/>
      <UserMenu
        app_name={app_name}
        base_path={base_path}
      />
    </header>
  )
}
