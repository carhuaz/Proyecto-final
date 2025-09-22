// =======================
// AJ Nails • products.js
// (Tienda: carrito v2 + filtros/búsqueda)
// =======================
(function () {
  "use strict";

  // =======================
  // Carrito v2 (mismo módulo que en index)
  // =======================
  const CURRENCY = (v) => "S/ " + (Number(v || 0)).toFixed(2);
  const CART_KEY = "ajnails_cart_v2";
  const $ = (s) => document.querySelector(s);

  const loadCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  };
  const saveCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));

  function addToCart(item) {
    const cart = loadCart();
    const i = cart.findIndex((p) => p.id === item.id);
    if (i >= 0) cart[i].qty += item.qty || 1;
    else cart.push({ ...item, qty: item.qty || 1 });
    saveCart(cart);
    renderCart();
    openCart();
    bounceCart();
  }

  function inc(id) { const c = loadCart(); const i = c.findIndex(p => p.id === id); if (i >= 0) { c[i].qty++; saveCart(c); renderCart(); } }
  function dec(id) { const c = loadCart(); const i = c.findIndex(p => p.id === id); if (i >= 0) { c[i].qty = Math.max(1, c[i].qty - 1); saveCart(c); renderCart(); } }
  function del(id) { saveCart(loadCart().filter(p => p.id !== id)); renderCart(); }
  function clear()  { saveCart([]); renderCart(); }

  function totals() {
    const cart = loadCart();
    return {
      count: cart.reduce((s, p) => s + p.qty, 0),
      total: cart.reduce((s, p) => s + p.price * p.qty, 0),
      cart
    };
  }

  function renderCart() {
    const { cart, total, count } = totals();

    const badge = $("#cartCount");
    if (badge) badge.textContent = count;

    const list = $("#cartList");
    const totalEl = $("#cartTotal");
    if (!list || !totalEl) return;

    if (!cart.length) {
      list.innerHTML = `<li class="list-group-item text-center text-muted">Tu carrito está vacío</li>`;
    } else {
      list.innerHTML = cart.map(p => `
        <li class="list-group-item">
          <div class="cart-item">
            <img class="cart-thumb" src="${p.img || 'img/placeholder.jpg'}" alt="${p.name}">
            <div>
              <p class="cart-title">${p.name}</p>
              <div class="d-flex align-items-center gap-2">
                <div class="qty">
                  <button class="btn-qty" data-dec="${p.id}">–</button>
                  <span>${p.qty}</span>
                  <button class="btn-qty" data-inc="${p.id}">+</button>
                </div>
                <button class="btn-remove" title="Eliminar" data-del="${p.id}">&times;</button>
              </div>
              <div class="cart-meta">Precio unit.: ${CURRENCY(p.price)}</div>
            </div>
            <div class="price">${CURRENCY(p.price * p.qty)}</div>
          </div>
        </li>
      `).join("");
    }

    totalEl.textContent = CURRENCY(total);

    // handlers dinámicos
    list.querySelectorAll("[data-inc]").forEach(b => b.addEventListener("click", () => inc(b.dataset.inc)));
    list.querySelectorAll("[data-dec]").forEach(b => b.addEventListener("click", () => dec(b.dataset.dec)));
    list.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => del(b.dataset.del)));
  }

  function openCart() {
    const el = $("#offcanvasCart");
    if (el && window.bootstrap) bootstrap.Offcanvas.getOrCreateInstance(el).show();
  }

  function bounceCart() {
    const btn = $("#cartButton");
    if (!btn) return;
    btn.classList.add("cart-animate");
    btn.addEventListener("animationend", () => btn.classList.remove("cart-animate"), { once: true });
  }

  // Botones globales del carrito
  $("#cartButton")?.addEventListener("click", openCart);
  $("#clearCart")?.addEventListener("click", clear);

  // Capturar “Agregar al carrito”
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-addcart]");
    if (!btn) return;
    addToCart({
      id: btn.getAttribute("data-id"),
      name: btn.getAttribute("data-name"),
      price: parseFloat(btn.getAttribute("data-price") || "0"),
      img: btn.getAttribute("data-img") || ""
    });
  });

  // Inicializar UI carrito
  document.addEventListener("DOMContentLoaded", renderCart);

  // =======================
  // Filtros / Búsqueda de productos
  // =======================
  const filter = document.getElementById('filterCat');
  const search = document.getElementById('searchBox');
  const grid   = document.getElementById('gridProducts');

  function applyFilters(){
    const q   = (search?.value || '').toLowerCase();
    const cat = filter?.value || 'all';
    grid?.querySelectorAll('.product').forEach(card=>{
      const name = (card.dataset.name || '').toLowerCase();
      const c    = card.dataset.cat || 'all';
      const okCat  = (cat === 'all' || cat === c);
      const okText = (!q || name.includes(q));
      card.style.display = (okCat && okText) ? '' : 'none';
    });
  }

  filter?.addEventListener('change', applyFilters);
  search?.addEventListener('input', applyFilters);
  document.addEventListener('DOMContentLoaded', applyFilters);
})();
document.addEventListener("DOMContentLoaded", renderCart);
window.addEventListener("storage", (e) => {
  if (e.key === "ajnails_cart_v2") renderCart();
});
