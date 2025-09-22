// =======================
// AJ Nails • checkout.js
// (resumen, tipo de servicio, movilidad a domicilio, comentario, WhatsApp)
// =======================
(function(){
  "use strict";

  const CURRENCY = v => "S/ " + (Number(v||0)).toFixed(2);
  const CART_KEY = "ajnails_cart_v2";

  const els = (sel,ctx=document)=>[...ctx.querySelectorAll(sel)];
  const $  = (sel,ctx=document)=>ctx.querySelector(sel);

  // Carrito
  const cart = () => { try{return JSON.parse(localStorage.getItem(CART_KEY))||[]}catch{return[]} };
  const subtotal = () => cart().reduce((s,p)=>s+p.price*p.qty,0);

  // Resumen
  function renderSummary(){
    const body = $("#co-body");
    const subEl= $("#co-subtotal");
    if(!body || !subEl) return;

    const c = cart();
    if(!c.length){
      body.innerHTML = `<tr><td colspan="3" class="text-center text-muted">Tu carrito está vacío</td></tr>`;
      subEl.textContent = CURRENCY(0);
      updateTotals();
      return;
    }
    let sub=0;
    body.innerHTML = c.map(p=>{
      const imp = p.price*p.qty; sub+=imp;
      return `<tr>
        <td>${p.name}</td>
        <td class="text-center">${p.qty}</td>
        <td class="text-end">${CURRENCY(imp)}</td>
      </tr>`;
    }).join("");
    subEl.textContent = CURRENCY(sub);
    updateTotals();
  }

  // UI domicilio
  function toggleServicioUI(){
    const domicilio = $("#co-entrega")?.value === "Domicilio";
    els(".domicilio-only").forEach(x=> x.classList.toggle("d-none", !domicilio));
    updateTotals();
  }

  // Totales (subtotal + movilidad)
  function updateTotals(){
    const sub = subtotal();
    let movilidad = 0;
    if ($("#co-entrega")?.value === "Domicilio"){
      movilidad = Number($("#co-zona")?.value || 0);
    }
    const total = sub + movilidad;

    $("#co-envio").textContent = CURRENCY(movilidad);
    $("#co-total").textContent = CURRENCY(total);
  }

  // Validación mínima
  function validateAndFocus(){
    const nombre = $("#co-nombre");
    const tel    = $("#co-tel");
    const entrega= $("#co-entrega");
    const dir    = $("#co-dir");

    const needDir = entrega?.value === "Domicilio";
    const invalid = !nombre.value.trim() || !tel.value.trim() || (needDir && !dir.value.trim());

    [nombre,tel].forEach(i=> i.classList.toggle("is-invalid", !i.value.trim()));
    if (needDir) dir.classList.toggle("is-invalid", !dir.value.trim());
    else dir?.classList.remove("is-invalid");

    if (invalid){
      const first = [nombre,tel,needDir?dir:null].find(i=>i && !i.value.trim());
      first?.scrollIntoView({behavior:"smooth", block:"center"});
      first?.focus();
      return false;
    }
    return true;
  }

  // WhatsApp
  function sendWhatsApp(){
    if(!cart().length){ alert("Tu carrito está vacío."); return; }
    if(!validateAndFocus()) return;

    const nombre = $("#co-nombre").value.trim();
    const tel    = $("#co-tel").value.trim();
    const entrega= $("#co-entrega").value;
    const fecha  = ($("#co-fecha")?.value || "").trim();
    const hora   = ($("#co-hora")?.value || "").trim();
    const dir    = ($("#co-dir")?.value || "").trim();
    const zona   = ($("#co-zona")?.selectedOptions?.[0]?.text || "").trim();
    const nota   = ($("#co-nota")?.value || "").trim();

    const c = cart();
    const lineas = c.map(p=>`• ${p.name} x${p.qty} = S/ ${(p.price*p.qty).toFixed(2)}`).join("\n");
    const sub = subtotal();
    const movilidad = entrega==="Domicilio" ? Number($("#co-zona").value||0) : 0;
    const total = sub + movilidad;

    const texto = [
      `Pedido/Reserva de ${nombre}`,
      `Tel.: ${tel}`,
      `Servicio: ${entrega}${entrega==="Domicilio" ? ` (${zona}) - Dir.: ${dir}` : " (en el local)"}`,
      (fecha || hora) ? `Preferencia: ${fecha||"-"} ${hora||""}`.trim() : "",
      nota ? `Comentario: ${nota}` : "",
      ``,
      `Resumen:`,
      lineas || "(vacío)",
      ``,
      `Subtotal: S/ ${sub.toFixed(2)}`,
      `Movilidad: S/ ${movilidad.toFixed(2)}`,
      `Total: S/ ${total.toFixed(2)}`
    ].filter(Boolean).join("\n");

    window.open("https://wa.me/51962286009?text="+encodeURIComponent(texto), "_blank");
  }

  // Listeners
  document.addEventListener("DOMContentLoaded", ()=>{
    renderSummary();
    toggleServicioUI();
  });
  $("#co-entrega")?.addEventListener("change", toggleServicioUI);
  $("#co-zona")?.addEventListener("change", updateTotals);
  $("#co-wh")?.addEventListener("click", sendWhatsApp);
})();
document.addEventListener("DOMContentLoaded", renderCart);
window.addEventListener("storage", (e) => {
  if (e.key === "ajnails_cart_v2") renderCart();
});
