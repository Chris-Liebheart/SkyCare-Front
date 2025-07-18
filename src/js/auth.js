const API_URL = "http://localhost:3000/users";

// ESTA PARTE ES DEL REGISTER.JS , It is the register.js file

export async function registerUser(newUser) {
    if (
        !newUser.name || !newUser.identify || !newUser.phone ||
        !newUser.address || !newUser.city || !newUser.email || !newUser.personalcare || !newUser.password
    ) {
        throw new Error("All fields are required.");
    }

    // Verifica si ya existe el correo
    const existingUser = await fetch(`${API_URL}?email=${newUser.email}`);
    const users = await existingUser.json();
    if (users.length > 0) {
        throw new Error("Email is already registered.");
    }

    const userToSave = {
        name: newUser.name,
        identify: newUser.identify,
        phone: newUser.phone,
        address: newUser.address,
        city: newUser.city,
        email: newUser.email,
        password: newUser.password,
        personalcare: newUser.personalcare,
        role: "user"
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userToSave),
    });

    if (!response.ok) throw new Error("Error registering user.");
    return await response.json();
}




// ESTA PARTE ES DEL LOGIN.JS , It is the login.js file

export async function loginUser(email, password) {
    const response = await fetch(`${API_URL}?email=${email}&password=${password}`);
    const users = await response.json();

    if (users.length === 0) {
        throw new Error("Credenciales inválidas");
    }

    const user = users[0];

    // Guardar en localStorage
    localStorage.setItem("user", JSON.stringify(user));

    return user;
}

// Remove user session
export function logoutUser() {
localStorage.removeItem("currentUser");
}

// Get current logged-in user
export function getCurrentUser() {
return JSON.parse(localStorage.getItem("currentUser"));
}

// Check if user is logged in
export function isAuthenticated() {
return !!localStorage.getItem("currentUser");
}

// Check if current user is admin
export function isAdmin() {
const user = getCurrentUser();
return user && user.role === "admin";
}