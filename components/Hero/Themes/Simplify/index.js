import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";
import { useSession } from "next-auth/react";
import { Recruiting } from './Recruiting';
import { Workforce } from './Workforce';
import { ContractJobManagement } from './ContractJobManagement';
import { useState, useEffect } from "react";
import { Button } from "components/ui";
import { signIn, signOut } from "next-auth/react";

export const Simplify = () => {
  const [showContract, setShowContract] = useState(false);
  const [showWorkforce, setShowWorkforce] = useState(false);
  const [showRecruiting, setShowRecruiting] = useState(false);
  const [defaultTab, setDefaultTab] = useState(null); // Start with null to avoid default rendering
  const { data: session_data, status } = useSession();

  // Manage visibility and default tab based on session_data
  useEffect(() => {
    if (status === 'authenticated' && session_data) {
      const isEwa = session_data.user.email === "ewa.przywara@mail.com";
      const isJustin = session_data.user.email === "jchen@mail.com";

      setShowContract(isEwa);
      setShowWorkforce(isJustin);
      setShowRecruiting(isJustin);
      console.log("isJustin", isJustin)

      // Set dynamic default tab based on the user
      if (isEwa) {
        setDefaultTab("contract");
      } else if (isJustin) {
        setDefaultTab("workforce");
      } else {
        setDefaultTab("recruiting"); // Fallback to another tab if needed
      }
    }
  }, [session_data, status]);

  // Render nothing until session is ready and default tab is set
  if (status === 'loading' || defaultTab === null) {
    return <Button
    variant="ghost"
    className="hover:cursor-pointer bg-blue-500 text-white hover:text-white hover:bg-blue-600 focus:ring focus:ring-blue-300 transition-colors duration-200 ease-in-out px-4 py-2 rounded-md"
    style={{ outline: 'none' }} // Removed black outline for a cleaner look
    onClick={async () => await signIn()}
  >
    Log in
  </Button>
  }
console.log("showRecruiting", showRecruiting)
  return (
    <Tabs defaultValue={defaultTab} className="space-y-3">
      <TabsList>
        {showContract && (
          <TabsTrigger value="contract">
            Contract Job Management
          </TabsTrigger>
        )}
        {showWorkforce && (
          <TabsTrigger value="workforce">
            Workforce Overview
          </TabsTrigger>
        )}
        {showRecruiting && (
          <TabsTrigger value="recruiting">
            Job Requisition Efficiency
          </TabsTrigger>
        )}
      </TabsList>
      <section className="min-h-[892px]">
        {defaultTab === "workforce" && showWorkforce && <Workforce />}
        {defaultTab === "workforce" && showRecruiting && <Recruiting />}
        {defaultTab === "contract" && showContract && <ContractJobManagement />}
      </section>
    </Tabs>
  );
};
