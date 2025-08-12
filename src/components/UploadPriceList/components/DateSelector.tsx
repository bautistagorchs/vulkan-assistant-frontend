import React from "react";
import s from "../_uploadPriceList.module.scss";

interface DateSelectorProps {
  entryDateLabels: string[];
  availableEntryDates: string[];
  onUpdateEntryDate: (index: number, newDate: string) => void;
  onAddEntryDate: () => void;
  onRemoveEntryDate: () => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  entryDateLabels,
  availableEntryDates,
  onUpdateEntryDate,
  onAddEntryDate,
  onRemoveEntryDate,
}) => {
  return (
    <div className={s.dateSelector}>
      <label>Configurar fechas de ingreso:</label>
      <div className={s.dateInputs}>
        {entryDateLabels.map((label, index) => (
          <div key={index} className={s.dateInput}>
            <label>{label}:</label>
            <input
              type="date"
              value={availableEntryDates[index] || ""}
              onChange={(e) => onUpdateEntryDate(index, e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={onAddEntryDate}
          disabled={entryDateLabels.length >= 4}
          className={s.addDateBtn}
        >
          + Agregar fecha
        </button>
        {entryDateLabels.length > 2 && (
          <button
            type="button"
            onClick={onRemoveEntryDate}
            className={s.removeDateBtn}
          >
            - Quitar fecha
          </button>
        )}
      </div>
    </div>
  );
};
