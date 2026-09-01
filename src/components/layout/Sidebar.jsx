import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, X, Shield } from 'lucide-react';
import Logo from '../Logo';
import Avatar from '../ui/Avatar';
import { getRoleNav } from '../../config/sidebar';
import { currentUser, notifications } from '../../data/mock';
import { useApp } from '../../context/AppContext';

function NavList({ onNavigate }) {
  const { role } = useApp();
  const normalized = ['administrator', 'admin'].includes(role.toLowerCase()) ? 'admin' : role.toLowerCase();
  const items = getRoleNav(normalized);
  return (
    <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-thin">
      {items.map((item) => {
        const Icon = item.icon;
        const unread = item.badge ? notifications.filter((n) => n.unread).length : 0;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-primary-light !text-primary'
                  : 'text-ink-secondary hover:bg-slate-50 hover:text-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-primary' : 'text-ink-secondary'} strokeWidth={2} />
                <span className="flex-1">{item.label}</span>
                {unread > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-error text-white text-[11px] font-semibold flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default function Sidebar({ mobile, onClose }) {
  if (mobile) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
        <aside className="absolute left-0 top-0 h-full w-[270px] bg-white border-r border-line flex flex-col animate-slide-in-right">
          <div className="flex items-center justify-between px-5 h-16 border-b border-line">
            <Logo />
            <button onClick={onClose} className="p-2 rounded-input text-ink-secondary hover:bg-slate-100" aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
          <div className="py-3">
            <NavList onNavigate={onClose} />
          </div>
          <UserFooter />
        </aside>
      </div>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 h-screen sticky top-0 bg-white border-r border-line">
      <div className="flex items-center px-5 h-16 border-b border-line">
        <Logo />
      </div>
      <div className="py-3">
        <NavList />
      </div>
      <div className="mx-3 mb-3 px-3 py-2.5 rounded-card bg-primary-light flex items-center gap-2.5">
        <Shield size={16} className="text-primary" />
        <div>
          <p className="text-small font-semibold text-primary leading-tight">HIPAA Protected</p>
          <p className="text-[11px] text-ink-secondary leading-tight">Secured session active</p>
        </div>
      </div>
      <UserFooter />
    </aside>
  );
}

function UserFooter() {
  const navigate = useNavigate();
  return (
    <div className="border-t border-line p-3">
      <button
        onClick={() => navigate('/login')}
        className="w-full flex items-center gap-3 px-2 py-2 rounded-[8px] hover:bg-slate-50 transition-colors"
      >
        <Avatar initials={currentUser.avatar} />
        <span className="flex-1 text-left">
          <span className="block text-body font-semibold text-ink leading-tight">{currentUser.name}</span>
          <span className="block text-small text-ink-secondary leading-tight">{currentUser.role}</span>
        </span>
        <LogOut size={17} className="text-ink-secondary" />
      </button>
    </div>
  );
}
