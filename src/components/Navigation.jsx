import React from 'react';
import { LayoutDashboard, Calendar, CheckSquare, BarChart3, FileSpreadsheet, Settings, LogOut, BookOpen, Menu, X, User } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab, user, onLogout, isMobileOpen, setIsMobileOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'task', label: 'Task', icon: CheckSquare },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'report', label: 'Report', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0F382C] text-[#FAF7F0] p-5 selection:bg-white/20">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-6 border-b border-emerald-800/60 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#1B5E4B] text-[#FAF7F0] shadow-inner">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-wider">NEXORA</h1>
            <p className="text-[10px] tracking-widest text-emerald-300 font-semibold uppercase">STUDY PLATFORM</p>
          </div>
        </div>
        {isMobileOpen && (
          <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-slate-300">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (setIsMobileOpen) setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive 
                  ? 'bg-[#1B5E4B] text-white shadow-md border border-emerald-600/40 translate-x-1' 
                  : 'text-emerald-100/70 hover:bg-emerald-900/40 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-300' : 'text-emerald-300'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile Card */}
      <div className="pt-4 border-t border-emerald-800/60">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#08251C]/80 border border-emerald-800/40 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#1B5E4B] flex items-center justify-center font-bold text-white text-base">
            {user?.firstName ? user.firstName[0] : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-emerald-300/80 truncate font-mono">
              ID: {user?.userId || '8f42c1e7-....'}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500/20 text-xs font-semibold transition-colors border border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0F382C] text-white sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-300" />
          <span className="font-extrabold tracking-wider text-base">NEXORA STUDY</span>
        </div>
        <button onClick={() => setIsMobileOpen(true)} className="p-2 rounded-lg bg-emerald-900/60">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="relative w-4/5 max-w-xs h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}