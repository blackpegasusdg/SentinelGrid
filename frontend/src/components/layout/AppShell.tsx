import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Server, Scan, Building2, Shield,
  ChevronLeft, ChevronRight, LogOut, Bell, User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCursor } from '@/context/CursorContext';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',       path: '/dashboard' },
  { icon: Server,          label: 'Assets',          path: '/assets' },
  { icon: Scan,            label: 'Scans',           path: '/scans' },
  { icon: Building2,       label: 'Organization',    path: '/organization' },
  { icon: Shield,          label: 'Intelligence',    path: '/intelligence' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setCursorState } = useCursor();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col bg-bg-secondary border-r border-border-default flex-shrink-0 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border-default h-16">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 flex-shrink-0 flex items-center justify-center">
            <Shield size={16} className="text-accent-cyan" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-space font-bold text-text-primary text-sm tracking-tight whitespace-nowrap"
              >
                SENTINEL<span className="text-accent-cyan">GRID</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                onMouseEnter={() => setCursorState('hover')}
                onMouseLeave={() => setCursorState('default')}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                  active
                    ? 'bg-accent-cyan/10 text-accent-cyan'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/4',
                ].join(' ')}
                title={collapsed ? item.label : undefined}
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1 bottom-1 w-0.5 bg-accent-cyan rounded-r-full"
                  />
                )}
                <item.icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="text-sm font-inter whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="border-t border-border-default p-3">
          <div className={`flex items-center gap-3 px-2 py-2 rounded-lg ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center flex-shrink-0">
              <UserIcon size={14} className="text-accent-blue" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-xs font-semibold text-text-primary truncate font-inter">{user?.name}</p>
                  <p className="text-xs text-text-secondary truncate font-mono">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!collapsed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleLogout}
                  className="text-text-secondary hover:text-critical transition-colors p-1 rounded"
                  title="Logout"
                >
                  <LogOut size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-2 w-full flex items-center justify-center py-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/4"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border-default bg-bg-secondary/50 backdrop-blur-sm flex-shrink-0">
          {/* Page title derived from route */}
          <div>
            <p className="text-xs text-text-secondary font-mono uppercase tracking-widest">
              {NAV_ITEMS.find(n => location.pathname.startsWith(n.path))?.label ?? 'SentinelGrid'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification bell (placeholder) */}
            <button className="text-text-secondary hover:text-text-primary transition-colors relative">
              <Bell size={18} />
            </button>
            <div className="text-sm text-text-secondary font-mono border-l border-border-default pl-4">
              Tenant ID: <span className="text-accent-cyan">{user?.tenant_id}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-bg-primary">
          {children}
        </main>
      </div>
    </div>
  );
}
