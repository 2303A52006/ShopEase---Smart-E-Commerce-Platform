// ================================
// PRODUCT DATA
// ================================
const products = [
  { 
    id: 1, 
    title: "Wireless Headphones", 
    price: 2999, 
    img: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    desc: "Comfortable premium wireless sound." 
  },

  { 
    id: 2, 
    title: "Smart Watch", 
    price: 4999, 
    img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=888&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    desc: "Track fitness, calls, and more." 
  },

  { 
    id: 3, 
    title: "Leather Jacket", 
    price: 5599, 
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    desc: "Classic premium leather design." 
  },

  { 
    id: 4, 
    title: "Running Shoes", 
    price: 2499, 
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    desc: "Lightweight shoes for daily running." 
  },

  { 
    id: 5, 
    title: "Ceramic Vase", 
    price: 799, 
    img: "https://plus.unsplash.com/premium_photo-1668620538983-c5993e4a443d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    desc: "Decorative modern ceramic vase." 
  },

  { 
    id: 6, 
    title: "Bluetooth Speaker", 
    price: 1999, 
    img: "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    desc: "Portable speaker with deep bass." 
  }
];


// ================================
// DOM ELEMENTS
// ================================
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const searchBar = document.getElementById("searchBar");
const themeToggle = document.getElementById("themeToggle");

let cart = {};


// ================================
// RENDER PRODUCTS
// ================================
function loadProducts(list = products) {
  productGrid.innerHTML = list.map(p => `
    <div class="col-md-3">
      <div class="product-card" onclick="openProduct(${p.id})">
        <img class="product-img" src="${p.img}">
        <h5 class="mt-3 fw-semibold">${p.title}</h5>
        <h6 class="text-primary">₹${p.price}</h6>
      </div>
    </div>
  `).join("");
}

// Load on start
loadProducts();


// ================================
// OPEN PRODUCT MODAL
// ================================
function openProduct(id) {
  const p = products.find(x => x.id === id);

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
  let total = 0;
  let count = 0;

  Object.keys(cart).forEach(id => {
    const product = products.find(p => p.id == id);
    const qty = cart[id];
    const price = product.price * qty;

    total += price;
    count += qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img class="cart-img" src="${product.img}">
        <div class="flex-grow-1">
          <h6 class="fw-semibold">${product.title}</h6>
          <p class="m-0">₹${product.price} × ${qty} = <b>₹${price}</b></p>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${id})">X</button>
      </div>
    `;
  });

  cartTotal.innerText = "₹" + total;
  cartCount.innerText = count;
}


// ================================
// REMOVE ITEM FROM CART
// ================================
function removeItem(id) {
  delete cart[id];
  updateCart();
}


// ================================
// SEARCH BAR
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
// DARK MODE TOGGLE
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // save preference
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️ Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙 Dark Mode";
  }
});

// Apply saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️ Light Mode";
} else {
  themeToggle.textContent = "🌙 Dark Mode";
}

