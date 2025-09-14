export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="font-semibold text-xl">Admin Dashboard</div>
      <div className="relative">
        <input
            type="search"
            placeholder="Search…"
            className="border rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </header>
  );
}
