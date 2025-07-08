"use client";

import React, { useState } from "react";
import s from "./_orders.module.scss";

// Mock data
const clientes = [
  { id: 1, nombre: "Carnicería El Buen Corte" },
  { id: 2, nombre: "Distribuidora La Rural" },
  { id: 3, nombre: "Supermercado Central" },
];

const productos = [
  { id: 1, nombre: "Asado", precioPorKg: 3200 },
  { id: 2, nombre: "Vacío", precioPorKg: 3500 },
  { id: 3, nombre: "Matambre", precioPorKg: 3400 },
];

const CAJA_KG = 23;

const Orders = () => {
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

  return (
    <div className={s.ordersPage}>
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
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={s.formBlock}>
          <label>Producto</label>
          <div className={s.productoRow}>
            <select
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(Number(e.target.value))}
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
              disabled={!productoSeleccionado || !cajas || Number(cajas) <= 0}
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
                        onClick={() => handleEliminarProducto(r.productoId)}
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
                  <td className={s.totalValue}>${total.toLocaleString()}</td>
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
          {confirmMsg && <span className={s.confirmMsg}>{confirmMsg}</span>}
        </div>
      </form>
    </div>
  );
};

export default Orders;
