import React from "react";
import s from "../_uploadPriceList.module.scss";

interface FileUploadFormProps {
  file: File | null;
  isUploading: boolean;
  uploadSuccess: boolean;
  uploadError: string | null;
  confirmationSuccess: boolean;
  confirmationError: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<any>;
}

export const FileUploadForm: React.FC<FileUploadFormProps> = ({
  file,
  isUploading,
  onFileChange,
  uploadSuccess,
  uploadError,
  confirmationSuccess,
  confirmationError,
  onSubmit,
}) => {
  return (
    <div className={s.uploadCard}>
      <h2>Cargar archivo JSON</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            id="file-input"
            type="file"
            accept=".json"
            onChange={onFileChange}
            disabled={isUploading}
            name="file"
          />
        </div>
        <button type="submit" disabled={!file || isUploading}>
          {isUploading ? "Cargando..." : "Subir"}
        </button>
      </form>
      <>
        {file && !isUploading && (
          <p className={s.success}>Archivo seleccionado: {file.name}</p>
        )}
        {isUploading && <p>Cargando...</p>}
        {uploadSuccess && !confirmationSuccess && !confirmationError && (
          <p style={{ color: "green" }}>Archivo cargado exitosamente</p>
        )}
        {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
        {confirmationSuccess && (
          <p style={{ color: "green" }}>✓ Stock actualizado exitosamente</p>
        )}
        {confirmationError && (
          <p style={{ color: "red" }}>{confirmationError}</p>
        )}
      </>
    </div>
  );
};
