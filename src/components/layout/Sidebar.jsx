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
    <nav className="hdx_flex-1 hdx_px-3 hdx_space-y-0.5 hdx_overflow-y-auto scrollbar-thin">
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
              `hdx_flex hdx_items-center hdx_gap-3 hdx_px-3 hdx_py-2.5 hdx_rounded-8 hdx_text-14px hdx_font-medium hdx_transition-colors hdx_duration-150 ${
                isActive
                  ? 'hdx_bg-primary-light !text-primary'
                  : 'hdx_text-ink-secondary hdx_hover_bg-slate-50 hdx_hover_text-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'hdx_text-primary' : 'hdx_text-ink-secondary'} strokeWidth={2} />
                <span className="hdx_flex-1">{item.label}</span>
                {unread > 0 && (
                  <span className="hdx_min-w-18px hdx_h-18px hdx_px-1 hdx_rounded-full hdx_bg-error hdx_text-white hdx_text-11 hdx_font-semibold hdx_flex hdx_items-center hdx_justify-center">
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
      <div className="hdx_fixed hdx_inset-0 hdx_z-50 hdx_lg_hidden">
        <div className="hdx_absolute hdx_inset-0 hdx_bg-slate-900-40" onClick={onClose} />
        <aside className="hdx_absolute hdx_left-0 hdx_top-0 hdx_h-full hdx_w-270px hdx_bg-white hdx_border-r hdx_border-line hdx_flex hdx_flex-col hdx_animate-slide-in-right">
          <div className="hdx_flex hdx_items-center hdx_justify-between hdx_px-5 hdx_h-16 hdx_border-b hdx_border-line">
            <Logo />
            <button onClick={onClose} className="hdx_p-2 hdx_rounded-input hdx_text-ink-secondary hdx_hover_bg-slate-100" aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
          <div className="hdx_py-3">
            <NavList onNavigate={onClose} />
          </div>
          <UserFooter />
        </aside>
      </div>
    );
  }

  return (
    <aside className="hdx_hidden hdx_lg_flex hdx_flex-col hdx_w-260px hdx_shrink-0 hdx_h-screen hdx_sticky hdx_top-0 hdx_bg-white hdx_border-r hdx_border-line">
      <div className="hdx_flex hdx_items-center hdx_px-5 hdx_h-16 hdx_border-b hdx_border-line">
        <Logo />
      </div>
      <div className="hdx_py-3">
        <NavList />
      </div>
      <div className="hdx_mx-3 hdx_mb-3 hdx_px-3 hdx_py-2.5 hdx_rounded-card hdx_bg-primary-light hdx_flex hdx_items-center hdx_gap-2.5">
        <Shield size={16} className="hdx_text-primary" />
        <div>
          <p className="hdx_text-small hdx_font-semibold hdx_text-primary hdx_leading-tight">HIPAA Protected</p>
          <p className="hdx_text-11 hdx_text-ink-secondary hdx_leading-tight">Secured session active</p>
        </div>
      </div>
      <UserFooter />
    </aside>
  );
}

function UserFooter() {
  const navigate = useNavigate();
  return (
    <div className="hdx_border-t hdx_border-line hdx_p-3">
      <button
        onClick={() => navigate('/login')}
        className="hdx_w-full hdx_flex hdx_items-center hdx_gap-3 hdx_px-2 hdx_py-2 hdx_rounded-8 hdx_hover_bg-slate-50 hdx_transition-colors"
      >
        <Avatar initials={currentUser.avatar} />
        <span className="hdx_flex-1 hdx_text-left">
          <span className="hdx_block hdx_text-body hdx_font-semibold hdx_text-ink hdx_leading-tight">{currentUser.name}</span>
          <span className="hdx_block hdx_text-small hdx_text-ink-secondary hdx_leading-tight">{currentUser.role}</span>
        </span>
        <LogOut size={17} className="hdx_text-ink-secondary" />
      </button>
    </div>
  );
}
