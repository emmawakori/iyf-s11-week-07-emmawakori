// BAD
const d = new Date();
const x = users.filter(u => u.a > 18);
function calc(a, b) { return a * b * 0.1; }

// GOOD
const currentDate = new Date();
const adultUsers = users.filter(user => user.age > 18);
function calculateDiscount(price, quantity) {
    const DISCOUNT_RATE = 0.1;
    return price * quantity * DISCOUNT_RATE;
}

// BAD - does too many things
function processUser(userData) {
    // Validate
    if (!userData.email.includes("@")) throw new Error("Invalid email");
    if (userData.age < 18) throw new Error("Must be adult");
    
    // Transform
    userData.email = userData.email.toLowerCase();
    userData.name = userData.name.trim();
    
    // Save to database
    database.save(userData);
    
    // Send email
    emailService.send(userData.email, "Welcome!");
    
    // Update UI
    document.getElementById("status").textContent = "User created!";
}

// GOOD - separate concerns
function validateUser(userData) {
    if (!userData.email.includes("@")) throw new Error("Invalid email");
    if (userData.age < 18) throw new Error("Must be adult");
    return true;
}

function normalizeUser(userData) {
    return {
        ...userData,
        email: userData.email.toLowerCase(),
        name: userData.name.trim()
    };
}

async function createUser(userData) {
    validateUser(userData);
    const normalizedUser = normalizeUser(userData);
    await database.save(normalizedUser);
    await emailService.sendWelcome(normalizedUser.email);
    return normalizedUser;
}

// UI handling separate
async function handleCreateUser(event) {
    event.preventDefault();
    try {
        const userData = getFormData();
        await createUser(userData);
        showSuccess("User created!");
    } catch (error) {
        showError(error.message);
    }
}

// BAD
if (password.length < 8) { }
setTimeout(callback, 86400000);
if (response.status === 404) { }

// GOOD
const MIN_PASSWORD_LENGTH = 8;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const HTTP_NOT_FOUND = 404;

if (password.length < MIN_PASSWORD_LENGTH) { }
setTimeout(callback, ONE_DAY_MS);
if (response.status === HTTP_NOT_FOUND) { }