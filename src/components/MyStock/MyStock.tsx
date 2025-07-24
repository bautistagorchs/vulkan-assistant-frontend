"use client";
import React, { useState, useEffect } from "react";
import {
  getStock,
  updateProduct,
  updateBox,
  deleteBox,
  addBoxToProduct,
} from "@/lib/api";
import { ProductWithStock, BoxWithDetails } from "@/lib/types";
import s from "./_myStock.module.scss";

const MyStock = () => {
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<{
    type: "product" | "box" | "newBox";
    id: number | null;
    productId?: number;
  } | null>(null);
  const [editValues, setEditValues] = useState<any>({});

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

  const saveEdit = async () => {
    if (!editingItem) return;

    try {
      if (editingItem.type === "product" && editingItem.id) {
        await updateProduct(editingItem.id, editValues);
      } else if (editingItem.type === "box" && editingItem.id) {
        await updateBox(editingItem.id, editValues);
      } else if (editingItem.type === "newBox" && editingItem.productId) {
        await addBoxToProduct(editingItem.productId, editValues);
      }

      await loadStock();
      cancelEdit();
    } catch (error) {
      console.error("Error guardando cambios:", error);
    }
  };

  const handleDeleteBox = async (boxId: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta caja?")) {
      try {
        await deleteBox(boxId);
        await loadStock();
      } catch (error) {
        console.error("Error eliminando caja:", error);
      }
    }
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
                        value={editValues.name}
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
                      value={editValues.basePrice}
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
                      value={editValues.active ? "true" : "false"}
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

                <div className={s.cell}>
                  <span
                    className={`${s.stockCount} ${
                      hasStock ? s.hasStock : s.noStock
                    }`}
                  >
                    {product.boxes.length} cajas
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
                    <div className={s.boxHeaderCell}>Fecha Creación</div>
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
                            value={editValues.kg}
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
                            value={editValues.isFrozen ? "true" : "false"}
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
                        {formatDate(box.createdAt)}
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
                          value={editValues.kg}
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
                          value={editValues.isFrozen ? "true" : "false"}
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
    </div>
  );
};

export default MyStock;
