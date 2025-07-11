"use client";

import React, { useEffect, useState } from "react";
import s from "./_orders.module.scss";
import { getClients } from "@/lib/api";
import { Client } from "@/lib/types";

const productos = [
  { id: 1, nombre: "Asado", precioPorKg: 3200 },
  { id: 2, nombre: "Vacío", precioPorKg: 3500 },
  { id: 3, nombre: "Matambre", precioPorKg: 3400 },
];

const CAJA_KG = 23;

type TabKey = "nuevo" | "listado";

const Orders = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("nuevo");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [clienteId, setClienteId] = useState<number | "">("");
  const [items, setItems] = useState<{ productoId: number; cajas: number }[]>(
    []
  );
  const [productoSeleccionado, setProductoSeleccionado] = useState<number | "">(
    ""
  );
  const [cajas, setCajas] = useState<number | "">("");
  const [confirmMsg, setConfirmMsg] = useState<string | null>(null);

  // Agregar producto al pedido
  const handleAgregarProducto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoSeleccionado || !cajas || Number(cajas) <= 0) return;
    setItems((prev) => {
      // Si ya está, sumo cajas
      const idx = prev.findIndex((i) => i.productoId === productoSeleccionado);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].cajas += Number(cajas);
        return updated;
      }
      return [
        ...prev,
        { productoId: Number(productoSeleccionado), cajas: Number(cajas) },
      ];
    });
    setProductoSeleccionado("");
    setCajas("");
  };

  // Eliminar producto del pedido
  const handleEliminarProducto = (productoId: number) => {
    setItems((prev) => prev.filter((i) => i.productoId !== productoId));
  };

  // Confirmar pedido (handler preparado)
  const handleConfirmarPedido = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se enviaría el pedido al backend
    setConfirmMsg("¡Pedido confirmado!");
    setTimeout(() => setConfirmMsg(null), 2500);
    // Opcional: limpiar formulario
    // setClienteId(""); setItems([]);
  };

  // Calcular totales
  const resumen = items.map((item) => {
    const prod = productos.find((p) => p.id === item.productoId)!;
    const kilos = item.cajas * CAJA_KG;
    const subtotal = kilos * prod.precioPorKg;
    return {
      ...item,
      nombre: prod.nombre,
      precioPorKg: prod.precioPorKg,
      kilos,
      subtotal,
    };
  });
  const total = resumen.reduce((acc, r) => acc + r.subtotal, 0);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };
    fetchClients();
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
            <form className={s.ordersForm} onSubmit={handleConfirmarPedido}>
              <div className={s.formBlock}>
                <label>Cliente</label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(Number(e.target.value))}
                  required
                  className={s.input}
                >
                  <option value="">Seleccionar cliente...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={s.formBlock}>
                <label>Producto</label>
                <div className={s.productoRow}>
                  <select
                    value={productoSeleccionado}
                    onChange={(e) =>
                      setProductoSeleccionado(Number(e.target.value))
                    }
                    className={s.input}
                  >
                    <option value="">Elegir producto...</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} (${p.precioPorKg}/kg)
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    placeholder="Cajas"
                    value={cajas}
                    onChange={(e) => setCajas(Number(e.target.value))}
                    className={s.input}
                    style={{ width: 90 }}
                  />
                  <button
                    className={s.agregarBtn}
                    onClick={handleAgregarProducto}
                    type="button"
                    disabled={
                      !productoSeleccionado || !cajas || Number(cajas) <= 0
                    }
                  >
                    Agregar
                  </button>
                </div>
                <div className={s.kgHint}>
                  {cajas && Number(cajas) > 0 && (
                    <span>
                      {Number(cajas) * CAJA_KG} kg ({cajas} caja
                      {Number(cajas) > 1 ? "s" : ""})
                    </span>
                  )}
                </div>
              </div>

              {items.length > 0 && (
                <div className={s.resumenBlock}>
                  <h3>Resumen del pedido</h3>
                  <table className={s.resumenTable}>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cajas</th>
                        <th>Kilos</th>
                        <th>Precio/kg</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumen.map((r) => (
                        <tr key={r.productoId}>
                          <td>{r.nombre}</td>
                          <td>{r.cajas}</td>
                          <td>{r.kilos}</td>
                          <td>${r.precioPorKg}</td>
                          <td>${r.subtotal.toLocaleString()}</td>
                          <td>
                            <button
                              className={s.eliminarBtn}
                              type="button"
                              onClick={() =>
                                handleEliminarProducto(r.productoId)
                              }
                              title="Eliminar"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} className={s.totalLabel}>
                          Total
                        </td>
                        <td className={s.totalValue}>
                          ${total.toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              <div className={s.formFooter}>
                <button
                  className={s.confirmarBtn}
                  type="submit"
                  disabled={!clienteId || items.length === 0}
                >
                  Confirmar pedido
                </button>
                {confirmMsg && (
                  <span className={s.confirmMsg}>{confirmMsg}</span>
                )}
              </div>
            </form>
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
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Kilos Totales</th>
                    <th>Total</th>
                    <th>Estado Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={s.ordersVacio}>
                        No hay pedidos cargados.
                      </td>
                    </tr>
                  ) : (
                    ""
                    // orders.map((order) => {
                    //   const client = clients.find((c) => c.id === order.clientId);
                    //   const totalKilos = order.items.reduce(
                    //     (acc, item) => acc + item.cajas * CAJA_KG,
                    //     0
                    //   );
                    //   const totalPrice = order.items.reduce((acc, item) => {
                    //     const prod = productos.find((p) => p.id === item.productoId);
                    //     return acc + (prod ? item.cajas * CAJA_KG * prod.precioPorKg : 0);
                    //   }, 0);
                    //   return (
                    // <tr key={order.id}>
                    //   <td>{client?.name || "Desconocido"}</td>
                    //   <td>{new Date(order.fecha).toLocaleDateString()}</td>
                    //   <td>
                    //     {order.items
                    //       .map((item) => {
                    //         const prod = productos.find((p) => p.id === item.productoId);
                    //         return `${item.cajas} caja${item.cajas > 1 ? "s" : ""} ${prod?.nombre || "Desconocido"}`;
                    //       })
                    //       .join(", ")}
                    //   </td>
                    //   <td>{totalKilos} kg</td>
                    //   <td>${totalPrice.toLocaleString()}</td>
                    //   <td className={s[order.estadoPago.toLowerCase()]}>
                    //     {order.estadoPago}
                    //   </td>
                    // </tr>
                    //   );
                    // })
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
