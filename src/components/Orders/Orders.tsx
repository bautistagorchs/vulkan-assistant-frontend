"use client";

import React, { useEffect, useState } from "react";
import s from "./_orders.module.scss";
import { getClients, getAllProducts, createOrder, getOrders } from "@/lib/api";
import { Client, Box, SelectedProduct, TabKey, Product } from "@/lib/types";
import BoxSelector from "../BoxSelector/BoxSelector";

const Orders = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("nuevo");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [productos, setProductos] = useState<Product[]>([]);
  productos;
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [clienteId, setClienteId] = useState<number | "">("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [showBoxSelector, setShowBoxSelector] = useState<boolean>(false);
  const [selectedProductForBoxes, setSelectedProductForBoxes] =
    useState<Product | null>(null);
  const [confirmMsg, setConfirmMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  // Cargar pedidos
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      setError("Error al cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  // Cargar pedidos cuando se activa la tab listado
  useEffect(() => {
    if (activeTab === "listado") {
      fetchOrders();
    }
  }, [activeTab]);

  // Manejar expansión de pedido
  const handleToggleOrderExpansion = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Seleccionar producto para elegir cajas
  const handleSelectProduct = (productId: number) => {
    const product = productos.find((p) => p.id === productId);
    if (product) {
      setSelectedProductForBoxes(product);
      setShowBoxSelector(true);
    }
  };

  // Callback cuando se seleccionan cajas
  const handleBoxesSelected = (productId: number, selectedBoxes: Box[]) => {
    const product = productos.find((p) => p.id === productId);
    if (!product) return;

    const totalKg = selectedBoxes.reduce((acc, box) => acc + box.kg, 0);

    const newSelectedProduct: SelectedProduct = {
      productId,
      productName: product.name,
      selectedBoxes,
      totalKg,
    };

    setSelectedProducts((prev) => {
      // Si ya existe el producto, reemplazarlo
      const existingIndex = prev.findIndex((p) => p.productId === productId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newSelectedProduct;
        return updated;
      }
      // Si no existe, agregarlo
      return [...prev, newSelectedProduct];
    });

    setShowBoxSelector(false);
    setSelectedProductForBoxes(null);
  };

  // Cancelar selección de cajas
  const handleCancelBoxSelection = () => {
    setShowBoxSelector(false);
    setSelectedProductForBoxes(null);
  };

  // Eliminar producto del pedido
  const handleEliminarProducto = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => p.productId !== productId)
    );
  };

  // Confirmar pedido
  const handleConfirmarPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || selectedProducts.length === 0) return;

    try {
      setSubmitting(true);
      const orderItems = selectedProducts.map((product) => ({
        productId: product.productId,
        boxIds: product.selectedBoxes.map((box) => box.id),
      }));
      console.log("Al api.ts se envian: ", { clienteId, orderItems });

      await createOrder(Number(clienteId), orderItems);

      setConfirmMsg("¡Pedido confirmado exitosamente!");
      setTimeout(() => setConfirmMsg(null), 3000);

      // Limpiar formulario
      setClienteId("");
      setSelectedProducts([]);

      // Recargar pedidos si estamos en la tab listado
      if (activeTab === "listado") {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error al confirmar pedido:", error);
      setError("Error al confirmar el pedido. Intenta nuevamente.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  // Calcular totales (necesitarías el precio por kg desde el backend)
  const calcularTotales = () => {
    // Por ahora sin precios, solo mostramos kg totales
    const totalKg = selectedProducts.reduce(
      (acc, product) => acc + product.totalKg,
      0
    );
    return { totalKg };
  };

  const { totalKg } = calcularTotales();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingProducts(true);
        const [clientsData, productsData] = await Promise.all([
          getClients(),
          getAllProducts(),
        ]);
        setClients(clientsData);
        setProductos(productsData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError("Error al cargar datos del servidor");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={s.ordersPage}>
      <div className={s.tabs}>
        <button
          className={`${s.tabBtn} ${activeTab === "nuevo" ? s.activeTab : ""}`}
          onClick={() => setActiveTab("nuevo")}
          type="button"
        >
          Cargar nuevo pedido
        </button>
        <button
          className={`${s.tabBtn} ${
            activeTab === "listado" ? s.activeTab : ""
          }`}
          onClick={() => setActiveTab("listado")}
          type="button"
        >
          Ver todos los pedidos
        </button>
      </div>

      {activeTab === "nuevo" && (
        <section className={s.newOrder}>
          <div className={s.content}>
            <h2>Nuevo Pedido</h2>
            {error && <div className={s.error}>{error}</div>}
            {loadingProducts ? (
              <div className={s.ordersLoading}>
                Cargando productos y clientes...
              </div>
            ) : (
              <>
                {showBoxSelector && selectedProductForBoxes ? (
                  <BoxSelector
                    productId={selectedProductForBoxes.id}
                    productName={selectedProductForBoxes.name}
                    onBoxesSelected={handleBoxesSelected}
                    onCancel={handleCancelBoxSelection}
                  />
                ) : (
                  <form
                    className={s.ordersForm}
                    onSubmit={handleConfirmarPedido}
                  >
                    <div className={s.formBlock}>
                      <label>Cliente</label>
                      <select
                        value={clienteId}
                        onChange={(e) => setClienteId(Number(e.target.value))}
                        required
                        className={s.input}
                      >
                        <option value="">Seleccionar cliente...</option>
                        {clients
                          .slice()
                          .sort((a, b) =>
                            a.name.localeCompare(b.name, "es", {
                              sensitivity: "base",
                            })
                          )
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className={s.clientInfo}></div>

                    <div className={s.formBlock}>
                      <label>Agregar Producto</label>
                      <div className={s.productoRow}>
                        <select
                          onChange={(e) => {
                            const productId = Number(e.target.value);
                            if (productId) {
                              handleSelectProduct(productId);
                              e.target.value = ""; // Reset select
                            }
                          }}
                          className={s.input}
                        >
                          <option value="">
                            Elegir producto para agregar...
                          </option>
                          {productos
                            .slice()
                            .sort((a, b) =>
                              a.name.localeCompare(b.name, "es", {
                                sensitivity: "base",
                              })
                            )
                            .map((p) => (
                              <option
                                key={p.id}
                                value={p.id}
                                disabled={!p.hasStock}
                              >
                                {p.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className={s.hint}>
                        Seleccioná un producto para elegir sus cajas disponibles
                      </div>
                    </div>

                    {selectedProducts.length > 0 && (
                      <div className={s.resumenBlock}>
                        <h3>Resumen del pedido</h3>
                        <div className={s.productsList}>
                          {selectedProducts.map((product) => (
                            <div
                              key={product.productId}
                              className={s.productCard}
                            >
                              <div className={s.productHeader}>
                                <h4>{product.productName}</h4>
                                <button
                                  className={s.eliminarBtn}
                                  type="button"
                                  onClick={() =>
                                    handleEliminarProducto(product.productId)
                                  }
                                  title="Eliminar producto"
                                >
                                  ×
                                </button>
                              </div>
                              <div className={s.boxesList}>
                                {product.selectedBoxes.map((box) => (
                                  <div key={box.id} className={s.boxItem}>
                                    <span className={s.boxWeight}>
                                      {box.kg} kg
                                    </span>
                                    <span className={s.boxType}>
                                      {box.isFrozen
                                        ? "🧊 Congelado"
                                        : "❄️ Refrigerado"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className={s.productTotal}>
                                Total: <strong>{product.totalKg} kg</strong>(
                                {product.selectedBoxes.length} caja
                                {product.selectedBoxes.length !== 1 ? "s" : ""})
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className={s.orderSummary}>
                          <div className={s.totalKg}>
                            <strong>Total del pedido: {totalKg} kg</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={s.formFooter}>
                      <button
                        className={s.confirmarBtn}
                        type="submit"
                        disabled={
                          !clienteId ||
                          selectedProducts.length === 0 ||
                          submitting
                        }
                      >
                        {submitting ? "Confirmando..." : "Confirmar pedido"}
                      </button>
                      {confirmMsg && (
                        <span className={s.confirmMsg}>{confirmMsg}</span>
                      )}
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {activeTab === "listado" && (
        <section className={s.ordersSection}>
          <h3 className={s.ordersTitle}>Pedidos existentes</h3>
          {loading && <div className={s.ordersLoading}>Cargando...</div>}
          {error && <div className={s.ordersError}>{error}</div>}
          {!loading && !error && (
            <div className={s.ordersTableWrapper}>
              <table className={s.ordersTable}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Kilos Totales</th>
                    <th>Total Cajas</th>
                    <th>Monto Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className={s.ordersVacio}>
                        No hay pedidos cargados.
                      </td>
                    </tr>
                  ) : (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    orders.map((order: any) => {
                      const totalKg = order.items.reduce(
                        (acc: number, item: any) => acc + item.totalKg,
                        0
                      );
                      const totalBoxes = order.items.reduce(
                        (acc: number, item: any) => acc + item.boxes.length,
                        0
                      );
                      const totalAmount = order.invoice?.total || 0;
                      const isExpanded = expandedOrder === order.id;

                      return (
                        <React.Fragment key={order.id}>
                          <tr
                            className={s.orderRow}
                            onClick={() => handleToggleOrderExpansion(order.id)}
                          >
                            <td className={s.expandIcon}>
                              <span
                                className={
                                  isExpanded ? s.expanded : s.collapsed
                                }
                              >
                                {isExpanded ? "▼" : "▶"}
                              </span>
                            </td>
                            <td>{order.client?.name || "Desconocido"}</td>
                            <td>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              {order.items
                                ?.map(
                                  (item: any) =>
                                    item.product?.name || "Desconocido"
                                )
                                .join(", ")}
                            </td>
                            <td>{totalKg.toFixed(2)} kg</td>
                            <td>{totalBoxes}</td>
                            <td>${totalAmount.toFixed(2)}</td>
                            <td>
                              <span className={s.orderStatus}>
                                {order.invoice?.paymentStatus === "PAID"
                                  ? "Pagado"
                                  : order.invoice?.paymentStatus === "CHEQUE"
                                  ? "Cheque"
                                  : "Pendiente"}
                              </span>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className={s.expandedRow}>
                              <td colSpan={8}>
                                <div className={s.orderDetails}>
                                  <h4>Detalles del Pedido #{order.id}</h4>
                                  {order.items?.map(
                                    (item: any, itemIndex: number) => (
                                      <div
                                        key={itemIndex}
                                        className={s.itemDetail}
                                      >
                                        <h5>
                                          {item.product?.name ||
                                            "Producto desconocido"}
                                        </h5>
                                        <p>
                                          <strong>Total del producto:</strong>{" "}
                                          {item.totalKg} kg - $
                                          {item.subtotal.toFixed(2)} ($
                                          {item.unitPrice}/kg)
                                        </p>
                                        <div className={s.boxesList}>
                                          <strong>Cajas incluidas:</strong>
                                          {item.boxes?.map(
                                            (box: any, boxIndex: number) => (
                                              <div
                                                key={boxIndex}
                                                className={s.boxDetail}
                                              >
                                                <span className={s.boxInfo}>
                                                  📦 Caja #{box.id} - {box.kg}{" "}
                                                  kg -
                                                  {box.isFrozen
                                                    ? " 🧊 Congelado"
                                                    : " ❄️ Refrigerado"}
                                                  {box.entryDate && (
                                                    <span
                                                      className={s.entryDate}
                                                    >
                                                      {" "}
                                                      (Ingreso:{" "}
                                                      {new Date(
                                                        box.entryDate
                                                      ).toLocaleDateString()}
                                                      )
                                                    </span>
                                                  )}
                                                </span>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Orders;
