/* ==========================================================
   LÓGICA DEL COTIZADOR
   Lee todo desde window.CONFIG (js/config.js)
   ========================================================== */
(function () {
  "use strict";
  const C = window.CONFIG;

  const fmt = new Intl.NumberFormat("es-MX", {
    style: "currency", currency: C.moneda, maximumFractionDigits: 0
  });
  const money = (n) => fmt.format(n);
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  /* ---------- Estado ---------- */
  const state = {
    luz: false,
    instalacionId: C.instalacion[0].id
  };

  /* ---------- Imágenes (fáciles de reemplazar desde config.js) ---------- */
  function setImg(el, key) {
    el.src = C.imagenes[key] || "";
    el.classList.remove("is-missing");
    el.onerror = () => { el.classList.add("is-missing"); el.removeAttribute("src"); };
  }
  $$("[data-img]").forEach((el) => setImg(el, el.dataset.img));

  /* ---------- Render estático ---------- */
  $$("[data-precio-letras]").forEach((e) => (e.textContent = money(C.letras.precio)));
  $("[data-luz-titulo]").textContent = C.iluminacion.titulo;
  $("[data-luz-desc]").textContent = C.iluminacion.descripcion;
  $("[data-luz-precio]").textContent = "+ " + money(C.iluminacion.precio);
  $("[data-nota]").textContent = C.notaPrecios;

  const desde = C.letras.precio + Math.min(...C.instalacion.map((i) => i.precio));
  $("[data-desde]").textContent = money(desde);

  $("#incisos").innerHTML = C.letras.incisos.map((i) => `
    <li class="inciso">
      <span class="inciso__letra">${i.letra})</span>
      <div>
        <h3>${i.marca}</h3>
        <p>${i.detalle}</p>
        <span class="inciso__medidas">Medidas totales: ${i.medidas}</span>
      </div>
    </li>`).join("");

  $("#install").innerHTML = C.instalacion.map((o, idx) => `
    <div class="opt reveal">
      <input type="radio" name="instalacion" id="opt-${o.id}" value="${o.id}" ${idx === 0 ? "checked" : ""}>
      <label class="opt__card" for="opt-${o.id}">
        <div class="opt__img">
          <img data-opt-img="${o.imagen}" alt="${o.nombre}" loading="lazy">
          <button type="button" class="opt__zoom" data-zoom="${o.imagen}" data-title="${o.nombre}" aria-label="Ampliar imagen: ${o.nombre}">⤢ Ampliar</button>
        </div>
        <div class="opt__body">
          <div class="opt__top">
            <span class="opt__name">${o.nombre}</span>
            <span class="opt__price">${money(o.precio)}</span>
          </div>
          <p class="opt__desc">${o.descripcion}</p>
        </div>
      </label>
      <span class="opt__check" aria-hidden="true">✓</span>
    </div>`).join("");

  $$("[data-opt-img]").forEach((el) => setImg(el, el.dataset.optImg));

  /* ---------- Cálculo y resumen ---------- */
  const previewImg = $("[data-img-preview]");
  const previewCap = $("[data-preview-caption]");
  const totalEls = $$("[data-total]");

  function currentInstall() {
    return C.instalacion.find((i) => i.id === state.instalacionId);
  }

  function update() {
    const inst = currentInstall();
    const total = C.letras.precio + (state.luz ? C.iluminacion.precio : 0) + inst.precio;

    $("#lines").innerHTML = `
      <li><span>Letras 3D (3 letreros)</span><span>${money(C.letras.precio)}</span></li>
      <li class="${state.luz ? "" : "muted"}"><span>Iluminación</span><span>${state.luz ? money(C.iluminacion.precio) : "No incluida"}</span></li>
      <li><span>Instalación: ${inst.nombre}</span><span>${money(inst.precio)}</span></li>`;

    totalEls.forEach((el) => {
      el.textContent = money(total);
      el.classList.add("bump");
      setTimeout(() => el.classList.remove("bump"), 250);
    });

    setImg(previewImg, inst.imagen);
    previewCap.textContent = inst.nombre;

    /* Mensaje de WhatsApp con el resumen */
    const msg = [
      "Hola, me interesa esta propuesta de letreros:",
      `• Letras 3D (3 letreros): ${money(C.letras.precio)}`,
      `• Iluminación: ${state.luz ? money(C.iluminacion.precio) : "No"}`,
      `• Instalación (${inst.nombre}): ${money(inst.precio)}`,
      `TOTAL: ${money(total)}`
    ].join("\n");
    $("#cta").href = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  $("#luz").addEventListener("change", (e) => { state.luz = e.target.checked; update(); });
  $("#install").addEventListener("change", (e) => {
    if (e.target.name === "instalacion") { state.instalacionId = e.target.value; update(); }
  });

  update();

  /* ---------- Visor de imagen ampliada ---------- */
  const lb = $("#lightbox");
  const lbImg = $("img", lb);
  const lbCap = $(".lightbox__cap", lb);
  function openLightbox(key, title) {
    lbImg.src = C.imagenes[key] || "";
    lbImg.alt = title;
    lbCap.textContent = title;
    lb.showModal();
  }
  document.addEventListener("click", (e) => {
    const z = e.target.closest("[data-zoom]");
    if (z) { e.preventDefault(); openLightbox(z.dataset.zoom, z.dataset.title); return; }
    if (lb.open && e.target !== lbImg) lb.close();
  });
  previewImg.addEventListener("click", () => {
    const i = currentInstall(); openLightbox(i.imagen, i.nombre);
  });
  $("[data-img=letras]").addEventListener("click", () => openLightbox("letras", "Letras 3D"));

  /* ---------- Animaciones de entrada ---------- */
  const revealTargets = $$(".reveal, .inciso, .toggle, .summary__card");
  revealTargets.forEach((el) => el.classList.add("reveal"));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Barra fija: se oculta al ver el resumen ---------- */
  const bar = $("#stickybar");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      bar.classList.toggle("is-hidden", entries[0].isIntersecting);
    }, { threshold: 0.2 }).observe($("#resumen"));
  }
})();
