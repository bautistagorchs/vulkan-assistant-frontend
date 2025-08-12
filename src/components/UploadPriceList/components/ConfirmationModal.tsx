import React, { useState } from "react";
import { confirmUpload } from "@/lib/api";
import s from "../_uploadPriceList.module.scss";
import { UploadResponse } from "@/lib/types";
import { DateSelector } from "./DateSelector";
import { ProductSummaryTable } from "./ProductSummaryTable";
import { useRouter } from "next/navigation";

interface ConfirmationModalProps {
  uploadResponse: UploadResponse;
  originalData: any;
  availableEntryDates: string[];
  entryDateLabels: string[];
  boxEntryDates: { [key: string]: string };
  boxFrozenStatus: { [key: string]: boolean };
  onUpdateEntryDate: (index: number, newDate: string) => void;
  onAddEntryDate: () => void;
  onRemoveEntryDate: () => void;
  onBoxFrozenChange: (boxKey: string, isFrozen: boolean) => void;
  onBoxEntryDateChange: (boxKey: string, entryDate: string) => void;
  onClose: () => void;
  onError: (error: string) => void;
  onSuccess: () => void;
  getModifiedBoxes: (
    originalData: any[],
    availableEntryDates: string[]
  ) => any[];
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  uploadResponse,
  originalData,
  availableEntryDates,
  entryDateLabels,
  boxEntryDates,
  boxFrozenStatus,
  onUpdateEntryDate,
  onAddEntryDate,
  onRemoveEntryDate,
  onBoxFrozenChange,
  onBoxEntryDateChange,
  onClose,
  onError,
  onSuccess,
  getModifiedBoxes,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useRouter();

  const handleConfirm = async () => {
    if (!uploadResponse || !originalData) return;

    setIsConfirming(true);

    try {
      const modifiedBoxes = getModifiedBoxes(originalData, availableEntryDates);
      const finalData = [originalData[0], ...modifiedBoxes];

      await confirmUpload({ data: finalData });

      onSuccess();

      onClose();

      setTimeout(() => {
        navigate.push("/my-stock?createdAt=" + new Date().toISOString());
      }, 1500);
    } catch (error) {
      console.error("Error al confirmar la carga:", error);
      onError("Error al confirmar la carga. Intenta nuevamente.");
      onClose();
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className={s.modalOverlay} onClick={onClose}>
      <div className={s.confirmationModal} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h3>Confirmación de Carga</h3>
          <button className={s.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={s.modalContent}>
          <div className={s.uploadSummary}>
            <h4>Resumen de la carga</h4>

            {uploadResponse.results && (
              <div className={s.dataPreview}>
                {/* <DateSelector
                  entryDateLabels={entryDateLabels}
                  availableEntryDates={availableEntryDates}
                  onUpdateEntryDate={onUpdateEntryDate}
                  onAddEntryDate={onAddEntryDate}
                  onRemoveEntryDate={onRemoveEntryDate}
                /> */}

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

                <ProductSummaryTable
                  uploadResponse={uploadResponse}
                  availableEntryDates={availableEntryDates}
                  entryDateLabels={entryDateLabels}
                  boxEntryDates={boxEntryDates}
                  boxFrozenStatus={boxFrozenStatus}
                  onBoxFrozenChange={onBoxFrozenChange}
                  onBoxEntryDateChange={onBoxEntryDateChange}
                />
              </div>
            )}
          </div>
        </div>

        <div className={s.modalFooter}>
          <button
            className={s.confirmBtn}
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "Confirmando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};
