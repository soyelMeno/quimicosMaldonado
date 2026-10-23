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
    instalacionId: C.instalacion[0].id,
    acrilico: new Set(),
    luzAcrilico: false,
    banderas: new Set()
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
  $("[data-desde]").textContent = money(desde) + " + IVA";

  $("#incisos").innerHTML = C.letras.incisos.map((i) => `
    <li class="inciso">
      <span class="inciso__letra">${i.letra})</span>
      <div>
        <h3>${i.marca}</h3>
        <p>${i.detalle}</p>
        <span class="inciso__medidas">Medidas totales: ${i.medidas}</span>
      </div>
    </li>`).join("");

  /* ---------- Detalles con imagen opcional ---------- */
  const media = (src, title) => src
    ? `<figure class="media" data-zoom="${src}" data-title="${title}"><img src="${src}" alt="${title}" loading="lazy" onerror="this.parentNode.remove()"></figure>`
    : "";

  const D = C.detallesLetras;
  $("#detallesLetras").innerHTML = `
    <h3 class="features__title">${D.titulo}</h3>
    <div class="features__grid">${D.items.map((f) => `
      <article class="feature">
        ${media(f.imagen, f.titulo)}
        <h4>${f.titulo}</h4>
        <p>${f.texto}</p>
      </article>`).join("")}
    </div>`;

  /* ---------- Tiempos y condiciones ---------- */
  const K = C.condiciones;
  const anticipoPct = Math.round(K.anticipoPct * 100);
  const fill = (t) => t.replace("{anticipo}", anticipoPct).replace("{garantia}", K.garantiaMeses);
  $("#condTiempos").innerHTML = K.tiempos.map((t) => `<li>${fill(t)}</li>`).join("");
  $("#condPago").innerHTML = K.pago.map((t) => `<li>${fill(t)}</li>`).join("");
  $("[data-anticipo-pct]").textContent = anticipoPct + "%";
  $("#brandLink").href = C.instagram;

  /* ---------- Letreros de acrílico ---------- */
  const A = C.acrilico;
  $("[data-acr-desc]").textContent = A.descripcion;
  $("[data-acr-luz-titulo]").textContent = A.iluminacion.titulo;
  $("[data-acr-luz-desc]").textContent = A.iluminacion.descripcion;
  $("[data-acr-luz-precio]").textContent = "+ " + money(A.iluminacion.precio);
  $("#acrilicoItems").innerHTML = A.items.map((i) => `
    <li>
      <label class="acr">
        <input type="checkbox" value="${i.id}">
        <span class="acr__box" aria-hidden="true">✓</span>
        <span class="acr__text"><strong>${i.nombre}</strong><small>Medidas: ${i.medidas}</small></span>
        <span class="acr__price">${money(i.precio)}</span>
      </label>
    </li>`).join("");

  const luzAcr = $("#luzAcr");
  function syncAcrToggle() {
    const has = state.acrilico.size > 0;
    luzAcr.disabled = !has;
    if (!has) { luzAcr.checked = false; state.luzAcrilico = false; }
    $("#toggleLuzAcr").classList.toggle("is-disabled", !has);
  }
  syncAcrToggle();

  /* ---------- Letreros tipo bandera ---------- */
  const B = C.banderas;
  $("[data-ban-desc]").textContent = B.descripcion;
  $("#banderasItems").innerHTML = B.items.map((i) => `
    <div class="ban">
      <input type="checkbox" id="${i.id}" value="${i.id}">
      <label class="ban__card" for="${i.id}">
        <div class="ban__img">
          <img data-ban-img="${i.imagen}" alt="${i.nombre}" loading="lazy">
          <button type="button" class="opt__zoom" data-zoom="${i.imagen}" data-title="${i.nombre}" aria-label="Ampliar imagen: ${i.nombre}">⤢ Ampliar</button>
        </div>
        <div class="ban__body">
          <div class="opt__top">
            <span class="opt__name">${i.nombre}</span>
            <span class="opt__price">${money(i.precio)}</span>
          </div>
          <p class="opt__desc">Suministro e instalación incluidos.</p>
        </div>
      </label>
      <span class="opt__check" aria-hidden="true">✓</span>
    </div>`).join("");
  $$("[data-ban-img]").forEach((el) => setImg(el, el.dataset.banImg));

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
          ${o.detalle ? `<details class="opt__more"><summary>Ver detalles del montaje</summary><p>${o.detalle.texto}</p>${media(o.detalle.imagen, o.nombre)}</details>` : ""}
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
    const acrItems = A.items.filter((i) => state.acrilico.has(i.id));
    const acrSum = acrItems.reduce((s, i) => s + i.precio, 0);
    const acrLuz = acrItems.length > 0 && state.luzAcrilico;
    const acrLines = acrItems.length
      ? acrItems.map((i) => `<li><span>Acrílico: ${i.nombre}</span><span>${money(i.precio)}</span></li>`).join("") +
        `<li class="${acrLuz ? "" : "muted"}"><span>Iluminación acrílico</span><span>${acrLuz ? money(A.iluminacion.precio) : "No incluida"}</span></li>`
      : `<li class="muted"><span>Letreros de acrílico</span><span>No incluidos</span></li>`;
    const banItems = B.items.filter((i) => state.banderas.has(i.id));
    const banSum = banItems.reduce((s, i) => s + i.precio, 0);
    const banLines = banItems.length
      ? banItems.map((i) => `<li><span>${i.nombre}</span><span>${money(i.precio)}</span></li>`).join("")
      : `<li class="muted"><span>Letreros tipo bandera</span><span>No incluidos</span></li>`;
    const subtotal = C.letras.precio + (state.luz ? C.iluminacion.precio : 0) + inst.precio +
      acrSum + (acrLuz ? A.iluminacion.precio : 0) + banSum;
    const iva = subtotal * C.iva;
    const total = subtotal + iva;
    const ivaLabel = "IVA (" + Math.round(C.iva * 100) + "%)";

    $("#lines").innerHTML = `
      <li><span>Letras 3D (3 letreros)</span><span>${money(C.letras.precio)}</span></li>
      <li class="${state.luz ? "" : "muted"}"><span>Iluminación</span><span>${state.luz ? money(C.iluminacion.precio) : "No incluida"}</span></li>
      <li><span>Instalación: ${inst.nombre}</span><span>${money(inst.precio)}</span></li>
      ${acrLines}
      ${banLines}
      <li class="lines__subtotal"><span>Subtotal</span><span>${money(subtotal)}</span></li>
      <li><span>${ivaLabel}</span><span>${money(iva)}</span></li>`;

    totalEls.forEach((el) => {
      el.textContent = money(total);
      el.classList.add("bump");
      setTimeout(() => el.classList.remove("bump"), 250);
    });

    $("[data-anticipo]").textContent = money(total * K.anticipoPct);

    setImg(previewImg, inst.imagen);
    previewCap.textContent = inst.nombre;

    /* Mensaje de WhatsApp con el resumen */
    const msg = [
      "Hola, me interesa esta propuesta de letreros:",
      `• Letras 3D (3 letreros): ${money(C.letras.precio)}`,
      `• Iluminación: ${state.luz ? money(C.iluminacion.precio) : "No"}`,
      `• Instalación (${inst.nombre}): ${money(inst.precio)}`,
      ...(acrItems.length
        ? [...acrItems.map((i) => `• Acrílico ${i.nombre}: ${money(i.precio)}`),
           `• Iluminación acrílico: ${acrLuz ? money(A.iluminacion.precio) : "No"}`]
        : []),
      ...banItems.map((i) => `• ${i.nombre}: ${money(i.precio)}`),
      `Subtotal: ${money(subtotal)}`,
      `${ivaLabel}: ${money(iva)}`,
      `TOTAL (IVA incluido): ${money(total)}`
    ].join("\n");
    $("#cta").href = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  $("#luz").addEventListener("change", (e) => { state.luz = e.target.checked; update(); });
  $("#acrilicoItems").addEventListener("change", (e) => {
    if (e.target.checked) state.acrilico.add(e.target.value); else state.acrilico.delete(e.target.value);
    syncAcrToggle(); update();
  });
  luzAcr.addEventListener("change", (e) => { state.luzAcrilico = e.target.checked; update(); });
  $("#banderasItems").addEventListener("change", (e) => {
    if (e.target.checked) state.banderas.add(e.target.value); else state.banderas.delete(e.target.value);
    update();
  });
  $("#install").addEventListener("change", (e) => {
    if (e.target.name === "instalacion") { state.instalacionId = e.target.value; update(); }
  });

  update();

  /* ---------- Visor de imagen ampliada ---------- */
  const lb = $("#lightbox");
  const lbImg = $("img", lb);
  const lbCap = $(".lightbox__cap", lb);
  function openLightbox(key, title) {
    lbImg.src = C.imagenes[key] || key;
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
  $("[data-img=acrilico]").addEventListener("click", () => openLightbox("acrilico", "Letreros de acrílico"));

  /* ---------- Animaciones de entrada ---------- */
  const revealTargets = $$(".reveal, .inciso, .toggle, .summary__card, .feature, .cond__card, .ban");
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
