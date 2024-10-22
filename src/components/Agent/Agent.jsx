import { Thread } from 'components';


export const description = "A settings page. The settings page has a sidebar navigation and a main content area. The main content area has a form to update the store name and a form to update the plugins directory. The sidebar navigation has links to general, security, integrations, support, organizations, and advanced settings."

export const Agent = () => {
  return (
    <main className="flex h-full w-full flex-col">
      <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-3 md:gap-8 rounded">
        <Thread />
      </div>
    </main>
  )
}
