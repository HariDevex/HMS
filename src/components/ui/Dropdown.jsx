import { useEffect, useRef, useState } from 'react';

export default function Dropdown({
  trigger,
  children,
  align = 'right',
  width = 'w-56',
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
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={`absolute top-full mt-2 z-40 ${align === 'right' ? 'right-0' : 'left-0'} ${width} card shadow-dropdown p-1.5 animate-fade-in`}
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
      {divider && <div className="my-1.5 border-t border-line" />}
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-input text-body transition-colors ${
          danger ? 'text-error hover:bg-red-50' : 'text-ink-secondary hover:bg-slate-50 hover:text-ink'
        }`}
        role="menuitem"
      >
        {Icon && <Icon size={16} />}
        <span className="font-medium">{children}</span>
      </button>
    </>
  );
}
