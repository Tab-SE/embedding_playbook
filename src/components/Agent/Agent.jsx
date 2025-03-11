"use client";
import { Thread } from '@/components';
import { useTableauSession } from '@/hooks';


export const description = "A settings page. The settings page has a sidebar navigation and a main content area. The main content area has a form to update the store name and a form to update the plugins directory. The sidebar navigation has links to general, security, integrations, support, organizations, and advanced settings."

export const Agent = (props) => {
  const { ai_avatar, demo } = props;

  // tanstack query hook to safely represent users on the client
  const {
    status: sessionStatus,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession();

  return (
    <main className="flex h-full w-full flex-col">
      <div className="flex h-full flex-1 flex-col gap-4 bg-muted/40 p-3 md:gap-8 rounded">
        { isSessionError ? <p>Authentication Error!</p> : null }
        { isSessionLoading ? <p>Authenticating the User...</p> : null }
        { isSessionSuccess ?
          <Thread
            ai_avatar={ai_avatar}
            user_avatar={user.picture}
          /> : null
        }
      </div>
    </main>
  )
}
