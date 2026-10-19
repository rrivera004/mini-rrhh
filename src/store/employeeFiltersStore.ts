
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Department, EmployeeStatus } from '../types';

interface EmployeeFiltersState {
  department: Department | '';
  status: EmployeeStatus | '';
  page: number;
  setDepartment: (department: Department | '') => void;
  setStatus: (status: EmployeeStatus | '') => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const initialFilters = {
  department: '' as Department | '',
  status: '' as EmployeeStatus | '',
  page: 1,
};

export const useEmployeeFiltersStore = create<EmployeeFiltersState>()(
  persist(
    (set) => ({
      ...initialFilters,

      setDepartment: (department) =>
        set({ department, page: 1 }),

      setStatus: (status) =>
        set({ status, page: 1 }),

      setPage: (page) =>
        set({ page: Math.max(1, page) }),

      resetFilters: () => set(initialFilters),
    }),
    {
      name: 'employee-filters',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        department: state.department,
        status: state.status,
        page: state.page,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<EmployeeFiltersState> | undefined;

        const departments: Department[] = [
          'Tecnología',
          'Recursos Humanos',
          'Finanzas',
          'Operaciones',
          'Ventas',
        ];

        const statuses: EmployeeStatus[] = [
          'active',
          'inactive',
          'on_leave',
        ];

        return {
          ...current,
          department: departments.includes(saved?.department as Department)
            ? saved!.department as Department
            : '',
          status: statuses.includes(saved?.status as EmployeeStatus)
            ? saved!.status as EmployeeStatus
            : '',
          page:
            typeof saved?.page === 'number' &&
            Number.isInteger(saved.page) &&
            saved.page >= 1
              ? saved.page
              : 1,
        };
      },
    },
  ),
);
