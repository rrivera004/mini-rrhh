// src/pages/EmployeesPage.tsx

import { useState, useEffect, useCallback } from 'react';
import type {
  Employee,
  Department,
  EmployeeStatus,
  EmployeeRole
} from '../types';

import { mockEmployees } from '../utils/mockData';
import EmployeeCard from '../components/EmployeeCard';
import StatsBadge from '../components/StatsBadge';
import FormField from '../components/FormField';



function EmployeesPage() {

  // Estado de la lista completa (simulando datos del servidor)
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estado de los filtros
  const [search, setSearch] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | ''>('');

  const [selectedStatus, setSelectedStatus] =
    useState<EmployeeStatus | ''>('');


    // Añade este estado al inicio del componente:
const [showForm, setShowForm] = useState<boolean>(false);

const [newName, setNewName] = useState<string>('');
const [newEmail, setNewEmail] = useState<string>('');
const [newPosition, setNewPosition] = useState<string>('');
const [newDepartment, setNewDepartment] = useState<Department>('Tecnología');
const [newSalary, setNewSalary] = useState<string>('');
const [newHireDate, setNewHireDate] = useState<string>('');
const [newStatus, setNewStatus] = useState<EmployeeStatus>('active');
const [newRole, setNewRole] = useState<EmployeeRole>('employee');
const [newPhone, setNewPhone] = useState<string>('');
const [newAvatarUrl, setNewAvatarUrl] = useState<string>('');
const [guardarHover, setGuardarHover] = useState(false);
const [cancelarHover, setCancelarHover] = useState(false);
const [attemptedSubmit, setAttemptedSubmit] = useState(false);

// Simular carga de datos (en clases siguientes conectaremos la API real)
useEffect(() => {
  const timer = setTimeout(() => {
    setEmployees(mockEmployees);
    setLoading(false);
  }, 800); // Simula latencia de red

  return () => clearTimeout(timer); // Cleanup: cancelar si el componente se desmonta
}, []);

// Filtrar empleados según los criterios activos
const filteredEmployees = employees.filter(emp => {
const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
emp.email.toLowerCase().includes(search.toLowerCase()) ||
emp.position.toLowerCase().includes(search.toLowerCase());
const matchesDepartment = !selectedDepartment || emp.department === selectedDepartment;
const matchesStatus = !selectedStatus || emp.status === selectedStatus;
return matchesSearch && matchesDepartment && matchesStatus;
});


// Estadísticas generales (sobre el total de empleados, no sobre el filtro activo)
const totalEmployees = employees.length;
const activeEmployees = employees.filter(emp => emp.status === 'active').length;
const onLeaveEmployees = employees.filter(emp => emp.status === 'on_leave').length;
const inactiveEmployees = employees.filter(emp => emp.status === 'inactive').length;


// Memoizamos el handler para no recrearlo en cada render
const handleSelectEmployee = useCallback((employee: Employee) => {
alert(`Empleado: ${employee.name}\nCargo: ${employee.position}\nDepartamento:
${employee.department}`);
}, []);
const handleDeleteEmployee = useCallback((id: number) => {
if (!confirm('¿Estás seguro de eliminar este empleado?')) return;
setEmployees(prev => prev.filter(emp => emp.id !== id));
}, []);



// Handler para agregar empleado
const handleAddEmployee = useCallback(() => {
if (!newName.trim() || !newEmail.trim() || !newPosition.trim() || !newHireDate || !newSalary.trim()) return;
const newEmployee: Employee = {
id: Date.now(), // ID temporal
name: newName.trim(),
email: newEmail.trim(),
position: newPosition.trim(),
department: newDepartment,
salary: Number(newSalary) || 0,
hireDate: newHireDate,
status: newStatus,
role: newRole,
...(newPhone.trim() && { phone: newPhone.trim() }),
...(newAvatarUrl.trim() && { avatarUrl: newAvatarUrl.trim() }),
};

setEmployees(prev => [...prev, newEmployee]);
setNewName('');
setNewEmail('');
setNewPosition('');
setNewDepartment('Tecnología');
setNewSalary('');
setNewHireDate('');
setNewStatus('active');
setNewRole('employee');
setNewPhone('');
setNewAvatarUrl('');
setShowForm(false);
}, [newName, newEmail, newPosition, newDepartment, newSalary, newHireDate, newStatus, newRole, newPhone, newAvatarUrl]);


const departments: Department[] = ['Tecnología', 'Recursos Humanos', 'Finanzas', 'Operaciones', 'Ventas'];
const statuses: EmployeeStatus[] = ['active', 'inactive', 'on_leave'];
const statusLabels: Record<EmployeeStatus, string> = {
active: 'Activo',
inactive: 'Inactivo',
on_leave: 'En permiso',
};
const roles: EmployeeRole[] = ['employee', 'hr', 'admin'];
const roleLabels: Record<EmployeeRole, string> = {
employee: 'Empleado',
hr: 'Recursos Humanos',
admin: 'Administrador',
};

const formFieldClass =
  'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';



return (
<div style={{ padding: '24px' }}>
{/* Encabezado */}
<div className="mb-6 flex justify-between items-start">
  <div>
    <h2 className="text-2xl font-bold text-slate-900">
      Gestión de Empleados
    </h2>

    <p className="text-slate-500 mt-1">
      {filteredEmployees.length} de {employees.length} empleados
    </p>
  </div>

  <button
    onClick={() => setShowForm(!showForm)}
    className="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
  >
    + Agregar empleado
  </button>
</div>



{/* Estadísticas */}
<div className="flex flex-wrap gap-4 mb-6">
  <StatsBadge
    label="Total de empleados"
    value={totalEmployees}
    variant="blue"
  />

  <StatsBadge
    label="Empleados activos"
    value={activeEmployees}
    variant="green"
  />

  <StatsBadge
    label="Empleados en permiso"
    value={onLeaveEmployees}
    variant="yellow"
  />

  <StatsBadge
    label="Empleados inactivos"
    value={inactiveEmployees}
    variant="red"
  />
</div>



{showForm && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}
  >
   <div
  style={{
    background: 'white',
    borderRadius: '18px',
    padding: '24px',
    width: '75%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '1px solid #bfdbfe',
    boxShadow: '0 20px 60px rgba(0,0,0,0.20)',
  }}
>
<div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e2e8f0',
  }}
