import { useParams, useNavigate } from 'react-router-dom';
import { useEmployee } from '../hooks/useEmployees';

function EmployeeDetailPage() {
 const { id: idParam } = useParams<{ id: string }>();
const navigate = useNavigate();

const id = idParam ? Number(idParam) : null;

const { data: employee, isLoading, isError } = useEmployee(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mr-3" />
        <span>Cargando empleado...</span>
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">Error al cargar el empleado</p>
          <button
            onClick={() => navigate('/empleados')}
            className="mt-4 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-full bg-slate-50 p-6">
    <button
      onClick={() => navigate('/empleados')}
      className="mb-6 inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
    >
      ← Volver
    </button>

    <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-linear-to-r from-blue-700 to-blue-500 px-6 py-6">
        <h2 className="text-2xl font-bold text-white">
          Detalle del empleado
        </h2>
        <p className="text-blue-100 mt-1">
          Información general del empleado
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Nombre</p>
            <p className="font-semibold text-slate-900">{employee.name}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Email</p>
            <p className="font-semibold text-slate-900 wrap-break-word">
              {employee.email}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Cargo</p>
            <p className="font-semibold text-slate-900">{employee.position}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Departamento</p>
            <p className="font-semibold text-slate-900">
              {employee.department}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Salario mensual</p>
            <p className="font-semibold text-green-700">
              Q {employee.salary.toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Fecha de ingreso</p>
            <p className="font-semibold text-slate-900">
              {employee.hireDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default EmployeeDetailPage;