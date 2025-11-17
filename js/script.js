// ================================
// PRODUCT DATA
// ================================
const products = [
  { id: 1, title: "Wireless Headphones", price: 2999, img: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949", desc: "Premium wireless sound" },
  { id: 2, title: "Smart Watch", price: 4999, img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6", desc: "Track your fitness & calls" },
  { id: 3, title: "Leather Jacket", price: 5599, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5", desc: "Premium classic leather" },
  { id: 4, title: "Running Shoes", price: 2499, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", desc: "Soft running shoes" },
  { id: 5, title: "Ceramic Vase", price: 799, img: "https://plus.unsplash.com/premium_photo-1668620538983-c5993e4a443d", desc: "Decorative ceramic design" },
  { id: 6, title: "Bluetooth Speaker", price: 1999, img: "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4", desc: "Portable bass speaker" }
];


// ================================
// AUTH FUNCTIONS
// ================================
function openAuth() {
  new bootstrap.Modal(document.getElementById("authModal")).show();
}

function loginUser() {
  const name = authName.value;
  const email = authEmail.value;
  const pass = authPass.value;

  if (!name || !email || !pass) {
    alert("Fill all fields.");
    return;
  }

  localStorage.setItem("user", JSON.stringify({name, email, pass}));
  localStorage.setItem("loggedIn", "true");

  alert("Login Successful");
  location.reload();
}

function logout() {
  localStorage.removeItem("loggedIn");
  alert("Logged out!");
  location.reload();
}


// SHOW PROFILE MENU IF LOGGED IN
if (localStorage.getItem("loggedIn") === "true") {
  const user = JSON.parse(localStorage.getItem("user"));
  profileName.innerText = user.name;
  loginBtn.classList.add("d-none");
  profileMenu.classList.remove("d-none");
}


// ================================
// LOAD PRODUCTS
// ================================
const productGrid = document.getElementById("productGrid");

function loadProducts() {
  productGrid.innerHTML = products.map(p => `
    <div class="col-md-4">
      <div class="glass-card p-3">
        <img src="${p.img}" class="product-img">
        <h5 class="fw-bold mt-3">${p.title}</h5>
        <div class="d-flex justify-content-between align-items-center">
          <span class="text-neon fw-bold">₹${p.price}</span>
          <button class="btn btn-neon btn-sm" onclick="addToCart(${p.id})">Add</button>
        </div>
      </div>
    </div>
  `).join("");
}

loadProducts();


// ================================
// CART SYSTEM
// ================================
let cart = {};
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

function requireLogin() {
  if (localStorage.getItem("loggedIn") === "true") return true;
  openAuth();
  return false;
}

function addToCart(id) {
  if (!requireLogin()) return;

  if (cart[id]) cart[id]++;
  else cart[id] = 1;

  updateCart();
}

function removeItem(id) {
  delete cart[id];
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0, count = 0;

  for (let id in cart) {
    const p = products.find(x => x.id == id);
    const qty = cart[id];
    const price = p.price * qty;

    total += price;
    count += qty;

    cartItems.innerHTML += `
      <div class="d-flex align-items-center mb-3">
        <img src="${p.img}" class="cart-img me-3" style="width:60px; border-radius:10px;">
        <div class="flex-grow-1">
          <h6>${p.title}</h6>
          <small>₹${p.price} × ${qty} = ₹${price}</small>
        </div>
        <button class="btn btn-outline-danger btn-sm" onclick="removeItem(${id})">X</button>
      </div>
    `;
  }

  cartTotal.innerText = "₹" + total;
  cartCount.innerText = count;
}


// ================================
// SEARCH BAR
// ================================
searchBar.addEventListener("input", () => {
  const q = searchBar.value.toLowerCase();
  const filtered = products.filter(
    p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
  );
  productGrid.innerHTML = filtered.map(p => `
    <div class="col-md-4">
      <div class="glass-card p-3">
        <img src="${p.img}" class="product-img">
        <h5 class="fw-bold mt-3">${p.title}</h5>
        <div class="d-flex justify-content-between align-items-center">
          <span class="text-neon fw-bold">₹${p.price}</span>
          <button class="btn btn-neon btn-sm" onclick="addToCart(${p.id})">Add</button>
        </div>
      </div>
    </div>
  `).join("");
});
