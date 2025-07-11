"use client";
import { useState, useEffect } from "react";
import s from "./_uploadNewClient.module.scss";
import { getClients, createClient } from "@/lib/api";

type TabKey = "nuevo" | "listado";

export default function UploadNewClient() {
  const [activeTab, setActiveTab] = useState<TabKey>("nuevo");

  // Form state
  const [nombre, setNombre] = useState("");
  const [cuit, setCuit] = useState("");
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [condicionIVA, setCondicionIVA] = useState("");
  const [email, setEmail] = useState("");
  const [notas, setNotas] = useState("");
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Clientes state
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch clients
  const fetchClientes = () => {
    setLoading(true);
    getClients()
      .then((data) => setClientes(data))
      .catch(() => setError("Error al cargar clientes"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (activeTab === "listado" && clientes.length === 0) {
      fetchClientes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(false);

    if (!nombre || !cuit || !condicionIVA) {
      setFormError("Nombre, CUIT y condición frente al IVA son obligatorios.");
      return;
    }

    try {
      await createClient({
        name: nombre,
        cuit,
        direccion,
        localidad,
        telefono,
        condicionIVA,
        email,
        notas,
      });
      setSuccess(true);
      setNombre("");
      setCuit("");
      setDireccion("");
      setLocalidad("");
      setTelefono("");
      setCondicionIVA("");
      setEmail("");
      setNotas("");
      fetchClientes();
    } catch (err: any) {
      setFormError(
        err?.response?.data?.error ||
          "Error al cargar el cliente. Verifique los datos."
      );
    }
  };

  return (
    <div className={s.uploadPage}>
      <div className={s.tabs}>
        <button
          className={`${s.tabBtn} ${activeTab === "nuevo" ? s.activeTab : ""}`}
          onClick={() => setActiveTab("nuevo")}
          type="button"
        >
          Cargar nuevo cliente
        </button>
        <button
          className={`${s.tabBtn} ${
            activeTab === "listado" ? s.activeTab : ""
          }`}
          onClick={() => setActiveTab("listado")}
          type="button"
        >
          Ver todos los clientes
        </button>
      </div>

      {activeTab === "nuevo" && (
        <div className={s.uploadCard}>
          <h2 className={s.uploadCard__title}>Nuevo Cliente</h2>
          <form onSubmit={handleSubmit} className={s.uploadForm}>
            <input
              className={s.input}
              type="text"
              placeholder="Nombre o razón social"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <input
              className={s.input}
              type="text"
              placeholder="CUIT"
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              required
            />
            <input
              className={s.input}
              type="text"
              placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
            <input
              className={s.input}
              type="text"
              placeholder="Localidad"
              value={localidad}
              onChange={(e) => setLocalidad(e.target.value)}
            />
            <input
              className={s.input}
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            <select
              className={s.input}
              value={condicionIVA}
              onChange={(e) => setCondicionIVA(e.target.value)}
              required
            >
              <option value="">Condición frente al IVA</option>
              <option value="RI">Responsable Inscripto</option>
              <option value="Monotributo">Monotributo</option>
              <option value="Exento">Exento</option>
              <option value="ConsumidorFinal">Consumidor Final</option>
            </select>
            <input
              className={s.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              className={s.input}
              placeholder="Notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={2}
            />
            <button type="submit" className={s.submitBtn}>
              Cargar cliente
            </button>
          </form>
          {formError && <p className={s.errorMsg}>{formError}</p>}
          {success && (
            <p className={s.successMsg}>Cliente cargado correctamente</p>
          )}
        </div>
      )}

      {activeTab === "listado" && (
        <section className={s.clientesSection}>
          <h3 className={s.clientesTitle}>Clientes existentes</h3>
          {loading && <div className={s.clientesLoading}>Cargando...</div>}
          {error && <div className={s.clientesError}>{error}</div>}
          {!loading && !error && (
            <div className={s.clientesTableWrapper}>
              <table className={s.clientesTable}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>CUIT</th>
                    <th>Dirección</th>
                    <th>Localidad</th>
                    <th>Teléfono</th>
                    <th>Cond. IVA</th>
                    <th>Email</th>
                    <th>Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.length === 0 ? (
                    <tr>
                      <td colSpan={8} className={s.clientesVacio}>
                        No hay clientes cargados.
                      </td>
                    </tr>
                  ) : (
                    clientes.map((c) => (
                      <tr key={c.id || c.cuit || c.nombre}>
                        <td>{c.name || c.razonSocial}</td>
                        <td>{c.cuit}</td>
                        <td>{c.direccion}</td>
                        <td>{c.localidad}</td>
                        <td>{c.telefono}</td>
                        <td>{c.condicionIVA}</td>
                        <td>{c.email}</td>
                        <td>{c.notas}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
