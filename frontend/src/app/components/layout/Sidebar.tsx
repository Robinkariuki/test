'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Server,
  Bell,
  LineChart,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { href: '/servers',   label: 'Servers',   icon: <Server size={18} /> },
    { href: '/alerts',    label: 'Alerts',    icon: <Bell size={18} />, badge: 3 },
    { href: '/metrics',   label: 'Metrics',   icon: <LineChart size={18} /> },
    { href: '/reports',   label: 'Reports',   icon: <FileText size={18} /> },
    { href: '/settings',  label: 'Settings',  icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className={`
        bg-[#0f1117] border-r border-white/[0.06] min-h-screen sticky top-0
        flex flex-col overflow-hidden transition-[width] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isCollapsed ? 'w-[72px]' : 'w-60'}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center gap-2 px-3.5 py-4 border-b border-white/[0.05] min-h-[57px]
          ${isCollapsed ? 'justify-center' : 'justify-between'}
        `}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-[7px] bg-gradient-to-br from-indigo-500 to-violet-500 shrink-0" />
            <span className="font-semibold text-[15px] text-gray-50 tracking-tight whitespace-nowrap">
              Fleet Monitor
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="
            w-7 h-7 flex items-center justify-center shrink-0 rounded-md
            bg-white/[0.04] border border-white/[0.07] text-gray-500
            hover:bg-white/[0.08] hover:text-gray-200 transition-colors duration-150 cursor-pointer
          "
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 p-2.5 pt-4">
        {!isCollapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-700 px-3 mb-1 whitespace-nowrap">
            Navigation
          </p>
        )}

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                transition-colors duration-150 whitespace-nowrap
                ${isCollapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'bg-white/[0.08] text-gray-50'
                  : 'text-gray-500 hover:bg-white/[0.05] hover:text-gray-200'
                }
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-[20%] h-[60%] w-[3px] rounded-r-full bg-indigo-500" />
              )}

              {/* Icon */}
              <span className="flex items-center justify-center w-5 shrink-0">
                {item.icon}
              </span>

              {/* Label + badge */}
              {!isCollapsed && (
                <>
                  <span className="flex-1 overflow-hidden text-ellipsis">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="shrink-0 bg-red-500 text-white text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded-full leading-none">
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {/* Collapsed tooltip */}
              {isCollapsed && (
                <span
                  className="
                    absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2
                    bg-[#1e2029] border border-white/[0.08] text-gray-200
                    text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap
                    pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-100 z-50
                  "
                >
                  {item.label}{item.badge ? ` · ${item.badge}` : ''}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2.5 border-t border-white/[0.05]">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shrink-0">
              <User size={15} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[13px] font-medium text-gray-200 truncate">Admin User</p>
              <p className="text-[11px] text-gray-600 font-mono truncate">admin@example.com</p>
            </div>
            <button
              title="Sign out"
              className="shrink-0 p-1 rounded-md text-gray-600 hover:text-gray-200 hover:bg-white/[0.05] transition-colors duration-150 cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity">
              <User size={15} />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}