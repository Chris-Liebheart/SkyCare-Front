// src/services/locationService.js
export async function getUserLocation() {
  const response = await fetch('https://ipapi.co/json/');
  if (!response.ok) throw new Error('Error al obtener la ubicación por IP');

  const data = await response.json();
  return {
    city: data.city,
    lat: data.latitude,
    lon: data.longitude
  };
}