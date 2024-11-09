document.addEventListener("DOMContentLoaded", function() {

  // Funcionalidad de desplazamiento suave para los enlaces de navegación
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      window.scrollTo({
        top: targetElement.offsetTop - 142,
        behavior: 'smooth'
      });
    });
  });

  // Mostrar el popup al cargar la página
  const popup = document.getElementById('promo-popup');
  window.onload = function() {
    popup.style.display = 'flex';
  }

  // Cerrar el popup cuando se hace clic en el botón de cerrar
  document.getElementById('cerrar').onclick = function() {
    popup.style.display = 'none';
  }

  // Cerrar el popup al hacer clic fuera del contenido
  window.onclick = function(event) {
    if (event.target === popup) {
      popup.style.display = 'none';
    }
  }

  // Funcionalidad para el botón de "scroll to top" (desplazarse hacia arriba)
  document.querySelector('.btn-scroll-to-top').addEventListener('click', function(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Desplazamiento suave
    });
  });
});
function enviarWhatsApp() {
  // Obtener los valores de los campos
  var nombre = document.getElementById("input-nombre").value.trim();
  var correo = document.getElementById("input-telephone").value.trim();
  var mensaje = document.getElementById("input-mensaje").value.trim();

  // Validación de campos vacíos
  if (nombre === "" || correo === "" || mensaje === "") {
    alert("Por favor, rellena todos los campos.");
    return;
  }

  // URL de WhatsApp con los datos
  var url =
    "https://wa.me/51962286009?text=" +
    encodeURIComponent("Hola! Mi nombre es " + nombre) +
    "%0a" +
    encodeURIComponent("Mi correo es " + correo) +
    "%0a" +
    encodeURIComponent("Te escribo para: " + mensaje) +
    "%0a" +
    encodeURIComponent("😊😊💅🏻💅🏻");

  // Abrir WhatsApp en una nueva ventana
  window.open(url, "_blank");

  // Resetear el formulario después de enviarlo
  document.getElementById("input-nombre").value = "";
  document.getElementById("input-telephone").value = "";
  document.getElementById("input-mensaje").value = "";

}

