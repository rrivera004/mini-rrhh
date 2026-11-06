
import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import {
  validateFile,
  type EmployeeDocument,
} from '../service/documentService';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  onFileSelected: (
    file: File,
    documentType: EmployeeDocument['documentType']
  ) => Promise<void>;
  isUploading?: boolean;
  uploadProgress?: number;
}

const documentTypes: {
  value: EmployeeDocument['documentType'];
  label: string;
}[] = [
  { value: 'contract', label: 'Contrato laboral' },
  { value: 'id', label: 'Identificación' },
  { value: 'certificate', label: 'Certificado / Título' },
  { value: 'other', label: 'Otro documento' },
];

function FileUpload({
  onFileSelected,
  isUploading = false,
  uploadProgress = 0,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] =
    useState<EmployeeDocument['documentType']>('other');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const error = validateFile(file);

    if (error) {
      setValidationError(error);
      setSelectedFile(null);
      return;
    }

    setValidationError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];

    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    await onFileSelected(selectedFile, documentType);

    setSelectedFile(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Zona de arrastre */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center
          cursor-pointer transition-colors
          ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-slate-300 hover:border-blue-300 hover:bg-slate-50'
          }
          ${isUploading ? 'cursor-not-allowed opacity-60' : ''}
        `}
        role="button"
        tabIndex={0}
        aria-label="Zona de subida de archivos"
        onKeyDown={(e) => {
          if (e.key === 'Enter') inputRef.current?.click();
        }}
      >
        <span className="text-3xl block mb-2">📎</span>

        <p className="text-sm font-medium text-slate-700">
          {selectedFile
            ? selectedFile.name
            : 'Arrastra un archivo o haz clic para seleccionar'}
        </p>

        <p className="text-xs text-slate-400 mt-1">
          PDF, JPG, PNG, WEBP - máximo 5MB
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          disabled={isUploading}
          aria-label="Seleccionar archivo"
        />
      </div>

      {/* Error de validación */}
     {validationError && (
  <Alert variant="destructive">
    <AlertDescription>{validationError}</AlertDescription>
  </Alert>
)}

      {/* Tipo de documento y botón */}
      {selectedFile && (
        <div className="flex gap-3 items-center">
          <select
            value={documentType}
            onChange={(e) =>
              setDocumentType(
                e.target.value as EmployeeDocument['documentType']
              )
            }
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            disabled={isUploading}
          >
            {documentTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <Button
  type="button"
  onClick={handleSubmit}
  disabled={isUploading}
>
  {isUploading ? `${uploadProgress}%` : 'Subir'}
</Button>
        </div>
      )}

      {/* Barra de progreso */}
      {isUploading && (
  <Progress
    value={uploadProgress}
    aria-label="Progreso de la subida"
  />
)}
    </div>
  );
}

export default FileUpload;
