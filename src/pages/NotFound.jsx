import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full mb-2">
        Error 404
      </span>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        Page Not Found
      </h2>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">
        The hospital record or clinical module you requested does not exist or has been archived.
      </p>

      <div className="flex items-center gap-3">
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="primary" icon={Home} onClick={() => navigate('/')}>
          Hospital Home
        </Button>
      </div>
    </div>
  );
}
