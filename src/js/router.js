// Importa todas las vistas necesarias
import { showLanding } from '../views/landing.js'; 
import { showRegister } from '../views/register.js';
import { showLogin } from '../views/login.js';
import { showNotFound } from '../views/404.js'; // Asegúrate de tener este archivo
import { showDashboardCustomer } from '../views/dashboardCustomer.js'; // dashboard de cliente
// Definimos las rutas disponibles
const routes = {
  '#/': showLanding,
  '#/register': showRegister,
  '#/login': showLogin,
  '#/not-found': showNotFound,
  '#/dashboard': showDashboardCustomer,  
};


// Función para gestionar las rutas basadas en el hash
function router() {
  let hash = window.location.hash;

  // Si no hay hash en la URL, redirige por defecto al login
  if (!hash || hash === '#') {
  window.location.hash = '#/';
  return;
  }


  const baseRoute = hash.split('?')[0]; // Remueve parámetros (si los hay)

  if (routes[baseRoute]) {
    routes[baseRoute](); // Ejecuta la vista correspondiente
  } else {
    window.location.hash = '#/not-found'; // Página no encontrada
  }
}

// Ejecutar el router al cargar la página y cuando cambie el hash
window.addEventListener('load', router);
window.addEventListener('hashchange', router);
