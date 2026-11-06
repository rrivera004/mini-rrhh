
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployee } from '../hooks/useEmployees';
import FileUpload from '../components/FileUpload';
import type { EmployeeDocument } from '../service/documentService';

function EmployeeExpedientePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const employeeId = id ? Number(id) : null;

  const { data: employee, isLoading, isError } =
    useEmployee(employeeId);

  const [documents, setDocuments] = useState<EmployeeDocument[]>(() => [
    {
      id: 1,
      employeeId: employeeId ?? 0,
      filename: 'contrato.pdf',
      originalName: 'Contrato laboral.pdf',
      mimeType: 'application/pdf',
      size: 250000,
      documentType: 'contract',
      uploadedAt: '2026-10-20T10:00:00',
    },
    {
      id: 2,
      employeeId: employeeId ?? 0,
      filename: 'certificado.pdf',
      originalName: 'Certificado de estudios.pdf',
      mimeType: 'application/pdf',
      size: 180000,
      documentType: 'certificate',
      uploadedAt: '2026-10-22T10:00:00',
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Simulación de subida con progreso de 20 en 20
  const handleUpload = (
    file: File,
    documentType: EmployeeDocument['documentType']
  ): Promise<void> => {
    setIsUploading(true);
    setUploadProgress(0);

    return new Promise((resolve) => {
      let progress = 0;

      const interval = setInterval(() => {
        progress += 20;
        setUploadProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);

          const newDocument: EmployeeDocument = {
            id: Date.now(),
            employeeId: employeeId ?? 0,
            filename: file.name,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            documentType,
            uploadedAt: new Date().toISOString(),
          };

          setDocuments((previous) => [
            ...previous,
            newDocument,
          ]);

          setIsUploading(false);
          resolve();
        }
      }, 400);
    });
  };

  // Descarga de ejemplo utilizando Blob
  
const handleDownload = (doc: EmployeeDocument) => {
  const content = [
    'DOCUMENTO DE EJEMPLO',
    `Nombre: ${doc.originalName}`,
    `Tipo: ${doc.documentType}`,
    `Empleado: ${employee?.name ?? ''}`,
    `Fecha: ${doc.uploadedAt}`,
  ].join('\n');

  const blob = new Blob([content], {
    type: 'text/plain',
  });

  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');

  link.href = url;
  link.download = doc.originalName;

  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);

  URL.revokeObjectURL(url);
};


  if (isLoading) {
    return <div className="p-6">Cargando empleado...</div>;
  }

  if (isError || !employee) {
    return (
      <div className="p-6">
        <p>No se pudo encontrar el empleado.</p>
        <button onClick={() => navigate('/empleados')}>
          Volver a empleados
        </button>
      </div>
    );
  }

  const departmentData = employee.department as unknown;

  const departmentName =
    typeof departmentData === 'object' &&
    departmentData !== null &&
    'name' in departmentData
      ? String(departmentData.name)
      : String(departmentData ?? '');

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate(`/empleados/${employee.id}`)}
        className="text-blue-600 hover:underline"
      >
        ← Volver al empleado
      </button>

      {/* Información del empleado */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold">
          Expediente de {employee.name}
        </h1>

        <p className="text-gray-600 mt-2">
          Puesto: {employee.position}
        </p>

        <p className="text-gray-600">
          Departamento: {departmentName}
        </p>

        <p className="text-gray-600">
          Correo: {employee.email}
        </p>
      </div>

      {/* Subida de documentos */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          Subir documento
        </h2>

        <FileUpload
          onFileSelected={handleUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
      </div>

      {/* Lista de documentos */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          Documentación del empleado
        </h2>

        {documents.length === 0 ? (
          <p className="text-gray-500">
            Este empleado todavía no tiene documentos.
          </p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-wrap items-center justify-between gap-3 border rounded-lg p-4"
            >
              <div>
                <p className="font-medium">
                  {doc.originalName}
                </p>

                <p className="text-sm text-gray-500">
                  Tipo: {doc.documentType}
                </p>

                <p className="text-xs text-gray-400">
                  Fecha: {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => handleDownload(doc)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
              >
                Descargar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EmployeeExpedientePage;
