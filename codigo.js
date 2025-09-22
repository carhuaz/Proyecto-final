// =======================
// AJ Nails • codigo.js
// (Index: navbar, scroll, back-to-top, carrito v2, contacto)
// =======================
(function () {
  "use strict";

  // --------- AOS ----------
  document.addEventListener("DOMContentLoaded", () => {
    if (window.AOS) AOS.init();
  });

  // --------- Smooth scroll + cerrar menú móvil ----------
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const nav = document.querySelector(".navbar");
    const offset = nav ? nav.getBoundingClientRect().height : 0;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: "smooth" });

    // Cierra el menú colapsado en móvil
    const openCollapse = document.querySelector(".navbar-collapse.show");
    if (openCollapse && window.bootstrap) {
      const bs = bootstrap.Collapse.getOrCreateInstance(openCollapse, { toggle: false });
      bs.hide();
    }
  });

  // --------- Botón volver arriba ----------
  document.querySelector(".btn-scroll-to-top")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // =======================
  // Carrito v2 (compartido)
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

  // Capturar “Agregar al carrito” (en cards de servicios o destacados que tengas en index)
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

  // Inicializar UI carrito al cargar
  document.addEventListener("DOMContentLoaded", renderCart);

  // =======================
  // Formulario de CONTACTO (solo citas / dudas)
  // =======================
  window.enviarWhatsApp = function () {
    const nombre   = document.getElementById("input-nombre")?.value.trim();
    const contacto = document.getElementById("input-telephone")?.value.trim();
    const mensaje  = document.getElementById("input-mensaje")?.value.trim();

    if (!nombre || !contacto || !mensaje) {
      alert("Por favor, completa nombre, contacto y mensaje.");
      ( !nombre ? document.getElementById("input-nombre")
        : !contacto ? document.getElementById("input-telephone")
        : document.getElementById("input-mensaje") )?.focus();
      return;
    }

    const texto = [
      `Hola! Soy ${nombre}`,
      `Contacto: ${contacto}`,
      `Mensaje: ${mensaje}`
    ].join("\n");

    window.open("https://wa.me/51962286009?text=" + encodeURIComponent(texto), "_blank");
  };
})();
document.addEventListener("DOMContentLoaded", renderCart);
window.addEventListener("storage", (e) => {
  if (e.key === "ajnails_cart_v2") renderCart();
});
document.addEventListener("DOMContentLoaded", renderCart);  // pinta #cartCount

window.addEventListener("storage", (e) => {
  if (e.key === "ajnails_cart_v2") renderCart();
});
