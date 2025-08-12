import React from "react";
import s from "../_uploadPriceList.module.scss";

interface BoxDetailsTableProps {
  boxes: any[];
  availableEntryDates: string[];
  entryDateLabels: string[];
  onBoxFrozenChange: (boxKey: string, isFrozen: boolean) => void;
  onBoxEntryDateChange: (boxKey: string, entryDate: string) => void;
}

export const BoxDetailsTable: React.FC<BoxDetailsTableProps> = ({
  boxes,
  availableEntryDates,
  entryDateLabels,
  onBoxFrozenChange,
  onBoxEntryDateChange,
}) => {
  return (
    <div className={s.boxesDetail}>
      <table className={s.boxesTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Peso (kg)</th>
            <th>Estado</th>
            <th>Fecha de Ingreso</th>
          </tr>
        </thead>
        <tbody>
          {boxes.map((box: any, boxIndex: number) => (
            <tr key={boxIndex}>
              <td>{boxIndex + 1}</td>
              <td>{box.kg} kg</td>
              <td>
                <select
                  value={box.isFrozen ? "frozen" : "refrigerated"}
                  onChange={(e) =>
                    onBoxFrozenChange(box.boxKey, e.target.value === "frozen")
                  }
                  className={s.boxSelect}
                >
                  <option value="refrigerated">❄️ Refrigerado</option>
                  <option value="frozen">🧊 Congelado</option>
                </select>
              </td>
              <td>
                <div className={s.dateDisplayOnly}>
                  {box.entryDate
                    ? new Date(box.entryDate).toLocaleDateString("es-AR")
                    : "Sin fecha"}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
