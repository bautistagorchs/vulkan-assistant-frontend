import React from "react";
import s from "../_uploadPriceList.module.scss";

interface UploadStatusProps {
  file: File | null;
  isUploading: boolean;
  uploadSuccess: boolean;
  uploadError: string | null;
  confirmationSuccess: boolean;
  confirmationError: string | null;
}

export const UploadStatus: React.FC<UploadStatusProps> = ({
  file,
  isUploading,
  uploadSuccess,
  uploadError,
  confirmationSuccess,
  confirmationError,
}) => {
  return (
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
      {confirmationError && <p style={{ color: "red" }}>{confirmationError}</p>}
    </>
  );
};
