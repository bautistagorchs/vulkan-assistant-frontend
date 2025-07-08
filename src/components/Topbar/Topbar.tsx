import s from "./_topbar.module.scss";

export default function Topbar() {
  return (
    <header className={s.topbar}>
      <h1>Gestión de Pedidos</h1>
      <div className={s.user}>Usuario: Admin</div>
    </header>
  );
}
