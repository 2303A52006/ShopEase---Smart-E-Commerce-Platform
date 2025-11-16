// ================================
// PRODUCT DATA (with your images)
// ================================
const products = [
  { id: 1, title: "Wireless Headphones", price: 2999, img: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=880&auto=format&fit=crop", desc: "Comfortable premium wireless sound." },
  { id: 2, title: "Smart Watch", price: 4999, img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=888&auto=format&fit=crop", desc: "Track fitness, calls, and more." },
  { id: 3, title: "Leather Jacket", price: 5599, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=735&auto=format&fit=crop", desc: "Classic premium leather design." },
  { id: 4, title: "Running Shoes", price: 2499, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop", desc: "Lightweight shoes for daily running." },
  { id: 5, title: "Ceramic Vase", price: 799, img: "https://plus.unsplash.com/premium_photo-1668620538983-c5993e4a443d?q=80&w=687&auto=format&fit=crop", desc: "Decorative modern ceramic vase." },
  { id: 6, title: "Bluetooth Speaker", price: 1999, img: "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?q=80&w=1074&auto=format&fit=crop", desc: "Portable speaker with deep bass." }
];


// ================================
// ELEMENTS
// ================================
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const searchBar = document.getElementById("searchBar");
const themeToggle = document.getElementById("themeToggle");

let cart = {};


// ================================
// LOAD PRODUCTS
// ================================
function loadProducts(list = products) {
  productGrid.innerHTML = list.map(p => `
    <div class="col-md-4 product-col">
      <div class="product-card" onclick="openProduct(${p.id})">
        <img src="${p.img}" class="product-img">
        <h5 class="product-title">${p.title}</h5>

        <div class="d-flex justify-content-between align-items-center mt-auto">
          <span class="neon-tag">NEW</span>
          <span class="product-price">₹${p.price}</span>
        </div>
      </div>
    </div>
  `).join("");
}

loadProducts();


// ================================
// OPEN PRODUCT MODAL
// ================================
function openProduct(id) {
  const p = products.find(item => item.id === id);

  document.getElementById("modalImage").src = p.img;
  document.getElementById("modalTitle").innerText = p.title;
  document.getElementById("modalPrice").innerText = "₹" + p.price;
  document.getElementById("modalDesc").innerText = p.desc;
  document.getElementById("modalQty").value = 1;

  document.getElementById("modalAddBtn").onclick = () => addToCart(id);

  new bootstrap.Modal(document.getElementById("productModal")).show();
}


// ================================
// ADD TO CART
// ================================
function addToCart(id) {
  let qty = Number(document.getElementById("modalQty").value);

  if (cart[id]) cart[id] += qty;
  else cart[id] = qty;

  updateCart();
}


// ================================
// UPDATE CART UI
// ================================
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0, count = 0;

  Object.keys(cart).forEach(id => {
    const product = products.find(p => p.id == id);
    const qty = cart[id];
    const price = product.price * qty;

    total += price;
    count += qty;

    cartItems.innerHTML += `
      <div class="cart-item d-flex align-items-center mb-3">
        <img src="${product.img}" class="cart-img" style="width:60px; height:60px; border-radius:10px; margin-right:12px;">
        <div class="flex-grow-1">
          <h6 class="m-0">${product.title}</h6>
          <small>₹${product.price} × ${qty} = ₹${price}</small>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${id})">Remove</button>
      </div>
    `;
  });

  cartTotal.innerText = "₹" + total;
  cartCount.innerText = count;
}


// ================================
// REMOVE ITEM
// ================================
function removeItem(id) {
  delete cart[id];
  updateCart();
}


// ================================
// SEARCH
// ================================
searchBar.addEventListener("input", function () {
  const text = this.value.toLowerCase();

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(text) ||
    p.desc.toLowerCase().includes(text)
  );

  loadProducts(filtered);
});


// ================================
// THEME TOGGLE
// ================================
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("alt-theme");

  if (document.body.classList.contains("alt-theme")) {
    localStorage.setItem("theme", "neon");
    themeToggle.textContent = "☀️ Light";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🟢 Neon";
  }
});

// Apply saved theme on load
if (localStorage.getItem("theme") === "neon") {
  document.body.classList.add("alt-theme");
  themeToggle.textContent = "☀️ Light";
}
