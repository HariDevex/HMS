import { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Settings,
  Shield,
  BellRing,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import { currentUser, notifications, ROLES } from '../../data/mock';
import { useApp } from '../../context/AppContext';

export default function Topbar({ onMenu }) {
  const navigate = useNavigate();
  const { setSidebarOpen, role, setRole } = useApp();
  const [q, setQ] = useState('');
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-line flex items-center gap-3 px-4 sm:px-6">
      <button
        className="lg:hidden p-2 rounded-input text-ink-secondary hover:bg-slate-100"
        onClick={onMenu}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search patients, staff, reports…"
          className="input !bg-surface pl-10"
          aria-label="Global search"
        />
      </div>

      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-1 ml-auto">
        <button
          className="p-2.5 rounded-input text-ink-secondary hover:bg-slate-100 hover:text-ink transition-colors"
          onClick={() => setSidebarOpen(true)}
          aria-label="Search"
        >
          <Search size={19} />
        </button>

        <Dropdown
          trigger={
            <button
              className="relative p-2.5 rounded-input text-ink-secondary hover:bg-slate-100 hover:text-ink transition-colors"
              aria-label={`Notifications, ${unread} unread`}
            >
              <Bell size={19} />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error ring-2 ring-white" />
              )}
            </button>
          }
        >
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-card-title text-ink">Notifications</span>
            <BellRing size={16} className="text-primary" />
          </div>
          <div className="py-1 max-h-72 overflow-y-auto scrollbar-thin">
            {notifications.slice(0, 4).map((n) => (
              <button
                key={n.id}
                className="w-full text-left px-3 py-2.5 rounded-input hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-body font-medium text-ink">#{n.type}</span>
                  {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
                <p className="text-secondary text-ink-secondary mt-0.5">{n.message}</p>
                <p className="text-small text-ink-secondary mt-0.5">{n.time}</p>
              </button>
            ))}
          </div>
          <DropdownItem divider onClick={() => navigate('/notifications')} icon={BellRing}>
            View all
          </DropdownItem>
        </Dropdown>

        <button
          className="hidden md:inline-flex p-2.5 rounded-input text-ink-secondary hover:bg-slate-100 hover:text-ink transition-colors"
          aria-label="Help"
        >
          <HelpCircle size={19} />
        </button>

        <div className="hidden sm:block w-px h-7 bg-line mx-1" />

        <Dropdown
          width="w-56"
          trigger={
            <button className="flex items-center gap-2 px-3 py-2 rounded-input border border-line text-body font-medium text-ink-secondary hover:bg-slate-50 transition-colors" aria-label="Demo role">
              <Shield size={15} className="text-primary" />
              <span className="hidden sm:inline">{role}</span>
              <ChevronDown size={14} />
            </button>
          }
        >
          <p className="px-3 py-1.5 text-small font-semibold text-ink-secondary">Demo: switch role</p>
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setRole(r.name);
                navigate('/');
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-input text-body transition-colors ${role === r.name ? 'bg-primary-light text-primary font-medium' : 'text-ink-secondary hover:bg-slate-50'}`}
            >
              <Shield size={15} /> {r.name}
            </button>
          ))}
        </Dropdown>

        <Dropdown
          width="w-60"
          trigger={
            <button className="flex items-center gap-2.5 p-1.5 pr-2 rounded-input hover:bg-slate-50 transition-colors">
              <Avatar initials={currentUser.avatar} />
              <span className="hidden sm:block text-left">
                <span className="block text-body font-semibold text-ink leading-tight">
                  {currentUser.name}
                </span>
                <span className="block text-small text-ink-secondary leading-tight">
                  {currentUser.role}
                </span>
              </span>
              <ChevronDown size={15} className="hidden sm:block text-ink-secondary" />
            </button>
          }
        >
          <div className="px-3 py-2.5 flex items-center gap-3">
            <Avatar initials={currentUser.avatar} size="lg" />
            <div>
              <p className="text-body font-semibold text-ink">{currentUser.name}</p>
              <p className="text-small text-ink-secondary">{currentUser.role}</p>
            </div>
          </div>
          <DropdownItem icon={UserIcon} onClick={() => navigate('/settings')}>My Profile</DropdownItem>
          <DropdownItem icon={Shield} onClick={() => navigate('/settings')}>Security</DropdownItem>
          <DropdownItem icon={BellRing} onClick={() => navigate('/notifications')}>Notifications</DropdownItem>
          <DropdownItem icon={Settings} onClick={() => navigate('/settings')}>Settings</DropdownItem>
          <DropdownItem divider danger icon={LogOut} onClick={() => navigate('/login')}>Sign out</DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
