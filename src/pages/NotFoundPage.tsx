// src/pages/NotFoundPage.tsx

import { Link } from 'react-router-dom';
import { usePageNotFound } from '../hooks/usePageNotFound';

function NotFoundPage() {
    usePageNotFound();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-10">

          <div className="text-7xl mb-6">
            🔎
          </div>

          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
            Error 404
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Página no encontrada
          </h1>

          <p className="text-slate-500 mb-8">
            La página que estás buscando no existe o la dirección
            que ingresaste no es válida.
          </p>

          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-brand-800 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors"
          >
            ← Volver al Dashboard
          </Link>

        </div>

      </div>
    </div>
  );
}

export default NotFoundPage;
