"use client";
import { Thread } from '@/components';
import { useTableauSession } from '@/hooks';


export const description = "A settings page. The settings page has a sidebar navigation and a main content area. The main content area has a form to update the store name and a form to update the plugins directory. The sidebar navigation has links to general, security, integrations, support, organizations, and advanced settings."

export const Agent = (props) => {
  const { settings } = props;

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
    <main className="flex h-full w-full flex-col bg-demoBackground">
      <div className="flex h-full flex-1 flex-col gap-4 p-3 md:gap-8 rounded bg-demoBackground">
        { isSessionError ? <p>Authentication Error!</p> : null }
        { isSessionLoading ? <p>Authenticating the User...</p> : null }
        { isSessionSuccess ?
          <Thread
            ai_avatar={settings.ai_avatar}
            user_avatar={user.picture}
            sample_questions={settings.sample_questions}
          /> : null
        }
      </div>
    </main>
  )
}
