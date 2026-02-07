'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  LogOut,
  UserCheck,
  Clock,
  Home,
} from 'lucide-react';
import { logout } from '@/lib/services';

interface SidebarProps {
  role: 'ADMIN' | 'ORGANIZER' | 'PARTICIPANT';
  isApproved?: boolean;
}

const adminMenuItems = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Organizers', href: '/dashboard/admin/organizers', icon: UserCheck },
  { label: 'Events', href: '/dashboard/admin/events', icon: Calendar },
];

const organizerMenuItems = [
  { label: 'Dashboard', href: '/dashboard/organizer', icon: LayoutDashboard },
  { label: 'My Events', href: '/dashboard/organizer/events', icon: Calendar },
];

const participantMenuItems = [
  { label: 'My Bookings', href: '/dashboard/participant/bookings', icon: Ticket },
];

export function Sidebar({ role, isApproved = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Get menu items based on role
  const getMenuItems = () => {
    if (role === 'ADMIN') return adminMenuItems;
    if (role === 'ORGANIZER' && isApproved) return organizerMenuItems;
    if (role === 'PARTICIPANT') return participantMenuItems;
    return [];
  };

  const menuItems = getMenuItems();

  // If organizer is not approved, show pending state
  if (role === 'ORGANIZER' && !isApproved) {
    return (
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/eventflow.png" alt="EventFlow" width={120} height={30} />
          </Link>
        </div>

        <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
          <Clock className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Pending Approval</h3>
          <p className="text-sm text-gray-500">
            Your organizer request is being reviewed by admin.
          </p>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/eventflow.png" alt="EventFlow" width={120} height={30} />
        </Link>
      </div>

      {/* Role Badge */}
      <div className="px-6 py-3 border-b border-gray-200">
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
          role === 'ADMIN' 
            ? 'bg-red-100 text-red-800' 
            : role === 'ORGANIZER' 
            ? 'bg-purple-100 text-purple-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {role}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== `/dashboard/${role.toLowerCase()}` && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-purple-600' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Back to Home */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full"
        >
          <Home className="h-5 w-5" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
