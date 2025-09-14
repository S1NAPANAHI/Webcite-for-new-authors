import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
