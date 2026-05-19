// ===== PRODUCT DATA =====
const products = [
  { id: 0, name: "Nike Air Force 1", price: 8000, category: "Men", brand: "Nike", badge: "Bestseller", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" },
  { id: 1, name: "Adidas Ultraboost 23", price: 12000, category: "Sports", brand: "Adidas", badge: "New", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600" },
  { id: 2, name: "Puma RS-X", price: 5000, category: "Men", brand: "Puma", badge: "", img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600" },
  { id: 3, name: "Converse Chuck 70", price: 4500, category: "Women", brand: "Converse", badge: "", img: "https://images.unsplash.com/photo-1695551853941-cc7ceef49be1?w=600" },
  { id: 4, name: "Nike Air Max 270", price: 9000, category: "Sports", brand: "Nike", badge: "Hot", img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600" },
  { id: 5, name: "Adidas Superstar", price: 7000, category: "Women", brand: "Adidas", badge: "", img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600" },
  { id: 6, name: "Reebok Classic", price: 6000, category: "Men", brand: "Reebok", badge: "", img: "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600" },
  { id: 7, name: "Vans Old Skool", price: 5500, category: "Casual", brand: "Vans", badge: "", img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600" },
  { id: 8, name: "New Balance 574", price: 7500, category: "Casual", brand: "New Balance", badge: "New", img: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600" },
  { id: 9, name: "Jordan 1 Retro High", price: 15000, category: "Men", brand: "Nike", badge: "Limited", img: "https://images.unsplash.com/photo-1556906781-9a412961d391?w=600" },
];
 
// ===== CART MANAGEMENT =====
let cart = JSON.parse(localStorage.getItem("sneakerhub_cart")) || [];
 
function saveCart() {
  localStorage.setItem("sneakerhub_cart", JSON.stringify(cart));
  updateCartBadge();
}
 
function updateCartBadge() {
  const badges = document.querySelectorAll(".cart-count");
  const total = cart.reduce((s, i) => s + i.qty, 0);
  badges.forEach(b => { b.textContent = total; b.style.display = total ? "flex" : "none"; });
}
 
// ===== TOAST =====
function showToast(msg, type = "success") {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.innerHTML = (type === "success" ? "✓ " : "✕ ") + msg;
  t.style.background = type === "success" ? "var(--success)" : "var(--accent)";
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2800);
}
 
// ===== ADD TO CART =====
function addToCart(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...prod, qty: 1 });
  }
  saveCart();
  showToast(prod.name + " added to cart!");
}
 
// ===== RENDER PRODUCT CARD =====
function renderCard(prod, delay = 0) {
  return `
    <div class="product-card" style="animation-delay:${delay}ms">
      <div class="pc-img-wrap">
        <img src="${prod.img}" alt="${prod.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'">
        ${prod.badge ? `<span class="pc-badge">${prod.badge}</span>` : ""}
        <div class="pc-wishlist" title="Wishlist">♡</div>
      </div>
      <div class="pc-body">
        <div class="pc-brand">${prod.brand}</div>
        <div class="pc-name">${prod.name}</div>
        <div class="pc-cat">${prod.category}</div>
        <div class="pc-footer">
          <div class="pc-price">₹${prod.price.toLocaleString("en-IN")}</div>
          <button class="pc-add-btn" onclick="addToCart(${prod.id})" title="Add to Cart">+</button>
        </div>
      </div>
    </div>
  `;
}
 
// ===== SHOW PRODUCTS =====
let currentFilter = { cat: "All", brand: "All", sort: "default", search: "" };
 
function showProducts(list) {
  const el = document.getElementById("products");
  if (!el) return;
  if (!list.length) {
    el.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--gray)"><div style="font-size:48px;margin-bottom:16px">🔍</div><p style="font-size:18px">No sneakers found.</p></div>`;
    return;
  }
  el.innerHTML = list.map((p, i) => renderCard(p, i * 60)).join("");
}
 
function applyFilters() {
  let list = [...products];
  if (currentFilter.cat !== "All") list = list.filter(p => p.category === currentFilter.cat);
  if (currentFilter.brand !== "All") list = list.filter(p => p.brand === currentFilter.brand);
  if (currentFilter.search) {
    const q = currentFilter.search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }
  if (currentFilter.sort === "asc") list.sort((a, b) => a.price - b.price);
  if (currentFilter.sort === "desc") list.sort((a, b) => b.price - a.price);
  showProducts(list);
}
 
// ===== FILTER CONTROLS =====
function filterCategory(cat) {
  currentFilter.cat = cat;
  document.querySelectorAll(".filter-btn[data-cat]").forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
  applyFilters();
}
 
function filterBrand(brand) {
  currentFilter.brand = brand;
  document.querySelectorAll(".filter-btn[data-brand]").forEach(b => b.classList.toggle("active", b.dataset.brand === brand));
  applyFilters();
}
 
function sortProducts(val) {
  currentFilter.sort = val;
  applyFilters();
}
 
// ===== SEARCH =====
function initSearch() {
  const input = document.getElementById("searchInput");
  const dropdown = document.getElementById("searchDropdown");
  if (!input || !dropdown) return;
 
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { dropdown.classList.remove("open"); return; }
    const results = products.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    ).slice(0, 5);
 
    if (!results.length) {
      dropdown.innerHTML = `<div class="search-no-result">No results for "<strong>${input.value}</strong>"</div>`;
    } else {
      dropdown.innerHTML = results.map(p => `
        <div class="search-result-item" onclick="goToProduct(${p.id})">
          <img src="${p.img}" alt="${p.name}" onerror="this.style.display='none'">
          <div>
            <div class="sri-name">${p.name}</div>
            <div class="sri-price">₹${p.price.toLocaleString("en-IN")}</div>
          </div>
        </div>
      `).join("");
    }
    dropdown.classList.add("open");
  });
 
  document.addEventListener("click", e => {
    if (!e.target.closest(".search-bar-wrapper")) dropdown.classList.remove("open");
  });
 
  // Also filter products page inline
  if (document.getElementById("products")) {
    input.addEventListener("input", () => {
      currentFilter.search = input.value.trim();
      applyFilters();
    });
  }
}
 
