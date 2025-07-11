"use client";
import { useState } from "react";
import { getProducts, getClients, testPost } from "@/lib/api";
import styles from "./_apiTest.module.scss";

export default function ApiTest() {
  const [apiResult, setApiResult] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [postInput, setPostInput] = useState<string>(
    JSON.stringify(
      {
        name: "Nuevo producto de prueba",
        basePrice: 1234,
        stockKg: 100,
      },
      null,
      2
    )
  );

  const handleTestProducts = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await getProducts();
      setApiResult(data);
    } catch (err: any) {
      setApiError(err?.message || "Error desconocido");
      setApiResult(null);
    }
    setLoading(false);
  };

  const handleTestClients = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await getClients();
      setApiResult(data);
    } catch (err: any) {
      setApiError(err?.message || "Error desconocido");
      setApiResult(null);
    }
    setLoading(false);
  };

  const handleTestPost = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await testPost(JSON.parse(postInput));
      setApiResult(data);
    } catch (err: any) {
      setApiError(err?.message || "Error desconocido");
      setApiResult(null);
    }
    setLoading(false);
  };

  return (
    <section className={styles.apiTestSection}>
      <h3>Probar peticiones al backend</h3>
      <div className={styles.apiTestBtns}>
        <button onClick={handleTestProducts} disabled={loading}>
          Probar getProducts
        </button>
        <button onClick={handleTestClients} disabled={loading}>
          Probar getClients
        </button>
      </div>
      <div className={styles.apiTestPost}>
        <label>POST body (JSON):</label>
        <textarea
          value={postInput}
          onChange={(e) => setPostInput(e.target.value)}
          rows={3}
          className={styles.apiPostInput}
          disabled={loading}
        />
        <button onClick={handleTestPost} disabled={loading}>
          Probar POST
        </button>
      </div>
      {loading && <div className={styles.apiLoading}>Cargando...</div>}
      {apiError && <div className={styles.apiError}>Error: {apiError}</div>}
      {apiResult && (
        <pre className={styles.apiResult}>
          {JSON.stringify(apiResult, null, 2)}
        </pre>
      )}
    </section>
  );
}
