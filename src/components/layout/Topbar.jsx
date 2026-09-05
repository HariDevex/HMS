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
    <header className="hdx_sticky hdx_top-0 hdx_z-30 hdx_h-16 hdx_bg-white hdx_border-b hdx_border-line hdx_flex hdx_items-center hdx_gap-3 hdx_px-4 hdx_sm_px-6">
      <button
        className="hdx_lg_hidden hdx_p-2 hdx_rounded-input hdx_text-ink-secondary hdx_hover_bg-slate-100"
        onClick={onMenu}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="hdx_relative hdx_flex-1 hdx_max-w-md hdx_hidden hdx_sm_block">
        <Search size={16} className="hdx_absolute hdx_left-3.5 hdx_top-1/2 hdx_transform hdx_translate-y--1/2 hdx_text-ink-secondary" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search patients, staff, reports…"
          className="input !bg-surface hdx_pl-10"
          aria-label="Global search"
        />
      </div>

      <div className="hdx_flex-1 hdx_sm_hidden" />

      <div className="hdx_flex hdx_items-center hdx_gap-1 hdx_ml-auto">
        <button
          className="hdx_p-2.5 hdx_rounded-input hdx_text-ink-secondary hdx_hover_bg-slate-100 hdx_hover_text-ink hdx_transition-colors"
          onClick={() => setSidebarOpen(true)}
          aria-label="Search"
        >
          <Search size={19} />
        </button>

        <Dropdown
          trigger={
            <button
              className="hdx_relative hdx_p-2.5 hdx_rounded-input hdx_text-ink-secondary hdx_hover_bg-slate-100 hdx_hover_text-ink hdx_transition-colors"
              aria-label={`Notifications, ${unread} unread`}
            >
              <Bell size={19} />
              {unread > 0 && (
                <span className="hdx_absolute hdx_top-1.5 hdx_right-1.5 hdx_h-2 hdx_w-2 hdx_rounded-full hdx_bg-error hdx_ring-2 hdx_ring-white" />
              )}
            </button>
          }
        >
          <div className="hdx_px-3 hdx_py-2 hdx_flex hdx_items-center hdx_justify-between">
            <span className="hdx_text-card-title hdx_text-ink">Notifications</span>
            <BellRing size={16} className="hdx_text-primary" />
          </div>
          <div className="hdx_py-1 hdx_max-h-72 hdx_overflow-y-auto scrollbar-thin">
            {notifications.slice(0, 4).map((n) => (
              <button
                key={n.id}
                className="hdx_w-full hdx_text-left hdx_px-3 hdx_py-2.5 hdx_rounded-input hdx_hover_bg-slate-50"
              >
                <div className="hdx_flex hdx_items-center hdx_gap-2">
                  <span className="hdx_text-body hdx_font-medium hdx_text-ink">#{n.type}</span>
                  {n.unread && <span className="hdx_w-1.5 hdx_h-1.5 hdx_rounded-full hdx_bg-primary" />}
                </div>
                <p className="hdx_text-secondary-text hdx_text-ink-secondary hdx_mt-0.5">{n.message}</p>
                <p className="hdx_text-small hdx_text-ink-secondary hdx_mt-0.5">{n.time}</p>
              </button>
            ))}
          </div>
          <DropdownItem divider onClick={() => navigate('/notifications')} icon={BellRing}>
            View all
          </DropdownItem>
        </Dropdown>

        <button
          className="hdx_hidden hdx_md_inline-flex hdx_p-2.5 hdx_rounded-input hdx_text-ink-secondary hdx_hover_bg-slate-100 hdx_hover_text-ink hdx_transition-colors"
          aria-label="Help"
        >
          <HelpCircle size={19} />
        </button>

        <div className="hdx_hidden hdx_sm_block hdx_w-px hdx_h-7 hdx_bg-line hdx_mx-1" />

        <Dropdown
          width="hdx_w-56"
          trigger={
            <button className="hdx_flex hdx_items-center hdx_gap-2 hdx_px-3 hdx_py-2 hdx_rounded-input hdx_border hdx_border-line hdx_text-body hdx_font-medium hdx_text-ink-secondary hdx_hover_bg-slate-50 hdx_transition-colors" aria-label="Demo role">
              <Shield size={15} className="hdx_text-primary" />
              <span className="hdx_hidden hdx_sm_inline">{role}</span>
              <ChevronDown size={14} />
            </button>
          }
        >
          <p className="hdx_px-3 hdx_py-1.5 hdx_text-small hdx_font-semibold hdx_text-ink-secondary">Demo: switch role</p>
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setRole(r.name);
                navigate('/');
              }}
              className={`hdx_w-full hdx_flex hdx_items-center hdx_gap-2.5 hdx_px-3 hdx_py-2 hdx_rounded-input hdx_text-body hdx_transition-colors ${role === r.name ? 'hdx_bg-primary-light hdx_text-primary hdx_font-medium' : 'hdx_text-ink-secondary hdx_hover_bg-slate-50'}`}
            >
              <Shield size={15} /> {r.name}
            </button>
          ))}
        </Dropdown>

        <Dropdown
          width="hdx_w-60"
          trigger={
            <button className="hdx_flex hdx_items-center hdx_gap-2.5 hdx_p-1.5 hdx_pr-2 hdx_rounded-input hdx_hover_bg-slate-50 hdx_transition-colors">
              <Avatar initials={currentUser.avatar} />
              <span className="hdx_hidden hdx_sm_block hdx_text-left">
                <span className="hdx_block hdx_text-body hdx_font-semibold hdx_text-ink hdx_leading-tight">
                  {currentUser.name}
                </span>
                <span className="hdx_block hdx_text-small hdx_text-ink-secondary hdx_leading-tight">
                  {currentUser.role}
                </span>
              </span>
              <ChevronDown size={15} className="hdx_hidden hdx_sm_block hdx_text-ink-secondary" />
            </button>
          }
        >
          <div className="hdx_px-3 hdx_py-2.5 hdx_flex hdx_items-center hdx_gap-3">
            <Avatar initials={currentUser.avatar} size="lg" />
            <div>
              <p className="hdx_text-body hdx_font-semibold hdx_text-ink">{currentUser.name}</p>
              <p className="hdx_text-small hdx_text-ink-secondary">{currentUser.role}</p>
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