function goToProduct(id) {
  window.location.href = `products.html`;
}
 
// ===== INITIAL LOAD (products page) =====
if (document.getElementById("products")) {
  applyFilters();
}
 
// ===== CART PAGE =====
function displayCart() {
  const el = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");
  const subtotalEl = document.getElementById("subtotal");
  const shippingEl = document.getElementById("shipping");
  if (!el) return;
 
  if (!cart.length) {
    el.innerHTML = `
      <div class="cart-empty">
        <div class="ce-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any sneakers yet.</p>
        <a href="products.html" class="btn-primary" style="display:inline-flex">Browse Sneakers →</a>
      </div>`;
    if (totalEl) totalEl.textContent = "";
    if (subtotalEl) subtotalEl.textContent = "₹0";
    return;
  }
 
  let subtotal = 0;
  el.innerHTML = cart.map((item, i) => {
    subtotal += item.price * item.qty;
    return `
      <div class="cart-item-card">
        <img class="cart-item-img" src="${item.img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'">
        <div class="cart-item-info">
          <div class="cart-item-brand">${item.brand}</div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-cat">${item.category}</div>
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty(${i}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString("en-IN")}</div>
          <button class="cart-item-remove" onclick="removeItem(${i})" title="Remove">✕</button>
        </div>
      </div>`;
  }).join("");
 
  const shipping = subtotal > 0 ? (subtotal >= 5000 ? 0 : 199) : 0;
  const total = subtotal + shipping;
 
  if (subtotalEl) subtotalEl.textContent = "₹" + subtotal.toLocaleString("en-IN");
  if (shippingEl) shippingEl.textContent = shipping === 0 ? "FREE" : "₹" + shipping;
  if (totalEl) totalEl.textContent = "₹" + total.toLocaleString("en-IN");
}
 
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  displayCart();
}
 
function removeItem(index) {
  const name = cart[index].name;
  cart.splice(index, 1);
  saveCart();
  displayCart();
  showToast(name + " removed", "error");
}
 
function clearCart() {
  if (!cart.length) return;
  cart = [];
  saveCart();
  displayCart();
  showToast("Cart cleared");
}
 
if (document.getElementById("cartItems")) { displayCart(); }
 
// ===== PAYMENT PAGE =====
function initPaymentTabs() {
  const tabs = document.querySelectorAll(".pay-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".pay-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      const panel = document.getElementById("panel-" + tab.dataset.method);
      if (panel) panel.classList.add("active");
    });
  });
}
 
function formatCardNumber(input) {
  let val = input.value.replace(/\D/g, "").substring(0, 16);
  input.value = val.replace(/(.{4})/g, "$1 ").trim();
}
 
function formatExpiry(input) {
  let val = input.value.replace(/\D/g, "").substring(0, 4);
  if (val.length > 2) val = val.substring(0, 2) + "/" + val.substring(2);
  input.value = val;
}
 
function loadOrderReview() {
  const el = document.getElementById("orderReview");
  if (!el) return;
  if (!cart.length) { el.innerHTML = `<p style="color:var(--gray);font-size:14px">No items in cart.</p>`; return; }
  let subtotal = 0;
  el.innerHTML = cart.map(item => {
    subtotal += item.price * item.qty;
    return `
      <div class="review-item">
        <img src="${item.img}" alt="${item.name}" onerror="this.style.display='none'">
        <div class="ri-info">
          <div class="ri-name">${item.name}</div>
          <div class="ri-qty">Qty: ${item.qty}</div>
        </div>
        <div class="ri-price">₹${(item.price * item.qty).toLocaleString("en-IN")}</div>
      </div>`;
  }).join("");
  const shipping = subtotal >= 5000 ? 0 : 199;
  const total = subtotal + shipping;
  const pSubEl = document.getElementById("pSubtotal");
  const pShipEl = document.getElementById("pShipping");
  const pTotalEl = document.getElementById("pTotal");
  if (pSubEl) pSubEl.textContent = "₹" + subtotal.toLocaleString("en-IN");
  if (pShipEl) pShipEl.textContent = shipping === 0 ? "FREE" : "₹" + shipping;
  if (pTotalEl) pTotalEl.textContent = "₹" + total.toLocaleString("en-IN");
}
 
function placeOrder() {
  const name = document.getElementById("firstName")?.value;
  const addr = document.getElementById("address")?.value;
  if (!name || !addr) { showToast("Please fill all required fields", "error"); return; }
  cart = [];
  saveCart();
  window.location.href = "success.html";
}
 
// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initSearch();
  initPaymentTabs();
  loadOrderReview();
});
 