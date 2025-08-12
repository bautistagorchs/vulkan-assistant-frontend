import { useState } from "react";

export const useEntryDates = () => {
  const [availableEntryDates, setAvailableEntryDates] = useState<string[]>([]);
  const [entryDateLabels, setEntryDateLabels] = useState<string[]>([]);

  const initializeEntryDates = () => {
    const today = new Date();
    const entryDates = [
      today.toISOString().split("T")[0], // Fecha 1: Hoy
      new Date(today.getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // Fecha 2: Mañana
    ];

    const dateLabels = entryDates.map((date, index) => `Fecha ${index + 1}`);

    setAvailableEntryDates(entryDates);
    setEntryDateLabels(dateLabels);
    return entryDates;
  };

  const updateEntryDate = (index: number, newDate: string) => {
    const newDates = [...availableEntryDates];
    newDates[index] = newDate;
    setAvailableEntryDates(newDates);
  };

  const addEntryDate = () => {
    if (entryDateLabels.length < 4) {
      const newLabel = `Fecha ${entryDateLabels.length + 1}`;
      setEntryDateLabels([...entryDateLabels, newLabel]);

      const today = new Date();
      const newDate = new Date(
        today.getTime() + entryDateLabels.length * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0];

      setAvailableEntryDates([...availableEntryDates, newDate]);
    }
  };

  const removeEntryDate = () => {
    if (entryDateLabels.length > 2) {
      const newLabels = entryDateLabels.slice(0, -1);
      const newDates = availableEntryDates.slice(0, -1);
      setEntryDateLabels(newLabels);
      setAvailableEntryDates(newDates);
    }
  };

  const resetEntryDates = () => {
    setAvailableEntryDates([]);
    setEntryDateLabels([]);
  };

  return {
    availableEntryDates,
    entryDateLabels,
    initializeEntryDates,
    updateEntryDate,
    addEntryDate,
    removeEntryDate,
    resetEntryDates,
  };
};
