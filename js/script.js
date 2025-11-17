// ================================
// PRODUCTS
// ================================
const products = [
  { id:1, title:"Wireless Headphones", price:2999, img:"https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=880&auto=format&fit=crop", desc:"Comfortable premium wireless sound." },
  { id:2, title:"Smart Watch", price:4999, img:"https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=888&auto=format&fit=crop", desc:"Track fitness, calls, and more." },
  { id:3, title:"Leather Jacket", price:5599, img:"https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=735&auto=format&fit=crop", desc:"Classic premium leather design." },
  { id:4, title:"Running Shoes", price:2499, img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop", desc:"Lightweight shoes for daily running." },
  { id:5, title:"Ceramic Vase", price:799, img:"https://plus.unsplash.com/premium_photo-1668620538983-c5993e4a443d?q=80&w=687&auto=format&fit=crop", desc:"Decorative modern ceramic vase." },
  { id:6, title:"Bluetooth Speaker", price:1999, img:"https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?q=80&w=1074&auto=format&fit=crop", desc:"Portable speaker with deep bass." }
];

// ================================
// DOM elements
// ================================
const productGrid = document.getElementById("productGrid");
const searchBar = document.getElementById("searchBar");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

let cart = {};

// ================================
// AUTH: open modal & login
// ================================
function openAuth(){
  new bootstrap.Modal(document.getElementById("authModal")).show();
}

function loginUser(){
  const name = document.getElementById("authName").value.trim();
  const email = document.getElementById("authEmail").value.trim();
  const pass = document.getElementById("authPass").value.trim();
  if(!name || !email || !pass){ alert("Fill all fields"); return; }

  localStorage.setItem("user", JSON.stringify({name,email}));
  localStorage.setItem("loggedIn","true");

  // show profile UI
  showProfileMenu();
  alert("Logged in as " + name);
  bootstrap.Modal.getInstance(document.getElementById("authModal")).hide();
}

// logout
function logout(){
  localStorage.removeItem("loggedIn");
  // optionally keep user info but hide profile state
  document.getElementById("profileName").innerText = "";
  document.getElementById("profileMenu").classList.add("d-none");
  document.getElementById("loginBtn").classList.remove("d-none");
  alert("Logged out");
  // clear cart for demo (optional)
  cart = {}; updateCart();
}

// show profile menu after login
function showProfileMenu(){
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if(!user) return;
  document.getElementById("profileName").innerText = user.name;
  document.getElementById("loginBtn").classList.add("d-none");
  document.getElementById("profileMenu").classList.remove("d-none");
}

// if already logged in on load
if(localStorage.getItem("loggedIn")==="true"){ showProfileMenu(); }

// ================================
// LOAD products
// ================================
function loadProducts(list = products){
  productGrid.innerHTML = list.map(p => `
    <div class="col-md-4">
      <div class="glass-card p-3 product-card">
        <img src="${p.img}" class="product-img" alt="${p.title}">
        <h5 class="fw-bold mt-3">${p.title}</h5>
        <p class="opacity-75 small">${p.desc}</p>

        <div class="d-flex justify-content-between align-items-center mt-3">
          <span class="text-neon fw-bold">₹${p.price}</span>
          <div>
            <button class="btn btn-outline-neon btn-sm me-2" onclick="event.stopPropagation(); openProduct(${p.id})">View</button>
            <button class="btn btn-neon btn-sm" onclick="event.stopPropagation(); addToCart(${p.id})">Add</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}
loadProducts();

// view product (requires login)
function openProduct(id){
  if(!requireLogin()) return;
  const p = products.find(x=>x.id===id);
  alert(`${p.title}\n\nPrice: ₹${p.price}\n\n${p.desc}`);
}

// ================================
// requireLogin wrapper
// ================================
function requireLogin(){
  if(localStorage.getItem("loggedIn")==="true") return true;
  openAuth();
  return false;
}

// ================================
// CART functions
// ================================
function addToCart(id){
  if(!requireLogin()) return;
  if(cart[id]) cart[id] += 1; else cart[id] = 1;
  updateCart();
  showToast("Added to cart");
}

function removeItem(id){
  delete cart[id];
  updateCart();
}

function updateCart(){
  cartItems.innerHTML = "";
  let total = 0, count = 0;
  Object.keys(cart).forEach(id => {
    const p = products.find(x => x.id == id);
    const qty = cart[id];
    const price = p.price * qty;
    total += price; count += qty;
    cartItems.innerHTML += `
      <div class="d-flex align-items-center mb-3">
        <img src="${p.img}" class="cart-img me-3">
        <div class="flex-grow-1">
          <h6 class="m-0">${p.title}</h6>
          <small class="opacity-75">₹${p.price} × ${qty} = ₹${price}</small>
        </div>
        <button class="btn btn-outline-danger btn-sm" onclick="removeItem(${id})">Remove</button>
      </div>
    `;
  });
  cartTotal.innerText = "₹" + total;
  cartCount.innerText = count;
}

// checkout -> save orders
function checkout(){
  if(!requireLogin()) return;
  let orders = JSON.parse(localStorage.getItem("orders") || "[]");
  // convert cart items to orders
  Object.keys(cart).forEach(id => {
    const p = products.find(x => x.id == id);
    orders.push({ title: p.title, qty: cart[id], total: p.price * cart[id], date: new Date().toLocaleString() });
  });
  localStorage.setItem("orders", JSON.stringify(orders));
  cart = {}; updateCart();
  showToast("Order placed");
}

// ================================
// PROFILE & ORDERS modals
// ================================
function openProfile(){
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if(!user){ openAuth(); return; }
  document.getElementById("profName").innerText = user.name;
  document.getElementById("profEmail").innerText = user.email;
  new bootstrap.Modal(document.getElementById("profileModal")).show();
}
function closeProfile(){
  bootstrap.Modal.getInstance(document.getElementById("profileModal")).hide();
}

function openOrders(){
  if(!requireLogin()) return;
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const box = document.getElementById("ordersList");
  if(orders.length === 0){
    box.innerHTML = `<p class="text-center opacity-75">⚠️ No orders found. Start shopping and place your first order!</p>`;
  } else {
    box.innerHTML = orders.reverse().map(o => `
      <div class="glass-card p-3 mb-3">
        <div class="d-flex justify-content-between">
          <div>
            <strong>${o.title}</strong><br/>
            <small class="opacity-75">Qty: ${o.qty} • ${o.date}</small>
          </div>
          <div class="text-neon fw-bold">₹${o.total}</div>
        </div>
      </div>
    `).join("");
  }
  new bootstrap.Modal(document.getElementById("ordersModal")).show();
}
function closeOrders(){
  bootstrap.Modal.getInstance(document.getElementById("ordersModal")).hide();
}

// ================================
// SEARCH
// ================================
searchBar.addEventListener("input", () => {
  const q = searchBar.value.toLowerCase();
  const filtered = products.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  loadProducts(filtered);
});

// ================================
// SMALL TOAST (visual feedback)
// ================================
function showToast(msg){
  // simple ephemeral toast using alert replacement
  const el = document.createElement("div");
  el.innerText = msg;
  el.style.position = "fixed";
  el.style.right = "20px";
  el.style.bottom = "30px";
  el.style.padding = "10px 16px";
  el.style.borderRadius = "10px";
  el.style.background = "linear-gradient(90deg,#00ff86,#00ffa8)";
  el.style.color = "#002b18";
  el.style.fontWeight = "700";
  el.style.boxShadow = "0 10px 30px rgba(0,255,134,0.12)";
  document.body.appendChild(el);
  setTimeout(()=> el.style.opacity = "0", 1800);
  setTimeout(()=> el.remove(), 2400);
}
