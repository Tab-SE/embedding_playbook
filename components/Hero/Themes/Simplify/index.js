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
      setShowRecruiting(isJustin || isEwa);

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

  if (status === 'loading' || defaultTab === null) {
    return (
      <div className="flex justify-between items-center">
        <div className="w-1/2 p-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to Simplify VMS</h1>
          <p className="text-lg mb-4">
            Simplify your workforce management, contract job management, and recruiting processes with one powerful platform.
          </p>
          <ul className="list-disc pl-5 mb-4 text-lg">
            <li>Optimize your workforce operations</li>
            <li>Streamline contract job management</li>
            <li>Enhance recruiting efficiency</li>
          </ul>
          <p className="text-lg">
            Discover the tools that help you manage everything in one place.
          </p>
        </div>
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-4">Already have an account?</h2>
          <Button
            variant="ghost"
            className="hover:cursor-pointer bg-blue-500 text-white hover:bg-blue-600 focus:ring focus:ring-blue-300 px-4 py-2 rounded-md"
            onClick={async () => await signIn()}
          >
            Log in
          </Button>
        </div>
      </div>
    );
  }
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
