import React, { useState } from "react";
import s from "../_uploadPriceList.module.scss";
import { BoxDetailsTable } from "./BoxDetailsTable";
import { UploadResponse } from "@/lib/types";

interface ProductSummaryTableProps {
  uploadResponse: UploadResponse;
  availableEntryDates: string[];
  entryDateLabels: string[];
  boxEntryDates: { [key: string]: string };
  boxFrozenStatus: { [key: string]: boolean };
  onBoxFrozenChange: (boxKey: string, isFrozen: boolean) => void;
  onBoxEntryDateChange: (boxKey: string, entryDate: string) => void;
}

export const ProductSummaryTable: React.FC<ProductSummaryTableProps> = ({
  uploadResponse,
  availableEntryDates,
  entryDateLabels,
  boxEntryDates,
  boxFrozenStatus,
  onBoxFrozenChange,
  onBoxEntryDateChange,
}) => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const toggleProductExpansion = (productName: string) => {
    setExpandedProduct(expandedProduct === productName ? null : productName);
  };

  const getBoxesForProduct = (productName: string) => {
    if (!uploadResponse?.results?.boxes) return [];

    let boxIndexCounter = 0;
    return uploadResponse.results.boxes
      .filter((box: any) => box.productName === productName)
      .map((box: any) => {
        const boxKey = `${box.productName}_${boxIndexCounter}`;

        // CRITICAL FIX: Usar el estado actualizado O el valor original del JSON
        const currentFrozenStatus =
          boxFrozenStatus[boxKey] !== undefined
            ? boxFrozenStatus[boxKey]
            : box.isFrozen || false;

        console.log(`ProductSummaryTable - Box ${boxKey}:`, {
          original_isFrozen: box.isFrozen,
          boxFrozenStatus_value: boxFrozenStatus[boxKey],
          final_isFrozen: currentFrozenStatus,
        });

        boxIndexCounter++;
        return {
          ...box,
          isFrozen: currentFrozenStatus,
          entryDate: boxEntryDates[boxKey] || box.entryDate,
          boxKey,
        };
      });
  };

  return (
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
          {uploadResponse.results?.productSummary?.map(
            (product: any, index: number) => {
              const hasBoxes = product.boxesLoaded > 0;
              const isExpanded = expandedProduct === product.name;
              const productBoxes = getBoxesForProduct(product.name);

              return (
                <React.Fragment key={index}>
                  <tr
                    className={hasBoxes ? s.clickableRow : ""}
                    onClick={() => toggleProductExpansion(product.name)}
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
                        ? `$${product.previousPrice.toLocaleString("es-AR")}`
                        : "Nuevo producto"}
                    </td>
                    <td>${product.newPrice.toLocaleString("es-AR")}</td>
                    <td>
                      <span
                        className={hasBoxes ? s.boxCountClickable : s.boxCount}
                      >
                        {product.boxesLoaded} cajas
                      </span>
                    </td>
                  </tr>
                  {isExpanded && hasBoxes && (
                    <tr className={s.expandedRow}>
                      <td colSpan={5}>
                        <BoxDetailsTable
                          boxes={productBoxes}
                          availableEntryDates={availableEntryDates}
                          entryDateLabels={entryDateLabels}
                          onBoxFrozenChange={onBoxFrozenChange}
                          onBoxEntryDateChange={onBoxEntryDateChange}
                        />
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
  );
};
