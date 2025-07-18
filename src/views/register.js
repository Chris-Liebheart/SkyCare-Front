import { registerUser } from '../js/auth.js'; // Importa función de registro

export function showRegister() {
  const app = document.getElementById('app'); // Contenedor principal

  // Formulario de registro en HTML
  app.innerHTML = `
    <section class="register">
      <h2>Registro de Usuario</h2>
      <form id="register-form">
        <input type="text" id="name" placeholder="Nombre completo" required />
        <input type="text" id="identify" placeholder="Número de identidad" required />
        <input type="text" id="reg-phone" placeholder="Teléfono" required />
        <input type="text" id="address" placeholder="Dirección" required />
        <input type="text" id="city" placeholder="Ciudad" required />
        <input type="email" id="email" placeholder="Correo electrónico" required />
        <input type="password" id="password" placeholder="Contraseña" required />
        <label for="personalcare">¿Hay algo que debamos tener en cuenta sobre tu salud o tu piel?</label>
        <input type="text" id="personalcare" placeholder="Ej: Tengo piel sensible, alergia al frío..." required />
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes una cuenta? <a href="#/login">Inicia sesión</a></p>
    </section>
  `;

  const form = document.getElementById('register-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita recarga de la página

    // Obtiene los valores de los campos y los limpia
    const name = document.getElementById('name').value.trim();
    const identify = document.getElementById('identify').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const personalcare = document.getElementById('personalcare').value.trim();

    // Crea el objeto del nuevo usuario
    const newUser = {
      name,
      identify,
      phone,
      address,
      city,
      email,
      password,
      personalcare,
      role: "user"
    };

    try {
      await registerUser(newUser); // Llama a la función que registra el usuario en la API
      alert("Registro exitoso. Inicia sesión.");
      window.location.hash = '#/dashboard';
    } catch (error) {
      alert(error.message || "Error al registrarse.");
      console.error(error);
    }
  });
}
