export function showNotFound() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <section class="not-found">
      <h2>Error 404</h2>
      <p>La página que buscas no existe.</p>
      <a href="#/login">Ir al inicio de sesión</a>
    </section>
  `;
}
