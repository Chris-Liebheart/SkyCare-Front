import { getWeatherInfo } from '../js/weatherService.js';
import { getUserLocation } from '../js/locationService.js'; // ✅ Asegúrate de importar correctamente

export function showDashboardCustomer() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="dashboard-customer">
      <div class="dashboard-header">
        <h2>🌦️ Tu Clima Actual y Cuidados</h2>
        <div class="dashboard-buttons">
          <button id="logoutBtn">Cerrar sesión</button>
          <button id="backBtn">Volver al inicio</button>
        </div>
      </div>
      
      <!-- Clima actual por geolocalización -->
      <div id="weatherResult"><p>Buscando ubicación y clima...</p></div>
      <div id="recommendationsResult"></div>

      <hr />
      
      <!-- Búsqueda manual -->
      <div class="manual-search">
        <h3>🔎 Buscar clima en otra ciudad</h3>
        <input type="text" id="cityInput" placeholder="Escribe una ciudad" />
        <button id="searchCityBtn">Buscar</button>
        <div id="manualResults"></div>
      </div>
    </section>
  `;

  initializeDashboard();
}

function initializeDashboard() {
  // Verificar rol de usuario
  const role = localStorage.getItem('role');
  if (role !== 'user') {
    document.getElementById('weatherResult').innerHTML = `
      <p>⚠️ Esta vista es solo para usuarios.</p>
    `;
    return;
  }

  // Inicializar funcionalidades
  obtenerUbicacionYClima();
  setupEvents();
  cargarBusquedasGuardadas();
}

function setupEvents() {
  // Botones de navegación
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.hash = '#/login';
  });

  document.getElementById('backBtn').addEventListener('click', () => {
    window.location.hash = '#/';
  });

  // Búsqueda manual
  const cityInput = document.getElementById('cityInput');
  const searchBtn = document.getElementById('searchCityBtn');

  async function buscarClima() {
    const ciudad = cityInput.value.trim();
    if (!ciudad) return alert('⚠️ Escribe una ciudad.');

    const weather = await getWeatherInfo(ciudad);

    if (!weather) {
      alert('❌ No se pudo obtener el clima de esa ciudad.');
      return;
    }

    guardarBusquedaManual(ciudad);
    renderBusquedaManual(ciudad, weather);
    cityInput.value = ''; // Limpiar input
  }

  searchBtn.addEventListener('click', buscarClima);
  cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') buscarClima();
  });
}

// === GEOLOCALIZACIÓN Y CLIMA AUTOMÁTICO ===

async function obtenerUbicacionYClima() {
  const weatherDiv = document.getElementById('weatherResult');
  const recDiv = document.getElementById('recommendationsResult');

  try {
    weatherDiv.innerHTML = `<p>Buscando ubicación por IP...</p>`;

    const { lat, lon, city } = await getUserLocation();
    const weather = await getWeatherInfo({ lat, lon });

    if (weather) {
      weather.nombreCiudad = city; // Reemplazar si viene distinto de OpenWeather
      renderWeather(weather);
      renderRecommendations(weather);
    } else {
      weatherDiv.innerHTML = `<p>⚠️ No se pudo obtener el clima de tu ubicación.</p>`;
      recDiv.innerHTML = '';
    }
  } catch (err) {
    console.error('Error de geolocalización IP:', err);
    weatherDiv.innerHTML = `<p>⚠️ No se pudo obtener tu ubicación automáticamente.</p>`;
    recDiv.innerHTML = '';
  }
}

function renderWeather(data) {
  const weatherHTML = `
    <div class="weather-card">
      <h3>📍 ${data.nombreCiudad || 'Tu ubicación'}${data.pais ? `, ${data.pais}` : ''}</h3>
      <div class="weather-main">
        <span class="temp">${data.temperatura}°C</span>
        <span class="feels">Sensación: ${data.sensacionTermica}°C</span>
      </div>
      <p><strong>Condición:</strong> ${data.pronostico}</p>
      <p><strong>Humedad:</strong> ${data.humedad}%</p>
      <p><strong>Viento:</strong> ${data.viento} m/s</p>
      ${data.uv ? `<p><strong>Índice UV:</strong> ${data.uv}</p>` : ''}
      ${data.coordenadas ? `<small>Coordenadas: ${data.coordenadas}</small><br>` : ''}
      <small>Actualizado: ${new Date().toLocaleTimeString()}</small>
    </div>
  `;
  
  document.getElementById('weatherResult').innerHTML = weatherHTML;
}

function renderRecommendations(weather) {
  const recomendaciones = generateRecommendations(weather);
  const html = `
    <h3>💡 Recomendaciones de cuidado</h3>
    <div class="recommendations-container">
      ${recomendaciones.map(r => `<div class="rec-item">${r}</div>`).join('')}
    </div>
  `;
  document.getElementById('recommendationsResult').innerHTML = html;
}

function generateRecommendations({ temperatura, pronostico, humedad }) {
  const recs = [];

  // Recomendaciones según temperatura
  if (temperatura <= 0) {
    recs.push('❄️ Hace mucho frío. Usa ropa térmica y abrigo.');
    recs.push('🧤 No olvides guantes, gorro y bufanda.');
  } else if (temperatura > 0 && temperatura < 10) {
    recs.push('🧥 Abrígate bien, hace bastante frío.');
    recs.push('☕ Una bebida caliente puede ayudarte a entrar en calor.');
  } else if (temperatura >= 10 && temperatura < 20) {
    recs.push('🧣 El clima es fresco. Usa una chaqueta ligera.');
  } else if (temperatura >= 20 && temperatura <= 25) {
    recs.push('🌤️ Temperatura agradable. Ropa cómoda es suficiente.');
  } else if (temperatura > 25 && temperatura <= 30) {
    recs.push('😎 Hace calor. Usa ropa ligera y mantente hidratado.');
  } else if (temperatura > 30 && temperatura <= 35) {
    recs.push('🧴 Usa protector solar e hidrátate con frecuencia.');
    recs.push('🌞 Evita exposición directa al sol entre las 11am y 3pm.');
  } else if (temperatura > 35) {
    recs.push('🔥 Temperaturas extremas. Permanece en lugares frescos o con sombra.');
    recs.push('🥵 Evita actividades físicas intensas al aire libre.');
  }

  // Recomendaciones según pronóstico
  if (pronostico.toLowerCase().includes('lluvia')) {
    recs.push('☔ Lleva paraguas o impermeable.');
    recs.push('👢 Usa calzado impermeable para evitar resfriados.');
  }
  if (pronostico.toLowerCase().includes('tormenta')) {
    recs.push('⚠️ Tormenta esperada. Evita estar bajo árboles o estructuras metálicas.');
  }
  if (pronostico.toLowerCase().includes('nieve')) {
    recs.push('🌨️ Nieve en camino. Maneja con precaución y mantente abrigado.');
  }
  if (pronostico.toLowerCase().includes('viento')) {
    recs.push('🌬️ Hay mucho viento. Asegura objetos sueltos y abrígate bien.');
  }

  // Recomendaciones según humedad
  if (humedad > 80) {
    recs.push('💧 Alta humedad. Usa ropa transpirable y cuida tu piel.');
  } else if (humedad < 30) {
    recs.push('🌵 El aire está seco. Usa crema hidratante y bebe agua.');
  }

  if (recs.length === 0) {
    recs.push('✅ El clima es favorable, ¡disfruta tu día!');
  }

  return recs;
}

// === BÚSQUEDAS MANUALES ===

function guardarBusquedaManual(ciudad) {
  let ciudades = JSON.parse(localStorage.getItem('busquedasManual')) || [];
  if (!ciudades.includes(ciudad)) {
    ciudades.push(ciudad);
    localStorage.setItem('busquedasManual', JSON.stringify(ciudades));
  }
}

function cargarBusquedasGuardadas() {
  const ciudades = JSON.parse(localStorage.getItem('busquedasManual')) || [];
  ciudades.forEach(async (ciudad) => {
    const weather = await getWeatherInfo(ciudad);
    if (weather) {
      renderBusquedaManual(ciudad, weather);
    }
  });
}

function renderBusquedaManual(ciudad, weather) {
  const contenedor = document.getElementById('manualResults');
  const recomendaciones = generateRecommendations(weather);
  const id = `card-${ciudad.replace(/\s/g, '')}`;

  // Remover card existente si ya existe
  const existingCard = document.getElementById(id);
  if (existingCard) existingCard.remove();

  const card = document.createElement('div');
  card.id = id;
  card.className = 'manual-weather-card';
  card.innerHTML = `
    <div class="card-header">
      <h4>📍 ${ciudad}</h4>
      <button onclick="eliminarBusquedaManual('${ciudad}')" class="delete-btn">❌</button>
    </div>
    <div class="card-content">
      <div class="weather-main">
        <span class="temp">${weather.temperatura}°C</span>
        <span class="feels">Sensación: ${weather.sensacionTermica}°C</span>
      </div>
      <p><strong>Condición:</strong> ${weather.pronostico}</p>
      <p><strong>Humedad:</strong> ${weather.humedad}%</p>
      <p><strong>Viento:</strong> ${weather.viento} m/s</p>
      ${weather.uv ? `<p><strong>Índice UV:</strong> ${weather.uv}</p>` : ''}
      <div class="recommendations">
        <strong>Recomendaciones:</strong>
        ${recomendaciones.map(r => `<div class="rec-item">${r}</div>`).join('')}
      </div>
      <small>Actualizado: ${new Date().toLocaleTimeString()}</small>
    </div>
  `;

  contenedor.appendChild(card);
}

// Función global para eliminar búsquedas
window.eliminarBusquedaManual = function(ciudad) {
  const card = document.getElementById(`card-${ciudad.replace(/\s/g, '')}`);
  if (card) card.remove();

  let ciudades = JSON.parse(localStorage.getItem('busquedasManual')) || [];
  ciudades = ciudades.filter(c => c !== ciudad);
  localStorage.setItem('busquedasManual', JSON.stringify(ciudades));
}