"use client";

import React, { useState, useEffect } from "react";
import { Box, BoxSelectorProps } from "@/lib/types";
import { getBoxesByProductId } from "@/lib/api";
import s from "./_boxSelector.module.scss";

const BoxSelector: React.FC<BoxSelectorProps> = ({
  productId,
  productName,
  onBoxesSelected,
  onCancel,
}) => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  boxes;

  const [selectedBoxes, setSelectedBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        setLoading(true);
        const boxesData = await getBoxesByProductId(productId);
        setBoxes(boxesData.boxes);
      } catch (error) {
        console.error("Error al cargar cajas:", error);
        setError("Error al cargar las cajas disponibles");
      } finally {
        setLoading(false);
      }
    };

    fetchBoxes();
  }, [productId]);

  const handleBoxToggle = (box: Box) => {
    setSelectedBoxes((prev) => {
      const isSelected = prev.some((b) => b.id === box.id);
      if (isSelected) {
        return prev.filter((b) => b.id !== box.id);
      } else {
        return [...prev, box];
      }
    });
  };

  const handleConfirm = () => {
    if (selectedBoxes.length > 0) {
      onBoxesSelected(productId, selectedBoxes);
    }
  };

  const totalKg = selectedBoxes.reduce((acc, box) => acc + box.kg, 0);

  if (loading) {
    return (
      <div className={s.boxSelector}>
        <div className={s.header}>
          <h3>Seleccionar cajas para {productName}</h3>
        </div>
        <div className={s.loading}>Cargando cajas disponibles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.boxSelector}>
        <div className={s.header}>
          <h3>Seleccionar cajas para {productName}</h3>
        </div>
        <div className={s.error}>{error}</div>
        <div className={s.actions}>
          <button className={s.cancelBtn} onClick={onCancel}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.boxSelector}>
      <div className={s.header}>
        <h3>Seleccionar cajas para {productName}</h3>
        <p className={s.subtitle}>
          Elegí una o más cajas para agregar al pedido
        </p>
      </div>

      {boxes.length === 0 ? (
        <div className={s.noBoxes}>
          No hay cajas disponibles para este producto
        </div>
      ) : (
        <div className={s.boxesContainer}>
          <div className={s.boxesGrid}>
            {boxes.length > 0
              ? boxes.map((box) => {
                  const isSelected = selectedBoxes.some((b) => b.id === box.id);
                  return (
                    <div
                      key={box.id}
                      className={`${s.boxCard} ${isSelected ? s.selected : ""}`}
                      onClick={() => handleBoxToggle(box)}
                    >
                      <div className={s.checkbox}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleBoxToggle(box)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className={s.boxInfo}>
                        <div className={s.weight}>{box.kg} kg</div>
                        <div className={s.temperature}>
                          {box.isFrozen ? (
                            <span className={s.frozen}>🧊 Congelado</span>
                          ) : box.isRefrigerated ? (
                            <span className={s.refrigerated}>
                              ❄️ Refrigerado
                            </span>
                          ) : (
                            <span className={s.ambient}>🌡️ Ambiente</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              : "No hay cajas disponibles para este producto"}
          </div>

          {selectedBoxes.length > 0 && (
            <div className={s.summary}>
              <div className={s.summaryInfo}>
                <span className={s.selectedCount}>
                  {selectedBoxes.length} caja
                  {selectedBoxes.length !== 1 ? "s" : ""} seleccionada
                  {selectedBoxes.length !== 1 ? "s" : ""}
                </span>
                <span className={s.totalWeight}>Total: {totalKg} kg</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={s.actions}>
        <button className={s.cancelBtn} onClick={onCancel}>
          Cancelar
        </button>
        <button
          className={s.confirmBtn}
          onClick={handleConfirm}
          disabled={selectedBoxes.length === 0}
        >
          Agregar al pedido ({selectedBoxes.length} caja
          {selectedBoxes.length !== 1 ? "s" : ""})
        </button>
      </div>
    </div>
  );
};

export default BoxSelector;
