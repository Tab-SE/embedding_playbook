// app/<folder>/layout.tsx
import { ReactNode } from "react";
import { AuthenticatedUserContextProvider } from "./AuthenticatedUserContext";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthenticatedUserContextProvider>
      {children}
    </AuthenticatedUserContextProvider>
  );
}
