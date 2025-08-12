"use client";
import React, { useState, useEffect } from "react";
import {
  getStock,
  updateProduct,
  updateBox,
  deleteBox,
  addBoxToProduct,
  deleteAllStock,
} from "@/lib/api";
import {
  ProductWithStock,
  BoxWithDetails,
  EditingItem,
  ConfirmAction,
  ProductEditValues,
  BoxEditValues,
  EditValues,
} from "@/lib/types";
import s from "./_myStock.module.scss";

const MyStock = () => {
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null
  );
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      setLoading(true);
      const response = await getStock();
      setProducts(response.products);
    } catch (error) {
      console.error("Error cargando stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProductExpansion = (productId: number) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const startEdit = (
    type: "product" | "box" | "newBox",
    id: number | null,
    productId?: number
  ) => {
    setEditingItem({ type, id, productId });

    if (type === "product" && id) {
      const product = products.find((p) => p.id === id);
      setEditValues({
        name: product?.name || "",
        basePrice: product?.basePrice || 0,
        active: product?.active || true,
      });
    } else if (type === "box" && id) {
      const product = products.find((p) => p.boxes.some((b) => b.id === id));
      const box = product?.boxes.find((b) => b.id === id);
      setEditValues({
        kg: box?.kg || 0,
        isFrozen: box?.isFrozen || false,
      });
    } else if (type === "newBox") {
      setEditValues({
        kg: 0,
        isFrozen: false,
      });
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValues({});
  };

  const openConfirmModal = (
    type: "save" | "delete",
    data?: any,
    originalData?: any,
    itemName?: string
  ) => {
    setConfirmAction({ type, data, originalData, itemName });
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const executeAction = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === "save") {
        if (editingItem?.type === "product" && editingItem.id) {
          await updateProduct(editingItem.id, editValues as ProductEditValues);
        } else if (editingItem?.type === "box" && editingItem.id) {
          await updateBox(editingItem.id, editValues as BoxEditValues);
        } else if (editingItem?.type === "newBox" && editingItem.productId) {
          await addBoxToProduct(
            editingItem.productId,
            editValues as BoxEditValues
          );
        }
      } else if (confirmAction.type === "delete" && confirmAction.data?.id) {
        await deleteBox(confirmAction.data.id);
      }

      await loadStock();
      cancelEdit();
      closeConfirmModal();
    } catch (error) {
      console.error("Error ejecutando acción:", error);
    }
  };

  const handleBulkDeleteAll = async () => {
    try {
      await deleteAllStock();
      await loadStock();
      setShowBulkDeleteModal(false);
    } catch (error) {
      console.error("Error eliminando todo el stock:", error);
    }
  };

  const saveEdit = () => {
    if (!editingItem) return;

    let itemName = "";
    let originalData: any = {};

    if (editingItem.type === "product" && editingItem.id) {
      const product = products.find((p) => p.id === editingItem.id);
      itemName = `Producto: ${product?.name}`;
      originalData = {
        name: product?.name,
        basePrice: product?.basePrice,
        active: product?.active,
      };
    } else if (editingItem.type === "box" && editingItem.id) {
      const product = products.find((p) =>
        p.boxes.some((b) => b.id === editingItem.id)
      );
      const box = product?.boxes.find((b) => b.id === editingItem.id);
      itemName = `Caja de ${product?.name} (${box?.kg}kg)`;
      originalData = {
        kg: box?.kg,
        isFrozen: box?.isFrozen,
      };
    } else if (editingItem.type === "newBox" && editingItem.productId) {
      const product = products.find((p) => p.id === editingItem.productId);
      itemName = `Nueva caja para ${product?.name}`;
      originalData = null; // Nueva caja, no hay datos originales
    }

    openConfirmModal("save", editValues, originalData, itemName);
  };

  const handleDeleteBox = (boxId: number) => {
    const product = products.find((p) => p.boxes.some((b) => b.id === boxId));
    const box = product?.boxes.find((b) => b.id === boxId);
    const itemName = `Caja de ${product?.name} (${box?.kg}kg)`;

    openConfirmModal("delete", { id: boxId }, box, itemName);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR");
  };

  if (loading) {
    return <div className={s.loading}>Cargando stock...</div>;
  }

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1>Mi Stock</h1>
        <button onClick={loadStock} className={s.refreshBtn}>
          🔄 Actualizar
        </button>
      </div>

      <div className={s.stockTable}>
        <div className={s.tableHeader}>
          <div className={s.headerCell}>Producto</div>
          <div className={s.headerCell}>Precio Base</div>
          <div className={s.headerCell}>Estado</div>
          <div className={s.headerCell}>Cajas Disponibles</div>
          <div className={s.headerCell}>Acciones</div>
        </div>

        {products.map((product) => {
          const isExpanded = expandedProduct === product.id;
          const hasStock = product.boxes.length > 0;

          return (
            <React.Fragment key={product.id}>
              {/* Fila del producto */}
              <div
                className={`${s.productRow} ${
                  hasStock ? s.withStock : s.withoutStock
                }`}
                onClick={() => toggleProductExpansion(product.id)}
              >
                <div className={s.cell}>
                  <div className={s.productNameCell}>
                    {editingItem?.type === "product" &&
                    editingItem.id === product.id ? (
                      <input
                        type="text"
                        value={(editValues as ProductEditValues).name}
                        onChange={(e) =>
                          setEditValues({ ...editValues, name: e.target.value })
                        }
                        onClick={(e) => e.stopPropagation()}
                        className={s.editInput}
                      />
                    ) : (
                      <>
                        {product.name}
                        {hasStock && (
                          <span className={s.expandIcon}>
                            {isExpanded ? "▼" : "▶"}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className={s.cell}>
                  {editingItem?.type === "product" &&
                  editingItem.id === product.id ? (
                    <input
                      type="number"
                      step="0.01"
                      value={(editValues as ProductEditValues).basePrice}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          basePrice: parseFloat(e.target.value),
                        })
                      }
                      onClick={(e) => e.stopPropagation()}
                      className={s.editInput}
                    />
                  ) : (
                    `$${product.basePrice.toLocaleString("es-AR")}`
                  )}
                </div>

                <div className={s.cell}>
                  {editingItem?.type === "product" &&
                  editingItem.id === product.id ? (
                    <select
                      value={
                        (editValues as ProductEditValues).active
                          ? "true"
                          : "false"
                      }
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          active: e.target.value === "true",
                        })
                      }
                      onClick={(e) => e.stopPropagation()}
                      className={s.editSelect}
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  ) : (
                    <span
                      className={`${s.status} ${
                        product.active ? s.active : s.inactive
                      }`}
                    >
                      {product.active ? "Activo" : "Inactivo"}
                    </span>
                  )}
                </div>

                <div className={s.cell} id={s.stockCell}>
                  <span
                    className={`${s.stockCount} ${
                      hasStock ? s.hasStock : s.noStock
                    }`}
                  >
                    {product.boxes.length} cajas
                  </span>
                  <span
                    className={`${s.stockCount} ${
                      hasStock ? s.hasStock : s.noStock
                    }`}
                  >
                    {product.boxes
                      .reduce((total, box) => total + box.kg, 0)
                      .toFixed(2)}{" "}
                    kg totales
                  </span>
                </div>

                <div className={s.cell}>
                  {editingItem?.type === "product" &&
                  editingItem.id === product.id ? (
                    <div
                      className={s.editActions}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={saveEdit} className={s.saveBtn}>
                        ✓
                      </button>
                      <button onClick={cancelEdit} className={s.cancelBtn}>
                        ✗
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit("product", product.id);
                      }}
                      className={s.editBtn}
                    >
                      ✏️
                    </button>
                  )}
                </div>
              </div>

              {/* Filas expandidas de cajas */}
              {isExpanded && hasStock && (
                <div className={s.expandedSection}>
                  <div className={s.boxesHeader}>
                    <div className={s.boxHeaderCell}>Peso (kg)</div>
                    <div className={s.boxHeaderCell}>Tipo</div>
                    <div className={s.boxHeaderCell}>Fecha de ingreso</div>
                    <div className={s.boxHeaderCell}>Acciones</div>
                  </div>

                  {product.boxes.map((box) => (
                    <div key={box.id} className={s.boxRow}>
                      <div className={s.boxCell}>
                        {editingItem?.type === "box" &&
                        editingItem.id === box.id ? (
                          <input
                            type="number"
                            step="0.01"
                            value={(editValues as BoxEditValues).kg}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                kg: parseFloat(e.target.value),
                              })
                            }
                            className={s.editInput}
                          />
                        ) : (
                          `${box.kg} kg`
                        )}
                      </div>

                      <div className={s.boxCell}>
                        {editingItem?.type === "box" &&
                        editingItem.id === box.id ? (
                          <select
                            value={
                              (editValues as BoxEditValues).isFrozen
                                ? "true"
                                : "false"
                            }
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                isFrozen: e.target.value === "true",
                              })
                            }
                            className={s.editSelect}
                          >
                            <option value="false">❄️ Refrigerado</option>
                            <option value="true">🧊 Congelado</option>
                          </select>
                        ) : (
                          <span className={s.boxType}>
                            {box.isFrozen ? "🧊 Congelado" : "❄️ Refrigerado"}
                          </span>
                        )}
                      </div>

                      <div className={s.boxCell}>
                        {box.entryDate
                          ? formatDate(box.entryDate)
                          : "No existe entry date"}
                      </div>

                      <div className={s.boxCell}>
                        {editingItem?.type === "box" &&
                        editingItem.id === box.id ? (
                          <div className={s.editActions}>
                            <button onClick={saveEdit} className={s.saveBtn}>
                              ✓
                            </button>
                            <button
                              onClick={cancelEdit}
                              className={s.cancelBtn}
                            >
                              ✗
                            </button>
                          </div>
                        ) : (
                          <div className={s.boxActions}>
                            <button
                              onClick={() => startEdit("box", box.id)}
                              className={s.editBtn}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteBox(box.id)}
                              className={s.deleteBtn}
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Agregar nueva caja */}
                  {editingItem?.type === "newBox" &&
                  editingItem.productId === product.id ? (
                    <div className={s.boxRow}>
                      <div className={s.boxCell}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Peso..."
                          value={(editValues as BoxEditValues).kg}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              kg: parseFloat(e.target.value),
                            })
                          }
                          className={s.editInput}
                        />
                      </div>
                      <div className={s.boxCell}>
                        <select
                          value={
                            (editValues as BoxEditValues).isFrozen
                              ? "true"
                              : "false"
                          }
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              isFrozen: e.target.value === "true",
                            })
                          }
                          className={s.editSelect}
                        >
                          <option value="false">❄️ Refrigerado</option>
                          <option value="true">🧊 Congelado</option>
                        </select>
                      </div>
                      <div className={s.boxCell}>Nueva</div>
                      <div className={s.boxCell}>
                        <div className={s.editActions}>
                          <button onClick={saveEdit} className={s.saveBtn}>
                            ✓
                          </button>
                          <button onClick={cancelEdit} className={s.cancelBtn}>
                            ✗
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={s.addBoxRow}>
                      <button
                        onClick={() => startEdit("newBox", null, product.id)}
                        className={s.addBoxBtn}
                      >
                        + Agregar Caja
                      </button>
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Sección de Acciones en Masa */}
      <div className={s.bulkActions}>
        <h3 className={s.bulkActionsTitle}>Acciones en Masa</h3>
        <div className={s.bulkActionsContent}>
          <p className={s.bulkActionsDescription}>
            Gestiona todo el stock de forma masiva
          </p>
          <button
            onClick={() => setShowBulkDeleteModal(true)}
            className={s.bulkDeleteBtn}
          >
            🗑️ Eliminar Todo el Stock
          </button>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmModal && confirmAction && (
        <div className={s.modalOverlay} onClick={closeConfirmModal}>
          <div className={s.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h3>
                {confirmAction.type === "save"
                  ? "Confirmar Cambios"
                  : "Confirmar Eliminación"}
              </h3>
              <button className={s.closeBtn} onClick={closeConfirmModal}>
                ×
              </button>
            </div>

            <div className={s.modalContent}>
              <div className={s.itemInfo}>
                <h4>{confirmAction.itemName}</h4>
              </div>

              {confirmAction.type === "save" ? (
                <div className={s.changesSection}>
                  <h5>Cambios a realizar:</h5>
                  <div className={s.changesGrid}>
                    {Object.entries(confirmAction.data || {}).map(
                      ([key, newValue]) => {
                        const originalValue = confirmAction.originalData?.[key];
                        const isChanged = originalValue !== newValue;

                        return (
                          <div
                            key={key}
                            className={`${s.changeItem} ${
                              isChanged ? s.changed : s.unchanged
                            }`}
                          >
                            <div className={s.fieldName}>
                              {key === "name" && "Nombre:"}
                              {key === "basePrice" && "Precio Base:"}
                              {key === "active" && "Estado:"}
                              {key === "kg" && "Peso:"}
                              {key === "isFrozen" && "Tipo:"}
                            </div>
                            <div className={s.values}>
                              {confirmAction.originalData ? (
                                <>
                                  <span className={s.originalValue}>
                                    {key === "basePrice" &&
                                      `$${(
                                        originalValue as number
                                      )?.toLocaleString("es-AR")}`}
                                    {key === "active" &&
                                      (originalValue ? "Activo" : "Inactivo")}
                                    {key === "kg" && `${originalValue} kg`}
                                    {key === "isFrozen" &&
                                      (originalValue
                                        ? "🧊 Congelado"
                                        : "❄️ Refrigerado")}
                                    {key === "name" && String(originalValue)}
                                  </span>
                                  <span className={s.arrow}>→</span>
                                </>
                              ) : (
                                <span className={s.newLabel}>Nuevo:</span>
                              )}
                              <span
                                className={`${s.newValue} ${
                                  isChanged ? s.highlighted : ""
                                }`}
                              >
                                {key === "basePrice" &&
                                  `$${(newValue as number)?.toLocaleString(
                                    "es-AR"
                                  )}`}
                                {key === "active" &&
                                  (newValue ? "Activo" : "Inactivo")}
                                {key === "kg" && `${newValue} kg`}
                                {key === "isFrozen" &&
                                  (newValue
                                    ? "🧊 Congelado"
                                    : "❄️ Refrigerado")}
                                {key === "name" && String(newValue)}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              ) : (
                <div className={s.deleteWarning}>
                  <div className={s.warningIcon}>⚠️</div>
                  <p>
                    Esta acción eliminará permanentemente la caja del stock.
                  </p>
                  <div className={s.deleteDetails}>
                    <p>
                      <strong>Peso:</strong> {confirmAction.originalData?.kg} kg
                    </p>
                    <p>
                      <strong>Tipo:</strong>{" "}
                      {confirmAction.originalData?.isFrozen
                        ? "🧊 Congelado"
                        : "❄️ Refrigerado"}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {confirmAction.originalData?.createdAt &&
                        formatDate(confirmAction.originalData.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className={s.modalFooter}>
              <button onClick={closeConfirmModal} className={s.cancelModalBtn}>
                Cancelar
              </button>
              <button
                onClick={executeAction}
                className={
                  confirmAction.type === "save"
                    ? s.confirmSaveBtn
                    : s.confirmDeleteBtn
                }
              >
                {confirmAction.type === "save"
                  ? "Guardar Cambios"
                  : "Eliminar Caja"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Eliminar Todo el Stock */}
      {showBulkDeleteModal && (
        <div
          className={s.modalOverlay}
          onClick={() => setShowBulkDeleteModal(false)}
        >
          <div className={s.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h3>Confirmar Eliminación Masiva</h3>
              <button
                className={s.closeBtn}
                onClick={() => setShowBulkDeleteModal(false)}
              >
                ×
              </button>
            </div>

            <div className={s.modalContent}>
              <div className={s.deleteWarning}>
                <div className={s.warningIcon}>⚠️</div>
                <p>
                  <strong>
                    Esta acción eliminará TODAS las cajas de stock disponibles.
                  </strong>
                </p>
                <p>Esta acción no es reversible.</p>
              </div>
            </div>

            <div className={s.modalFooter}>
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className={s.cancelModalBtn}
              >
                Cancelar
              </button>
              <button
                onClick={handleBulkDeleteAll}
                className={s.confirmDeleteBtn}
              >
                Eliminar Todo el Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyStock;
