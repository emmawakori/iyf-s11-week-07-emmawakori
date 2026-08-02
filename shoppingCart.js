// Hardcoded product list
const products = [
  { id: 1, name: "Laptop", price: 1200, image: "https://via.placeholder.com/100?text=Laptop" },
  { id: 2, name: "Headphones", price: 150, image: "https://via.placeholder.com/100?text=Headphones" },
  { id: 3, name: "Smartphone", price: 800, image: "https://via.placeholder.com/100?text=Phone" }
];

// Load cart from localStorage or start empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add product to cart
function addToCart(productId) {
  const item = cart.find(p => p.id === productId);
  if (item) {
    item.quantity++;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  renderCart();
}

// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(p => p.id !== productId);
  saveCart();
  renderCart();
}

// Update quantity
function updateQuantity(productId, quantity) {
  const item = cart.find(p => p.id === productId);
  if (item) {
    item.quantity = parseInt(quantity, 10);
    if (item.quantity <= 0) removeFromCart(productId);
  }
  saveCart();
  renderCart();
}

// Clear cart
function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

// Render product list
function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = products.map(p => `
    <div>
      <img src="${p.image}" width="100"/>
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join("");
}

// Render cart
function renderCart() {
  const cartDiv = document.getElementById("cart");
  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const itemCount = cart.reduce((sum, p) => sum + p.quantity, 0);

  cartDiv.innerHTML = `
    <h3>Cart (${itemCount} items)</h3>
    ${cart.map(p => `
      <div>
        <strong>${p.name}</strong> - $${p.price} x ${p.quantity}
        <input type="number" value="${p.quantity}" min="1"
          onchange="updateQuantity(${p.id}, this.value)">
        <button onclick="removeFromCart(${p.id})">Remove</button>
      </div>
    `).join("")}
    <h3>Total: $${total.toFixed(2)}</h3>
    <button onclick="clearCart()">Clear Cart</button>
  `;
}

// Initialize
renderProducts();
renderCart();
