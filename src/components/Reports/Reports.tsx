"use client";

import React from "react";
import s from "./_reports.module.scss";

// Mock data
const ventasPorCliente = [
  { cliente: "Carnicería El Buen Corte", monto: 210000 },
  { cliente: "Distribuidora La Rural", monto: 180000 },
  { cliente: "Supermercado Central", monto: 120000 },
];

const cortesMasVendidos = [
  { corte: "Asado", cantidad: 320 },
  { corte: "Vacío", cantidad: 270 },
  { corte: "Matambre", cantidad: 210 },
];

const demoraPago = [
  { cliente: "Carnicería El Buen Corte", dias: 7 },
  { cliente: "Distribuidora La Rural", dias: 12 },
  { cliente: "Supermercado Central", dias: 5 },
];

const stockBajo = [
  { producto: "Asado", unidades: 8 },
  { producto: "Matambre", unidades: 5 },
];

const Reports: React.FC = () => {
  return (
    <div className={s.reportsPage}>
      <div className={s.filtroBar}>
        <label htmlFor="fechaDesde">Rango de fechas:</label>
        <input type="date" id="fechaDesde" className={s.filtroInput} />
        <span>—</span>
        <input type="date" id="fechaHasta" className={s.filtroInput} />
        <button className={s.filtroBtn} disabled>
          Filtrar
        </button>
      </div>
      <div className={s.cardsGrid}>
        {/* Ventas por cliente */}
        <section className={s.card}>
          <h3>Ventas por cliente</h3>
          <div className={s.chartPlaceholder}>
            {/* Aquí iría un gráfico de barras (Chart.js) */}
            <div className={s.barrasMock}>
              {ventasPorCliente.map((v, i) => (
                <div key={v.cliente} className={s.barraFila}>
                  <span className={s.barraLabel}>{v.cliente}</span>
                  <div className={s.barraCont}>
                    <div
                      className={s.barra}
                      style={{
                        width: `${
                          (v.monto / ventasPorCliente[0].monto) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <span className={s.barraValor}>
                    ${v.monto.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cortes más vendidos */}
        <section className={s.card}>
          <h3>Cortes más vendidos</h3>
          <div className={s.chartPlaceholder}>
            {/* Aquí iría un gráfico de barras (Chart.js) */}
            <div className={s.barrasMock}>
              {cortesMasVendidos.map((c, i) => (
                <div key={c.corte} className={s.barraFila}>
                  <span className={s.barraLabel}>{c.corte}</span>
                  <div className={s.barraCont}>
                    <div
                      className={s.barra}
                      style={{
                        width: `${
                          (c.cantidad / cortesMasVendidos[0].cantidad) * 100
                        }%`,
                        background: "#38bdf8",
                      }}
                    />
                  </div>
                  <span className={s.barraValor}>{c.cantidad} cajas</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demora de pago promedio */}
        <section className={s.card}>
          <h3>Demora de pago promedio</h3>
          <table className={s.simpleTable}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Días promedio</th>
              </tr>
            </thead>
            <tbody>
              {demoraPago.map((d) => (
                <tr key={d.cliente}>
                  <td>{d.cliente}</td>
                  <td>{d.dias} días</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Alertas de stock bajo */}
        <section className={s.card}>
          <h3>Alertas de stock bajo</h3>
          {stockBajo.length === 0 ? (
            <div className={s.stockOk}>No hay productos con stock bajo.</div>
          ) : (
            <table className={s.simpleTable}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Unidades</th>
                </tr>
              </thead>
              <tbody>
                {stockBajo.map((item) => (
                  <tr key={item.producto}>
                    <td>{item.producto}</td>
                    <td>
                      <span className={s.stockBajoBadge}>{item.unidades}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
};

export default Reports;
