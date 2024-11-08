document.addEventListener("DOMContentLoaded", function() {
  const inpNombre = document.getElementById('input-nombre');
  const inpEmail = document.getElementById('input-telephone');
  const inpMensaje = document.getElementById('input-mensaje');

  async function enviardatos() {
    const nombre = inpNombre.value;
    const email = inpEmail.value;
    const mensaje = inpMensaje.value;

    if (!nombre || !email || !mensaje) {
      alert('Por favor rellene todos los campos');
      return;
    }

    alert('Datos enviados correctamente');
    inpNombre.value = "";
    inpEmail.value = "";
    inpMensaje.value = "";
  }

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

  document.querySelector('.btn-scroll-to-top').addEventListener('click', function(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Desplazamiento suave
    });
  });

  // Evitar que el botón de envío recargue la página
  const submitButton = document.querySelector('.boton-negro');
  submitButton.addEventListener('click', function(event) {
    event.preventDefault(); // Evita la recarga de la página
    enviardatos();
  });
});
