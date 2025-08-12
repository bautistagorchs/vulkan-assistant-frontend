import { useState } from "react";

export const useBoxConfiguration = () => {
  const [boxEntryDates, setBoxEntryDates] = useState<{ [key: string]: string }>(
    {}
  );
  const [boxFrozenStatus, setBoxFrozenStatus] = useState<{
    [key: string]: boolean;
  }>({});

  const initializeBoxConfiguration = (
    jsonData: any[],
    entryDates: string[]
  ) => {
    const boxes = jsonData.slice(1);
    const initialEntryDates: { [key: string]: string } = {};
    const initialFrozenStatus: { [key: string]: boolean } = {};

    boxes.forEach((box: any, index: number) => {
      const boxKey = `${box.productName}_${index}`;
      // Usar la fecha que viene en el JSON directamente
      initialEntryDates[boxKey] = box.entryDate || null;

      // CRITICAL FIX: Preservar el valor original del JSON para isFrozen
      // Solo establecer el valor si viene en el JSON, sino no lo inicializamos
      // para que getModifiedBoxes use el valor original
      if (box.isFrozen !== undefined && box.isFrozen !== null) {
        initialFrozenStatus[boxKey] = box.isFrozen;
      }

      console.log(`Inicializando ${boxKey}:`, {
        originalIsFrozen: box.isFrozen,
        setTo: initialFrozenStatus[boxKey],
      });
    });

    setBoxEntryDates(initialEntryDates);
    setBoxFrozenStatus(initialFrozenStatus);
  };

  const updateBoxFrozenStatus = (boxKey: string, isFrozen: boolean) => {
    console.log(`updateBoxFrozenStatus: ${boxKey} -> ${isFrozen}`);
    setBoxFrozenStatus((prev) => ({
      ...prev,
      [boxKey]: isFrozen,
    }));
  };

  const updateBoxEntryDate = (boxKey: string, entryDate: string) => {
    console.log(`updateBoxEntryDate: ${boxKey} -> ${entryDate}`);
    setBoxEntryDates((prev) => ({
      ...prev,
      [boxKey]: entryDate,
    }));
  };

  const resetBoxConfiguration = () => {
    setBoxEntryDates({});
    setBoxFrozenStatus({});
  };

  const getModifiedBoxes = (
    originalData: any[],
    availableEntryDates: string[]
  ) => {
    console.log("=== DEBUG getModifiedBoxes ===");
    console.log("boxFrozenStatus:", boxFrozenStatus);
    console.log("boxEntryDates:", boxEntryDates);
    console.log("originalData boxes:", originalData.slice(1));

    return originalData.slice(1).map((box: any, index: number) => {
      const boxKey = `${box.productName}_${index}`;
      // Usar la fecha del JSON original en lugar de las fechas configuradas por el usuario
      const entryDate = box.entryDate; // Tomar directamente del JSON

      // CRITICAL FIX: Usar el estado actualizado o el valor original del JSON
      const finalIsFrozen =
        boxFrozenStatus[boxKey] !== undefined
          ? boxFrozenStatus[boxKey]
          : box.isFrozen || false;

      const modifiedBox = {
        ...box,
        isFrozen: finalIsFrozen,
        entryDate: entryDate || null,
      };

      console.log(`Box ${boxKey}:`, {
        original_isFrozen: box.isFrozen,
        boxFrozenStatus_value: boxFrozenStatus[boxKey],
        final_isFrozen: finalIsFrozen,
        entryDateFromJson: box.entryDate,
        finalBox: modifiedBox,
      });

      return modifiedBox;
    });
  };

  return {
    boxEntryDates,
    boxFrozenStatus,
    initializeBoxConfiguration,
    updateBoxFrozenStatus,
    updateBoxEntryDate,
    resetBoxConfiguration,
    getModifiedBoxes,
  };
};
