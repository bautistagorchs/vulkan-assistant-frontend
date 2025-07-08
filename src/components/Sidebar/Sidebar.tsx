import Link from "next/link";
import s from "./_sidebar.module.scss";

export default function Sidebar() {
  return (
    <aside className={s.sidebar}>
      <h2>Distribuidora</h2>
      <nav>
        <ul>
          <li>
            <Link href="/upload">Cargar Lista</Link>
          </li>
          <li>
            <Link href="/orders">Pedidos</Link>
          </li>
          <li>
            <Link href="/invoices">Facturas</Link>
          </li>
          <li>
            <Link href="/reports">Reportes</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
