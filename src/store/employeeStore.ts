// src/store/employeeStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../types';
import { mockEmployees } from '../utils/mockData';

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;

  fetchEmployees: () => Promise<void>;
  addEmployee: (data: CreateEmployeeDto) => boolean;
  updateEmployee: (id: number, data: UpdateEmployeeDto) => void;
  deleteEmployee: (id: number) => void;
  selectEmployee: (employee: Employee | null) => void;
}

export const useEmployeeStore = create<EmployeeState>()(
  devtools((set, get) => ({
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,

  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    // Simular carga de API
    await new Promise((resolve) => setTimeout(resolve, 600));
    set(
  { employees: mockEmployees, isLoading: false },
  false,
  "fetchEmployees"
);
  },

  addEmployee: (data: CreateEmployeeDto) => {
  // Usamos get() para leer el estado actual sin depender del callback de set()
  const emailTaken = get().employees.some(emp => emp.email === data.email);

  if (emailTaken) {
    set({ error: `Ya existe un empleado con el email ${data.email}.` });
    return false;
  }

  const newEmployee: Employee = {
    ...data,
    id: Date.now(),
  };

  set(
  (state) => ({
    employees: [...state.employees, newEmployee],
    error: null
  }),
  false,
  "addEmployee"
);

  return true;
},

updateEmployee: (id: number, data: UpdateEmployeeDto) => {
  set(
  (state) => ({
    employees: state.employees.map((emp) =>
      emp.id === id ? { ...emp, ...data } : emp
    )
  }),
  false,
  "updateEmployee"
);
},

deleteEmployee: (id: number) => {
 set(
  (state) => ({
    employees: state.employees.filter((emp) => emp.id !== id),
    selectedEmployee:
      state.selectedEmployee?.id === id
        ? null
        : state.selectedEmployee,
  }),
  false,
  "deleteEmployee"
);
},

  selectEmployee: (employee: Employee | null) => {
  set(
    { selectedEmployee: employee },
    false,
    "selectEmployee"
  );
},
}), {
  name: 'Employee Store',
})
);