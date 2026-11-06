
import { apiClient } from './api';

export interface EmployeeDocument {
  id: number;
  employeeId: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  documentType: 'contract' | 'id' | 'certificate' | 'other';
  uploadedAt: string;
  url?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return 'Archivo demasiado grande (máx. 5MB).';
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Solo PDF, JPG y PNG permitidos.';
  }

  return null;
}

export const documentService = {
  // Listar documentos de un empleado
  getByEmployee: async (
    employeeId: number
  ): Promise<EmployeeDocument[]> => {
    const response = await apiClient.get<EmployeeDocument[]>(
      `/employees/${employeeId}/documents`
    );

    return response.data;
  },

  // Subir documento
  upload: async (
    employeeId: number,
    file: File,
    documentType: EmployeeDocument['documentType'],
    onProgress?: (percent: number) => void
  ): Promise<EmployeeDocument> => {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('documentType', documentType);

    const response = await apiClient.post<EmployeeDocument>(
      `/employees/${employeeId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (e) => {
          const percent = Math.round(
            (e.loaded * 100) / (e.total ?? 1)
          );

          onProgress?.(percent);
        },
      }
    );

    return response.data;
  },

  // Descargar documento
  download: async (
    documentId: number,
    filename: string
  ): Promise<void> => {
    const response = await apiClient.get(
      `/documents/${documentId}/download`,
      {
        responseType: 'blob',
      }
    );

    const url = URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', filename);

    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);

    URL.revokeObjectURL(url);
  },

  // Eliminar documento
  delete: async (documentId: number): Promise<void> => {
    await apiClient.delete(`/documents/${documentId}`);
  },
};
