"use client";
import React, { useState } from "react";
import s from "./_uploadPriceList.module.scss";
import { useFileUpload } from "./hooks/useFileUpload";
import { useEntryDates } from "./hooks/useEntryDates";
import { useBoxConfiguration } from "./hooks/useBoxConfiguration";
import { FileUploadForm } from "./components/FileUploadForm";
import { UploadStatus } from "./components/UploadStatus";
import { ConfirmationModal } from "./components/ConfirmationModal";

export default function UploadPriceList() {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const fileUpload = useFileUpload();
  const entryDates = useEntryDates();
  const boxConfig = useBoxConfiguration();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const jsonData = await fileUpload.handleSubmit(e);
    if (jsonData) {
      const initialEntryDates = entryDates.initializeEntryDates();
      boxConfig.initializeBoxConfiguration(jsonData, initialEntryDates);
      setShowConfirmationModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
    // No reseteamos fileUpload para mantener los mensajes de confirmación
    entryDates.resetEntryDates();
    boxConfig.resetBoxConfiguration();
  };

  return (
    <div className={s.uploadPage}>
      <FileUploadForm
        file={fileUpload.file}
        isUploading={fileUpload.isUploading}
        onFileChange={fileUpload.handleFileChange}
        onSubmit={handleSubmit}
        uploadSuccess={fileUpload.uploadSuccess}
        uploadError={fileUpload.uploadError}
        confirmationSuccess={fileUpload.confirmationSuccess}
        confirmationError={fileUpload.confirmationError}
      />

      {/* <UploadStatus
        file={fileUpload.file}
        isUploading={fileUpload.isUploading}
        uploadSuccess={fileUpload.uploadSuccess}
        uploadError={fileUpload.uploadError}
        confirmationSuccess={fileUpload.confirmationSuccess}
        confirmationError={fileUpload.confirmationError}
      /> */}

      {showConfirmationModal && fileUpload.uploadResponse && (
        <ConfirmationModal
          uploadResponse={fileUpload.uploadResponse}
          originalData={fileUpload.originalData}
          availableEntryDates={entryDates.availableEntryDates}
          entryDateLabels={entryDates.entryDateLabels}
          boxEntryDates={boxConfig.boxEntryDates}
          boxFrozenStatus={boxConfig.boxFrozenStatus}
          onUpdateEntryDate={entryDates.updateEntryDate}
          onAddEntryDate={entryDates.addEntryDate}
          onRemoveEntryDate={entryDates.removeEntryDate}
          onBoxFrozenChange={boxConfig.updateBoxFrozenStatus}
          onBoxEntryDateChange={boxConfig.updateBoxEntryDate}
          onClose={handleCloseModal}
          onError={(error) => fileUpload.setConfirmationErrorState(error)}
          onSuccess={() => fileUpload.setConfirmationSuccessState()}
          getModifiedBoxes={(originalData) =>
            boxConfig.getModifiedBoxes(
              originalData,
              entryDates.availableEntryDates
            )
          }
        />
      )}
    </div>
  );
}
