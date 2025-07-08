"use client";
import { useState } from "react";
import s from "./_upload.module.scss";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);

  // Mock de archivos cargados previamente con info extra
  const listasViejas = [
    {
      nombre: "lista-precios-abril.xlsx",
      fecha: "2024-04-01",
      size: "58 KB",
      usuario: "admin",
    },
    {
      nombre: "lista-precios-marzo.xlsx",
      fecha: "2024-03-01",
      size: "55 KB",
      usuario: "juanperez",
    },
    {
      nombre: "lista-precios-febrero.xlsx",
      fecha: "2024-02-01",
      size: "53 KB",
      usuario: "admin",
    },
  ];

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleFileChange = (e: FileChangeEvent): void => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".xlsx")) {
      setFile(selectedFile);
      console.log("Archivo seleccionado:", selectedFile.name);
    } else {
      alert("Por favor, subí un archivo .xlsx");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      console.log("Enviando archivo:", file.name);
      // Aquí irá la llamada a la API para subir a S3
    }
  };

  return (
    <div className={s.uploadPage}>
      <div className={s.uploadCard}>
        <h2>Cargar Lista de Precios</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".xlsx" onChange={handleFileChange} />
          <button type="submit" disabled={!file}>
            Subir
          </button>
        </form>
        {file && <p>Archivo seleccionado: {file.name}</p>}
      </div>

      <section className={s.listasViejasSection}>
        <h3>Historial de listas de precios cargadas</h3>
        <div className={s.listasViejasTableWrapper}>
          <table className={s.listasViejasTable}>
            <thead>
              <tr>
                <th>Archivo</th>
                <th>Fecha de carga</th>
                <th>Tamaño</th>
                <th>Usuario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listasViejas.map((l) => (
                <tr key={l.nombre}>
                  <td>{l.nombre}</td>
                  <td>{l.fecha}</td>
                  <td>{l.size}</td>
                  <td>{l.usuario}</td>
                  <td>
                    <button className={s.verBtn} title="Ver/Descargar">
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
