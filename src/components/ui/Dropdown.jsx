import { useEffect, useRef, useState } from 'react';

export default function Dropdown({
  trigger,
  children,
  align = 'right',
  width = 'hdx_w-56',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <div className="hdx_relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={`hdx_absolute hdx_top-full hdx_mt-2 hdx_z-40 ${align === 'right' ? 'hdx_right-0' : 'hdx_left-0'} ${width} card hdx_shadow-dropdown hdx_p-1.5 hdx_animate-fade-in`}
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ icon: Icon, children, onClick, danger, divider }) {
  return (
    <>
      {divider && <div className="hdx_my-1.5 hdx_border-t hdx_border-line" />}
      <button
        onClick={onClick}
        className={`hdx_w-full hdx_flex hdx_items-center hdx_gap-2.5 hdx_px-3 hdx_py-2 hdx_rounded-input hdx_text-body hdx_transition-colors ${
          danger ? 'hdx_text-error hdx_hover_bg-red-50' : 'hdx_text-ink-secondary hdx_hover_bg-slate-50 hdx_hover_text-ink'
        }`}
        role="menuitem"
      >
        {Icon && <Icon size={16} />}
        <span className="hdx_font-medium">{children}</span>
      </button>
    </>
  );
}