>
  <div>
    <h2
      style={{
        margin: 0,
        color: '#1e293b',
        fontSize: '24px',
      }}
    >
      👤 Nuevo empleado
    </h2>

    <p
      style={{
        margin: '6px 0 0',
        color: '#64748b',
        fontSize: '14px',
      }}
    >
      Complete la información del colaborador.
    </p>
  </div>

  <button
   onClick={() => setShowForm(false)}
    style={{
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      border: 'none',
      background: '#f1f5f9',
      color: '#475569',
      fontSize: '20px',
      cursor: 'pointer',
      transition: '0.2s',
    }}
  >
    ✕
  </button>

    </div>

<div
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
    marginTop: '20px',
  }}
>
  


<FormField label="Nombre *">
  <input
    type="text"
    value={newName}
    onChange={(e) => setNewName(e.target.value)}
    placeholder="Ej. Juan Pérez"
    autoFocus
    className={formFieldClass}
  />
 </FormField>


<FormField label="Email *">
  <input
    type="email"
    value={newEmail}
    onChange={(e) => setNewEmail(e.target.value)}
    placeholder="juan.perez@empresa.com"
   className={formFieldClass}
  />
   </FormField>



<FormField label="Cargo *">
  <input
    type="text"
    value={newPosition}
    onChange={(e) => setNewPosition(e.target.value)}
    placeholder="Ej. Analista de Ventas"
    className={formFieldClass}
  />
</FormField>





<FormField label="Departamento *">
  <select
    value={newDepartment}
    onChange={(e) => setNewDepartment(e.target.value as Department)}
    className={formFieldClass}
  >
    {departments.map(dept => (
      <option key={dept} value={dept}>
        {dept}
      </option>
    ))}
  </select>
</FormField>





<FormField label="Salario mensual *">
  <input
    type="number"
    min="0"
    value={newSalary}
    onChange={(e) => setNewSalary(e.target.value)}
    placeholder="Ej. 8500"
    className={formFieldClass}
  />
</FormField>







<FormField label="Fecha de ingreso *">
  <input
    type="date"
    value={newHireDate}
    onChange={(e) => setNewHireDate(e.target.value)}
    className={formFieldClass}
  />
</FormField>




<FormField label="Estado *">
  <select
    value={newStatus}
    onChange={(e) => setNewStatus(e.target.value as EmployeeStatus)}
    className={formFieldClass}
  >
    {statuses.map(status => (
      <option key={status} value={status}>
        {statusLabels[status]}
      </option>
    ))}
  </select>
