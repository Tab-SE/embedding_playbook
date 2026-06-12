"use client";

import { createContext, useContext, useState, useCallback } from "react";

// Coordinates the floating chat panels (the MCP assistant and the Salesforce
// Analytics Agent) so only one is open at a time. Without a provider the hook
// falls back to standalone local state, so demos that render just one panel
// (makana, cumulus, ubl) work unchanged — no provider required.
const FloatingPanelContext = createContext(null);

export const FloatingPanelProvider = ({ children }) => {
  // The id of the single panel currently open, or null.
  const [activePanel, setActivePanel] = useState(null);
  return (
    <FloatingPanelContext.Provider value={{ activePanel, setActivePanel }}>
      {children}
    </FloatingPanelContext.Provider>
  );
};

// Returns { isOpen, setOpen } for a panel identified by `id`. When a provider is
// present, opening this panel closes any other; otherwise it's plain local state.
export const useFloatingPanel = (id) => {
  const ctx = useContext(FloatingPanelContext);
  const [localOpen, setLocalOpen] = useState(false);

  const setOpen = useCallback(
    (open) => {
      if (ctx) {
        // Only clear the shared slot if WE were the open panel — avoids a
        // closing panel stomping another that just opened.
        ctx.setActivePanel((prev) => (open ? id : prev === id ? null : prev));
      } else {
        setLocalOpen(open);
      }
    },
    [ctx, id]
  );

  const isOpen = ctx ? ctx.activePanel === id : localOpen;
  return { isOpen, setOpen };
};
