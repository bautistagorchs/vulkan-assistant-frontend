"use client";
import { useState } from "react";
import { uploadJsonPriceList, confirmUpload } from "@/lib/api";
import s from "./_uploadPriceList.module.scss";
import { UploadResponse } from "@/lib/types";

export default function UploadPriceList() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(
    null
  );
  console.log("la upload es esta", uploadResponse);

  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationComplete, setConfirmationComplete] = useState(false);

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleFileChange = (e: FileChangeEvent): void => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".json")) {
      setFile(selectedFile);
      setUploadSuccess(false);
      setUploadError(null);
    } else {
      alert("Por favor, subí un archivo .json");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
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
          return;
        }

        const response = await uploadJsonPriceList(jsonData);

        setUploadResponse({
          ...response,
          fileName: file.name,
        });
        setShowConfirmationModal(true);
        setUploadSuccess(true);
        setFile(null);
        // Reset form
        const form = e.target as HTMLFormElement;
        form.reset();
      } catch (error) {
        setUploadError("Error al subir el archivo. Intenta nuevamente.");
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleConfirm = async () => {
    if (!uploadResponse) return;

    setIsConfirming(true);
    try {
      await confirmUpload(uploadResponse);
      setConfirmationComplete(true);
      console.log("Confirmación enviada al backend exitosamente");

      // Close modal after 1.5 seconds
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      console.error("Error al confirmar la carga:", error);
      setUploadError("Error al confirmar la carga. Intenta nuevamente.");
    } finally {
      setIsConfirming(false);
    }
  };

  const closeModal = () => {
    setShowConfirmationModal(false);
    setUploadResponse(null);
    setIsConfirming(false);
    setConfirmationComplete(false);
  };

  return (
    <div className={s.uploadPage}>
      <div className={s.uploadCard}>
        <h2>Cargar archivo JSON</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              id="file-input"
              type="file"
              accept=".json"
              onChange={handleFileChange}
              disabled={isUploading}
              name="file"
            />
          </div>
          <button type="submit" disabled={!file || isUploading}>
            {isUploading ? "Cargando..." : "Subir"}
          </button>
        </form>
        {file && !isUploading && <p>Archivo seleccionado: {file.name}</p>}
        {isUploading && <p>Cargando...</p>}
        {uploadSuccess && (
          <p style={{ color: "green" }}>Actualización exitosa</p>
        )}
        {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
      </div>

      {/* <section className={s.listasViejasSection}>
        <h3>Historial de listas de precios cargadas</h3>
        <div className={s.listasViejasTableWrapper}>
          <table className={s.listasViejasTable}>
            <thead>
              <tr>
                <th>Archivo</th>
                <th>Fecha de carga</th>
                <th>Tamaño</th>
                <th>Usuario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listasViejas.map((l) => (
                <tr key={l.nombre}>
                  <td>{l.nombre}</td>
                  <td>{l.fecha}</td>
                  <td>{l.size}</td>
                  <td>{l.usuario}</td>
                  <td>
                    <button className={s.verBtn} title="Ver/Descargar">
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section> */}

      {showConfirmationModal && uploadResponse && (
        <div className={s.modalOverlay} onClick={closeModal}>
          <div
            className={s.confirmationModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={s.modalHeader}>
              <h3>Confirmación de Carga</h3>
              <button className={s.closeBtn} onClick={closeModal}>
                ×
              </button>
            </div>
            <div className={s.modalContent}>
              <div className={s.uploadSummary}>
                <h4>Resumen de la carga</h4>
                <div className={s.summaryInfo}>
                  <p>
                    <strong>Archivo:</strong> {uploadResponse.fileName}
                  </p>

                  {uploadResponse.totalItems && (
                    <p>
                      <strong>Total de elementos:</strong>{" "}
                      {uploadResponse.totalItems}
                    </p>
                  )}
                  <p>
                    <strong>Estado:</strong>{" "}
                    <span className={s.success}>
                      ✓ {uploadResponse.message || "Procesado correctamente"}
                    </span>
                  </p>
                </div>

                {uploadResponse.results && (
                  <div className={s.dataPreview}>
                    <h5>Vista previa de los productos:</h5>
                    <div className={s.tableContainer}>
                      <table className={s.productsTable}>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Producto</th>
                            <th>Precio Base</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadResponse.results.products.map(
                            (product: any, index: number) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>
                                  ${product.basePrice.toLocaleString("es-AR")}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={s.modalFooter}>
              <button
                className={s.confirmBtn}
                onClick={handleConfirm}
                disabled={isConfirming || confirmationComplete}
              >
                {isConfirming
                  ? "Confirmando..."
                  : confirmationComplete
                  ? "✓ Confirmado"
                  : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
