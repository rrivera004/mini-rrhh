// src/layouts/Header.tsx
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { User } from '../types';

interface HeaderProps {
  user?: User;
  onLogout?: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/empleados', label: 'Empleados' },
];

function Header({ user, onLogout }: HeaderProps) {
  const { pathname } = useLocation();


  const [showWelcome, setShowWelcome] = useState(true);

useEffect(() => {
  if (!user) return;

  const timer = setTimeout(() => {
    setShowWelcome(false);
  }, 5000);

  return () => clearTimeout(timer);
}, [user]);

  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="w-full px-6 py-4 grid grid-cols-[auto_1fr_auto] items-center">

        {/* Logo */}
        <div className="flex items-center gap-3 justify-start">
          <span className="text-2xl">👥</span>
          <span className="font-bold text-xl tracking-tight">
            Mini RRHH
          </span>
        </div>

        {/* Navegación */}
        {user && (
          <nav className="hidden sm:flex items-center justify-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${
                    pathname.startsWith(item.to)
                      ? 'bg-white/20 text-white'
                      : 'text-white/75 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Usuario */}
        {user && (
          <div className="flex items-center justify-end gap-3">
           <div className="flex items-center text-sm text-white">
  {showWelcome && (
    <span className="mr-2 font-bold animate-pulse">
      ✨ Bienvenido, {user.name} ✨
    </span>
  )}

  {!showWelcome && (
    <span className="mr-2 font-bold">
      {user.name}
    </span>
  )}
</div>

            <span className="text-xs bg-blue-500 px-2 py-0.5 rounded-full uppercase font-medium">
              {user.role}
            </span>

            {onLogout && (
              <button
                onClick={onLogout}
                className="text-sm text-white border border-white/30 hover:border-white/60 px-3 py-1.5 rounded-md transition-colors"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        )}

      </div>
    </header>
  );
}

export default Header;