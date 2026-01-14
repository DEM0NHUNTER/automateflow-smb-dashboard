export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-white border-r hidden md:block p-4">
        <h2 className="font-bold text-xl mb-4 text-blue-600">AutomateFlow</h2>
        <nav className="space-y-2">
          <div className="p-2 bg-blue-50 text-blue-700 rounded cursor-pointer">Workflows</div>
          <div className="p-2 text-gray-600 hover:bg-gray-50 rounded cursor-pointer">Connections</div>
          <div className="p-2 text-gray-600 hover:bg-gray-50 rounded cursor-pointer">Logs</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}