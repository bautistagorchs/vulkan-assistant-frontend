"use client";
import React, { useState } from "react";
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
  const [originalData, setOriginalData] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationComplete, setConfirmationComplete] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

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

        setOriginalData(jsonData); // Guardar datos originales
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
    if (!uploadResponse || !originalData) return;

    setIsConfirming(true);

    try {
      await confirmUpload({ data: originalData });
      setConfirmationComplete(true);

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
    setOriginalData(null);
    setIsConfirming(false);
    setConfirmationComplete(false);
    setExpandedProduct(null);
  };

  const toggleProductExpansion = (productName: string, hasBoxes: boolean) => {
    // if (!hasBoxes) return;
    setExpandedProduct(expandedProduct === productName ? null : productName);
  };

  const getBoxesForProduct = (productName: string) => {
    if (!uploadResponse?.results?.boxes) return [];
    return uploadResponse.results.boxes.filter(
      (box: any) => box.productName === productName
    );
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
                    <h5>Resumen de productos actualizados:</h5>
                    <div className={s.summaryStats}>
                      <p>
                        <strong>Productos creados:</strong>{" "}
                        {uploadResponse.results.productsCreated}
                      </p>
                      <p>
                        <strong>Productos actualizados:</strong>{" "}
                        {uploadResponse.results.productsUpdated}
                      </p>
                      <p>
                        <strong>Total cajas cargadas:</strong>{" "}
                        {uploadResponse.results.boxesCreated}
                      </p>
                    </div>

                    <div className={s.tableContainer}>
                      <table className={s.productsTable}>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Producto</th>
                            <th>Precio Anterior</th>
                            <th>Precio Nuevo</th>
                            <th>Cajas Cargadas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadResponse.results.productSummary?.map(
                            (product: any, index: number) => {
                              const hasBoxes = product.boxesLoaded > 0;
                              const isExpanded =
                                expandedProduct === product.name;
                              const productBoxes = getBoxesForProduct(
                                product.name
                              );

                              return (
                                <React.Fragment key={index}>
                                  <tr
                                    className={hasBoxes ? s.clickableRow : ""}
                                    onClick={() =>
                                      toggleProductExpansion(
                                        product.name,
                                        hasBoxes
                                      )
                                    }
                                  >
                                    <td>{index + 1}</td>
                                    <td>
                                      <div className={s.productNameCell}>
                                        {product.name}
                                        {hasBoxes && (
                                          <span className={s.expandIcon}>
                                            {isExpanded ? "▼" : "▶"}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td>
                                      {product.previousPrice !== null
                                        ? `$${product.previousPrice.toLocaleString(
                                            "es-AR"
                                          )}`
                                        : "Nuevo producto"}
                                    </td>
                                    <td>
                                      $
                                      {product.newPrice.toLocaleString("es-AR")}
                                    </td>
                                    <td>
                                      <span
                                        className={
                                          hasBoxes
                                            ? s.boxCountClickable
                                            : s.boxCount
                                        }
                                      >
                                        {product.boxesLoaded} cajas
                                      </span>
                                    </td>
                                  </tr>
                                  {isExpanded && hasBoxes && (
                                    <tr className={s.expandedRow}>
                                      <td colSpan={5}>
                                        <div className={s.boxesDetail}>
                                          <div className={s.boxesGrid}>
                                            {productBoxes.map(
                                              (box: any, boxIndex: number) => (
                                                <div
                                                  key={boxIndex}
                                                  className={s.boxItem}
                                                >
                                                  <div className={s.boxInfo}>
                                                    <span
                                                      className={s.boxWeight}
                                                    >
                                                      {box.kg} kg
                                                    </span>
                                                    <span className={s.boxType}>
                                                      {box.isFrozen
                                                        ? "🧊 Congelado"
                                                        : "❄️ Refrigerado"}
                                                    </span>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            }
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
