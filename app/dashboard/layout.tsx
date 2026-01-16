export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /**
     * DASHBOARD SHELL
     * ---------------
     * Uses a full-viewport height (h-screen) strategy to create an "application-like" feel.
     * This prevents the entire window from scrolling, delegating scrolling behaviors
     * to individual regions (sidebar vs main content) instead.
     */
    <div className="flex h-screen bg-gray-100">

      {/* * SIDEBAR REGION
       * --------------
       * TODO: Extract to <Sidebar /> component.
       * Keeping it inline is fine for MVP, but extracting it allows for:
       * 1. Isolated state (e.g., collapsible menus).
       * 2. Config-driven navigation (mapping over a generic `navItems` array).
       * * Responsive Note: Currently hidden on mobile (hidden md:block).
       * A MobileSheet/Drawer component is needed for small viewports.
       */}
      <aside className="w-64 bg-white border-r hidden md:block p-4">
        <h2 className="font-bold text-xl mb-4 text-blue-600">AutomateFlow</h2>

        {/* Navigation items should eventually be driven by the current pathname
            to apply 'active' states dynamically. */}
        <nav className="space-y-2">
          <div className="p-2 bg-blue-50 text-blue-700 rounded cursor-pointer">Workflows</div>
          <div className="p-2 text-gray-600 hover:bg-gray-50 rounded cursor-pointer">Connections</div>
          <div className="p-2 text-gray-600 hover:bg-gray-50 rounded cursor-pointer">Logs</div>
        </nav>
      </aside>

      {/* * MAIN CONTENT REGION
       * -------------------
       * `flex-1`: Takes up all remaining width.
       * `overflow-auto`: Ensures that long content scrolls *inside* this container
       * rather than stretching the parent window. This keeps the sidebar fixed.
       */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}