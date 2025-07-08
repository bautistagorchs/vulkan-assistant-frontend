"use client";

import React, { useState } from "react";
import s from "./_invoices.module.scss";

type Estado = "pendiente" | "cheque" | "pagado";

type Factura = {
  numero: string;
  cliente: string;
  fecha: string;
  monto: number;
  estado: Estado;
};

// Mock data
const facturas: Factura[] = [
  {
    numero: "0001-00001234",
    cliente: "Carnicería El Buen Corte",
    fecha: "2024-05-10",
    monto: 152000,
    estado: "pendiente",
  },
  {
    numero: "0001-00001235",
    cliente: "Distribuidora La Rural",
    fecha: "2024-05-09",
    monto: 98000,
    estado: "cheque",
  },
  {
    numero: "0001-00001236",
    cliente: "Supermercado Central",
    fecha: "2024-05-08",
    monto: 210000,
    estado: "pagado",
  },
  {
    numero: "0001-00001237",
    cliente: "Carnicería El Buen Corte",
    fecha: "2024-05-07",
    monto: 87000,
    estado: "pagado",
  },
  {
    numero: "0001-00001238",
    cliente: "Distribuidora La Rural",
    fecha: "2024-05-06",
    monto: 120000,
    estado: "pendiente",
  },
];

const estados: Record<Estado, { label: string; color: string }> = {
  pendiente: { label: "Pendiente", color: s.badgePendiente },
  cheque: { label: "Cheque emitido", color: s.badgeCheque },
  pagado: { label: "Pagado", color: s.badgePagado },
};

const clientesUnicos = [...new Set(facturas.map((f) => f.cliente))];

const Invoices = () => {
  const [filtroCliente, setFiltroCliente] = useState<string>("");

  const facturasFiltradas = filtroCliente
    ? facturas.filter((f) => f.cliente === filtroCliente)
    : facturas;

  const handleDescargar = (numero: string) => {
    // Simular descarga
    alert(`Descargando PDF de la factura ${numero}`);
  };

  return (
    <div className={s.invoicesPage}>
      <h2>Facturas</h2>
      <div className={s.filtroBar}>
        <label htmlFor="filtroCliente">Filtrar por cliente:</label>
        <select
          id="filtroCliente"
          className={s.filtroSelect}
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
        >
          <option value="">Todos</option>
          {clientesUnicos.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className={s.tablaWrapper}>
        <table className={s.invoicesTable}>
          <thead>
            <tr>
              <th>Nº de factura</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Monto total</th>
              <th>Estado de pago</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {facturasFiltradas.map((f) => (
              <tr key={f.numero}>
                <td>{f.numero}</td>
                <td>{f.cliente}</td>
                <td>{f.fecha}</td>
                <td>${f.monto.toLocaleString()}</td>
                <td>
                  <span className={`${s.badge} ${estados[f.estado].color}`}>
                    {estados[f.estado].label}
                  </span>
                </td>
                <td>
                  <button
                    className={s.descargarBtn}
                    onClick={() => handleDescargar(f.numero)}
                  >
                    Ver PDF
                  </button>
                </td>
              </tr>
            ))}
            {facturasFiltradas.length === 0 && (
              <tr>
                <td colSpan={6} className={s.noResults}>
                  No se encontraron facturas para este cliente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
