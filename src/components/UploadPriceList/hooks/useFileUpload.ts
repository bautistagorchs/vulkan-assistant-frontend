import { useState } from "react";
import { uploadJsonPriceList } from "@/lib/api";
import { UploadResponse } from "@/lib/types";

interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & { files: FileList | null };
}

export const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(
    null
  );
  const [originalData, setOriginalData] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  // Estados para confirmación
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);
  const [confirmationError, setConfirmationError] = useState<string | null>(
    null
  );

  const handleFileChange = (e: FileChangeEvent): void => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".json")) {
      setFile(selectedFile);
      setUploadSuccess(false);
      setUploadError(null);
      setConfirmationSuccess(false);
      setConfirmationError(null);
    } else {
      alert("Por favor, subí un archivo .json");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    e.preventDefault();
    if (!file) return null;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const fileContent = await file.text();
      let jsonData;

      try {
        jsonData = JSON.parse(fileContent);
      } catch (parseError) {
        setUploadError("El archivo no contiene JSON válido.");
        console.error("Error parsing JSON:", parseError);
        setIsUploading(false);
        return null;
      }

      const response = await uploadJsonPriceList(jsonData);

      setOriginalData(jsonData);
      setUploadResponse({
        ...response,
        fileName: file.name,
      });

      setUploadSuccess(true);
      setFile(null);

      // Reset form
      const form = e.target as HTMLFormElement;
      form.reset();

      return jsonData;
    } catch (error) {
      setUploadError("Error al subir el archivo. Intenta nuevamente.");
      console.error("Error uploading file:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadResponse(null);
    setOriginalData(null);
    setUploadSuccess(false);
    setUploadError(null);
    setConfirmationSuccess(false);
    setConfirmationError(null);
  };

  const setConfirmationSuccessState = () => {
    setConfirmationSuccess(true);
    setConfirmationError(null);
  };

  const setConfirmationErrorState = (error: string) => {
    setConfirmationError(error);
    setConfirmationSuccess(false);
  };

  return {
    file,
    isUploading,
    uploadSuccess,
    uploadError,
    uploadResponse,
    originalData,
    confirmationSuccess,
    confirmationError,
    handleFileChange,
    handleSubmit,
    resetUpload,
    setConfirmationSuccessState,
    setConfirmationErrorState,
  };
};
