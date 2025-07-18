import { loginUser } from '../js/auth';

export function showLogin() {
  const app = document.getElementById('app'); // Get main app container

  // Set login form HTML
  app.innerHTML = `
    <section class="login">
      <h2>Iniciar Sesión</h2>
      <form id="login-form">
        <label>Email:</label>
        <input type="email" id="email" required />
        <label>Contraseña:</label>
        <input type="password" id="password" required />
        <button type="submit">Entrar</button>
      </form>
      <p>¿No tienes una cuenta? <a href="#/register">Regístrate</a></p>
    </section>
  `;

  const form = document.getElementById('login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const userData = await loginUser(email, password); // Asume que esto devuelve el rol
      localStorage.setItem("role", userData.role); // Guardamos el rol en localStorage

      window.location.hash = '#/dashboard'; // Redirigimos después del login
    } catch (error) {
      alert("Email o contraseña incorrectos.");
      console.error(error);
    }
  });
}