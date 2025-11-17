// ================================
// PRODUCT DATA
// ================================
const products = [
  { id:1, title:"Wireless Headphones", price:2999, img:"https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949", desc:"Comfortable premium wireless sound." },
  { id:2, title:"Smart Watch", price:4999, img:"https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6", desc:"Track fitness, calls, and more." },
  { id:3, title:"Leather Jacket", price:5599, img:"https://images.unsplash.com/photo-1551028719-00167b16eac5", desc:"Classic premium leather design." },
  { id:4, title:"Running Shoes", price:2499, img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff", desc:"Lightweight shoes for daily running." },
  { id:5, title:"Ceramic Vase", price:799, img:"https://plus.unsplash.com/premium_photo-1668620538983-c5993e4a443d", desc:"Decorative modern ceramic vase." },
  { id:6, title:"Bluetooth Speaker", price:1999, img:"https://images.unsplash.com/photo-1589256469067-ea99122bbdc4", desc:"Portable speaker with deep bass." }
];

const productGrid = document.getElementById("productGrid");
const searchBar = document.getElementById("searchBar");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

let cart = {};

// ================================
// AUTH
// ================================
function openAuth(){
  new bootstrap.Modal(document.getElementById("authModal")).show();
}

function loginUser(){
  const name = authName.value.trim();
  const email = authEmail.value.trim();
  const pass = authPass.value.trim();

  if(!name || !email || !pass){
    showToast("Enter all fields!");
    return;
  }

  localStorage.setItem("loggedIn","true");
  localStorage.setItem("user", JSON.stringify({name,email}));

  showProfileMenu();
  bootstrap.Modal.getInstance(authModal).hide();
  showToast("Logged in!");
}

function showProfileMenu(){
  let user = JSON.parse(localStorage.getItem("user"));
  if(!user) return;

  profileName.textContent = user.name;
  loginBtn.classList.add("d-none");
  profileMenu.classList.remove("d-none");
}

if(localStorage.getItem("loggedIn") === "true") showProfileMenu();

function logout(){
  localStorage.removeItem("loggedIn");
  showToast("Logged out!");
  location.reload();
}

// ================================
// PRODUCTS
// ================================
function loadProducts(list=products){
  productGrid.innerHTML = list.map(p => `
    <div class="col-md-4">
      <div class="glass-card p-3">

        <img src="${p.img}" class="product-img">

        <h5 class="fw-bold mt-3">${p.title}</h5>
        <p class="opacity-75 small">${p.desc}</p>

        <div class="d-flex justify-content-between align-items-center mt-3">
          <span class="text-neon fw-bold">₹${p.price}</span>

          <div>
            <button class="btn btn-outline-neon btn-sm me-2" onclick="openProduct(${p.id})">View</button>
            <button class="btn btn-neon btn-sm" onclick="addToCart(${p.id})">Add</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}
loadProducts();

// ================================
// PRODUCT MODAL
// ================================
function openProduct(id){
  const p = products.find(x => x.id === id);

  document.getElementById("modalImg").src = p.img;
  document.getElementById("modalTitle").innerText = p.title;
  document.getElementById("modalDesc").innerText = p.desc;
  document.getElementById("modalPrice").innerText = "₹" + p.price;

  modalAddBtn.onclick = ()=> addToCart(id);

  new bootstrap.Modal(document.getElementById("productModal")).show();
}

// ================================
// CART
// ================================
function addToCart(id){
  if(localStorage.getItem("loggedIn") !== "true"){
    openAuth();
    return;
  }

  cart[id] = (cart[id] || 0) + 1;
  updateCart();
  showToast("Added to cart!");
}

function removeItem(id){
  delete cart[id];
  updateCart();
}

function updateCart(){
  cartItems.innerHTML = "";
  let total = 0, count = 0;

  Object.keys(cart).forEach(id=>{
    const p = products.find(x=>x.id==id);
    const qty = cart[id];
    const price = qty * p.price;

    total += price;
    count += qty;

    cartItems.innerHTML += `
      <div class="d-flex align-items-center mb-3">
        <img src="${p.img}" class="cart-img me-3">
        <div class="flex-grow-1">
          <h6 class="m-0">${p.title}</h6>
          <small>₹${p.price} × ${qty} = ₹${price}</small>
        </div>
        <button class="btn btn-outline-danger btn-sm" onclick="removeItem(${id})">Remove</button>
      </div>
    `;
  });

  cartTotal.innerText = "₹" + total;
  cartCount.innerText = count;
}

function checkout(){
  if(localStorage.getItem("loggedIn") !== "true"){
    openAuth();
    return;
  }

  let orders = JSON.parse(localStorage.getItem("orders")||"[]");

  Object.keys(cart).forEach(id=>{
    const p = products.find(x=>x.id==id);
    orders.push({
      title:p.title,
      qty:cart[id],
      total:p.price*cart[id],
      date:new Date().toLocaleString()
    });
  });

  localStorage.setItem("orders",JSON.stringify(orders));
  cart = {};
  updateCart();
  showToast("Order placed!");
}

// ================================
// PROFILE / ORDERS
// ================================
function openProfile(){
  const user = JSON.parse(localStorage.getItem("user")||"null");
  document.getElementById("profName").innerText = user.name;
  document.getElementById("profEmail").innerText = user.email;
  new bootstrap.Modal(profileModal).show();
}

function closeProfile(){
  bootstrap.Modal.getInstance(profileModal).hide();
}

function openOrders(){
  const orders = JSON.parse(localStorage.getItem("orders")||"[]");
  const box = document.getElementById("ordersList");

  if(orders.length===0){
    box.innerHTML = `<p class="text-center opacity-75">No orders yet.</p>`;
  } else {
    box.innerHTML = orders.reverse().map(o=>`
      <div class="glass-card p-3 mb-3">
        <strong>${o.title}</strong><br>
        Qty: ${o.qty}<br>
        Total: ₹${o.total}<br>
        <small>${o.date}</small>
      </div>
    `).join("");
  }

  new bootstrap.Modal(ordersModal).show();
}

function closeOrders(){
  bootstrap.Modal.getInstance(ordersModal).hide();
}

// ================================
// SEARCH
// ================================
searchBar.addEventListener("input",()=>{
  const q = searchBar.value.toLowerCase();
  loadProducts(products.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q)
  ));
});

// ================================
// Toast Notification
// ================================
function showToast(msg){
  const t = document.createElement("div");
  t.innerHTML = msg;
  t.style.position = "fixed";
  t.style.bottom = "25px";
  t.style.right = "20px";
  t.style.background = "#00ff86";
  t.style.color = "#002b18";
  t.style.padding = "10px 16px";
  t.style.borderRadius = "10px";
  t.style.fontWeight = "700";
  t.style.boxShadow = "0 5px 25px rgba(0,255,134,0.3)";
  document.body.appendChild(t);

  setTimeout(()=> t.style.opacity="0",1200);
  setTimeout(()=> t.remove(),1800);
}