</FormField>






<FormField label="Rol *">
  <select
    value={newRole}
    onChange={(e) => setNewRole(e.target.value as EmployeeRole)}
    className={formFieldClass}
  >
    {roles.map(role => (
      <option key={role} value={role}>
        {roleLabels[role]}
      </option>
    ))}
  </select>
</FormField>







<FormField label="Teléfono (opcional)">
  <input
    type="text"
    value={newPhone}
    onChange={(e) => setNewPhone(e.target.value)}
    placeholder="Ej. 5555-5555"
    className={formFieldClass}
  />
</FormField>







<FormField label="URL de foto (opcional)">
  <input
    type="text"
    value={newAvatarUrl}
    onChange={(e) => setNewAvatarUrl(e.target.value)}
    placeholder="https://..."
    className={formFieldClass}
  />
</FormField>
</div>

<div
  style={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  }}
>
  <button
  onClick={handleAddEmployee}
  onMouseEnter={() => setGuardarHover(true)}
  onMouseLeave={() => setGuardarHover(false)}
  style={{
    padding: '11px 24px',
    background: guardarHover ? '#1d4ed8' : '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
    boxShadow: guardarHover
      ? '0 8px 20px rgba(37,99,235,.45)'
      : '0 4px 12px rgba(37,99,235,.25)',
    transform: guardarHover ? 'translateY(-1px)' : 'translateY(0)',
    transition: 'all 0.15s ease',
  }}
>
  Guardar
</button>

<button
  onClick={() => setShowForm(false)}
  onMouseEnter={() => setCancelarHover(true)}
  onMouseLeave={() => setCancelarHover(false)}
  style={{
    padding: '11px 24px',
    background: cancelarHover ? '#e2e8f0' : '#f8fafc',
    color: '#334155',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '14px',
    transform: cancelarHover ? 'translateY(-1px)' : 'translateY(0)',
    transition: 'all 0.15s ease',
  }}
>
  Cancelar
</button>
</div>

</div>

</div>





)}

{/* Barra de filtros */}
<div
  style={{
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  }}
>
<FormField
  label="Buscar"
  className="flex-1 min-w-[220px]"
>
  <input
    type="text"
    placeholder="Buscar por nombre, email o cargo..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className={formFieldClass}
  />
</FormField>


{/* Filtro por departamento */}
<FormField
  label="Departamento"
  className="min-w-[180px]"
>
  <select
    value={selectedDepartment}
    onChange={(e) =>
      setSelectedDepartment(e.target.value as Department | '')
    }
    className={formFieldClass}
  >
    <option value="">Todos los departamentos</option>
    {departments.map((dept) => (
      <option key={dept} value={dept}>
        {dept}
      </option>
    ))}
  </select>
</FormField>


{/* Filtro por estado */}
<FormField
  label="Estado"
  className="min-w-[160px]"
>
  <select
    value={selectedStatus}
    onChange={(e) =>
      setSelectedStatus(e.target.value as EmployeeStatus | '')
    }
    className={formFieldClass}
  >
    <option value="">Todos los estados</option>
    {statuses.map((status) => (
      <option key={status} value={status}>
        {statusLabels[status]}
      </option>
    ))}
  </select>
</FormField>


{/* Botón limpiar filtros */}
{(search || selectedDepartment || selectedStatus) && (
  <button
    onClick={() => {
      setSearch('');
      setSelectedDepartment('');
      setSelectedStatus('');
    }}
    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm transition-colors"
  >
    Limpiar filtros
  </button>
)}
</div>
{/* Estado de carga */}
{loading && (
  <div
    style={{
      textAlign: 'center',
      padding: '48px',
      color: '#64748b',
    }}
  >
    Cargando empleados...
  </div>
)}

{/* Lista de empleados */}
{!loading && filteredEmployees.length > 0 && (
  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
    {filteredEmployees.map((employee) => (
      <div
        key={employee.id}
        style={{ position: 'relative' }}
      >
        <button
          onClick={() => handleDeleteEmployee(employee.id)}
          aria-label="Eliminar empleado"
          title="Eliminar empleado"
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            zIndex: 1,
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid white',
            background: '#ef4444',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            lineHeight: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          }}
        >
          X
        </button>

        <EmployeeCard
          employee={employee}
          onSelect={handleSelectEmployee}
        />
      </div>
    ))}
  </div>
)}

  </div>
);
}

export default EmployeesPage;