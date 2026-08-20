// src/pages/DashboardPage.tsx

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { mockEmployees } from '../utils/mockData';

function DashboardPage() {

  const [showWelcome, setShowWelcome] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowWelcome(false);
  }, 3000);

  return () => clearTimeout(timer);
}, []);


  const total = mockEmployees.length;

  const active = mockEmployees.filter(
    e => e.status === 'active'
  ).length;

  const onLeave = mockEmployees.filter(
    e => e.status === 'on_leave'
  ).length;

  const userName = localStorage.getItem('userName') || 'Usuario';

  const stats = [
    {
      label: 'Total empleados',
      value: total,
      color: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    {
      label: 'Activos',
      value: active,
      color: 'bg-green-100',
      textColor: 'text-green-800'
    },
    {
      label: 'En permiso',
      value: onLeave,
      color: 'bg-yellow-100',
      textColor: 'text-yellow-800'
    },
  ];

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Dashboard
      </h2>

     <p
  className={`text-slate-600 mb-6 transition-all duration-700 ${
    showWelcome
      ? 'opacity-100 translate-y-0'
      : 'opacity-100'
  }`}
>
  {showWelcome ? 'Bienvenido, ' : ''}
  <span className="font-bold text-slate-800">{userName}</span>
</p>

      {/* Tarjetas de estadísticas */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">

        {stats.map(stat => (
          <div
            key={stat.label}
            className={`${stat.color} p-6 rounded-xl flex-1 min-w-0 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer`}
          >
            <p className={`mb-1 ${stat.textColor} text-sm`}>
              {stat.label}
            </p>

            <p
              className={`text-4xl font-bold ${stat.textColor}`}
            >
              {stat.value}
            </p>
          </div>
        ))}

      </div>

      {/* Botón para ir a empleados */}
      <div className="flex gap-3">
        <Link
          to="/empleados"
          className="px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white rounded-md no-underline text-sm transition-colors duration-200"
        >
          Ver empleados →
        </Link>
      </div>

    </div>
  );
}

export default DashboardPage;