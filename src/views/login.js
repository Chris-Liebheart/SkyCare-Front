import { loginUser } from '../js/auth';

export function showLogin() {
  const app = document.getElementById('app'); // Get main app container
  
  // Set login form HTML with Tailwind classes
  app.innerHTML = `
    <section class="login min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <!-- Card Container -->
        <div class="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h2 class="text-2xl md:text-3xl font-bold text-white text-center">
              Iniciar Sesión
            </h2>
            <p class="text-blue-100 text-center mt-2 text-sm">
              Accede a tu cuenta
            </p>
          </div>
          
          <!-- Form Container -->
          <div class="px-8 py-8">
            <form id="login-form" class="space-y-6">
              
              <!-- Email Field -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">
                  Email:
                </label>
                <input 
                  type="email" 
                  id="email" 
                  required 
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                  placeholder="tu@email.com"
                />
              </div>
              
              <!-- Password Field -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">
                  Contraseña:
                </label>
                <input 
                  type="password" 
                  id="password" 
                  required 
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
              
              <!-- Submit Button -->
              <button 
                type="submit"
                class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl"
              >
                <span class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  Entrar
                </span>
              </button>
              
            </form>
          </div>
          
          <!-- Footer -->
          <div class="bg-gray-50 px-8 py-6 border-t border-gray-100">
            <p class="text-center text-sm text-gray-600">
              ¿No tienes una cuenta? 
              <a 
                href="#/register" 
                class="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
              >
                Regístrate
              </a>
            </p>
          </div>
          
        </div>
        
        <!-- Additional Info -->
        <div class="text-center mt-6">
          <p class="text-xs text-gray-500">
            Al iniciar sesión, aceptas nuestros términos y condiciones
          </p>
        </div>
        
      </div>
    </section>
  `;

  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Loading state
    submitButton.innerHTML = `
      <span class="flex items-center justify-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Iniciando...
      </span>
    `;
    submitButton.disabled = true;
    submitButton.classList.add('opacity-75', 'cursor-not-allowed');
    
    try {
      const userData = await loginUser(email, password); // Asume que esto devuelve el rol
      localStorage.setItem("role", userData.role); // Guardamos el rol en localStorage
      window.location.hash = '#/dashboard'; // Redirigimos después del login
    } catch (error) {
      // Reset button
      submitButton.innerHTML = `
        <span class="flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"></path>
          </svg>
          Entrar
        </span>
      `;
      submitButton.disabled = false;
      submitButton.classList.remove('opacity-75', 'cursor-not-allowed');
      
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center';
      errorDiv.innerHTML = `
        <div class="flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          Email o contraseña incorrectos
        </div>
      `;
      
      // Remove existing error if any
      const existingError = form.querySelector('.error-message');
      if (existingError) existingError.remove();
      
      errorDiv.classList.add('error-message');
      form.appendChild(errorDiv);
      
      // Remove error after 5 seconds
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.remove();
        }
      }, 5000);
      
      console.error(error);
    }
  });
}