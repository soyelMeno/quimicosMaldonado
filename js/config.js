/* ==========================================================
   CONFIGURACIÓN DE LA COTIZACIÓN
   Todo lo editable vive aquí: precios, textos e imágenes.
   ========================================================== */

window.CONFIG = {
  moneda: "MXN",

  /* IVA que se suma en el resumen (0.16 = 16%). Los precios de abajo van SIN IVA. */
  iva: 0.16,

  /* WhatsApp de AC Letreros (solo dígitos, con lada de país). */
  whatsapp: "529931753531",

  /* Nota al pie del resumen. Ajústala a tus condiciones reales. */
  notaPrecios: "Precios en pesos mexicanos (MXN). Los precios por opción se muestran antes de IVA; el total del resumen ya incluye IVA. Consulta vigencia con tu asesor.",

  /* Enlace del logo "AC Letreros" en el encabezado */
  instagram: "https://www.instagram.com/ac_letreros/",

  /* ---------- IMÁGENES ----------
     Para reemplazar una imagen: sustituye el archivo en assets/img/
     con el mismo nombre, o cambia la ruta aquí. */
  imagenes: {
    hero:          "assets/img/fachada-0.jpg",   // imagen principal
    letras:        "assets/img/fachada-0.jpg",   // sección de letras 3D
    muro:          "assets/img/fachada-0.jpg",   // instalación directo a muro
    bastidor:      "assets/img/fachada-1.jpg",   // bastidor metálico
    bastidorPanel: "assets/img/fachada-2.jpg",   // bastidor + panel compuesto
    estructura:    "assets/img/fachada-3.jpg",   // estructura en toda el área superior
    acrilico:      "assets/img/fachada-4.jpg",   // set de letreros de acrílico
    bandera80:     "assets/img/bandera-80.jpg",  // letrero bandera de 80 cm
    bandera60:     "assets/img/bandera-60.jpg"   // letrero bandera de 60 cm
  },

  /* ---------- LETRAS 3D ---------- */
  letras: {
    precio: 21550,
    incisos: [
      {
        letra: "a",
        marca: "Químicos Maldonado",
        detalle: "Fabricación de letras 3D + isotipo + letras 2D",
        medidas: "85 × 270 cm"
      },
      {
        letra: "b",
        marca: "TamizMás",
        detalle: "Fabricación de letras 3D + letras 2D",
        medidas: "85 × 280 cm"
      },
      {
        letra: "c",
        marca: "DoMédica Integral",
        detalle: "Fabricación de letras 3D + letras 2D",
        medidas: "90 × 200 cm"
      }
    ]
  },

  /* ---------- DETALLES DE LAS LETRAS 3D ----------
     imagen: "" = sin imagen. Para reforzar con una foto/esquema, pon la ruta
     (ej. "assets/img/detalle-frente.jpg") y aparece sola, ampliable al tocarla. */
  detallesLetras: {
    titulo: "Así fabricamos tus letras",
    items: [
      {
        titulo: "Frente en acrílico con vinil",
        texto: "Acrílico blanco de 3 mm forrado con vinil traslúcido del color de cada logotipo. Vida útil mínima de 5 años; después, la intensidad del color puede disminuir gradualmente y se recupera volviendo a forrar las letras.",
        imagen: ""
      },
      {
        titulo: "Laterales a tu elección",
        texto: "Acrílico blanco, acrílico del color de la letra, aluminio cepillado o aluminio plateado tipo espejo. La elección no modifica el precio.",
        imagen: ""
      },
      {
        titulo: "Letras desmontables",
        texto: "Con o sin iluminación, las letras se fabrican desmontables para facilitar su mantenimiento o integrar luces en una segunda etapa.",
        imagen: ""
      },
      {
        titulo: "Isotipo",
        texto: "Fondo en acrílico blanco con elementos en vinil de corte, con colores estables por al menos 5 años.",
        imagen: ""
      }
    ]
  },

  /* ---------- TIEMPOS Y CONDICIONES ----------
     {anticipo} y {garantia} se reemplazan con los valores de abajo. */
  condiciones: {
    anticipoPct: 0.65,
    garantiaMeses: 8,
    tiempos: [
      "Al recibir el anticipo comienza el diseño y la fabricación de letreros y estructura.",
      "Diseño y fabricación: 20 a 25 días.",
      "Instalación en un solo día, en la fecha que mejor convenga al cliente.",
      "Si algún material no está disponible, la fecha de entrega puede moverse."
    ],
    pago: [
      "Anticipo del {anticipo}% para iniciar los trabajos.",
      "Al terminar, el cliente cubre el 100% del total. AC Letreros puede retener el trabajo hasta recibir el pago completo; si el pago es con cheque, se considera cubierto hasta que se refleje en cuenta.",
      "Entrega en la dirección que indique el cliente.",
      "Garantía de {garantia} meses por defectos de fabricación en letras 3D, anuncios luminosos e iluminación, excepto daños causados por terceros.",
      "El anticipo no es reembolsable.",
      "Los precios ya incluyen el cargo por instalación en altura. Las instalaciones fuera de Villahermosa pueden tener un cargo extra."
    ]
  },

  /* ---------- ILUMINACIÓN (opcional) ---------- */
  iluminacion: {
    precio: 6000,
    titulo: "Iluminación en letras 3D e isotipo",
    descripcion: "Que tu marca destaque también de noche."
  },

  /* ---------- LETREROS DE ACRÍLICO (set adicional, opcional) ---------- */
  acrilico: {
    descripcion: "Base de acrílico transparente de 6 mm con letras semi planas de Alucobond en aluminio cepillado.",
    items: [
      { id: "acr-iso",      nombre: "Isotipo Químicos Maldonado", medidas: "87 × 87 cm",  precio: 6500 },
      { id: "acr-tamiz",    nombre: "TamizMás",                   medidas: "77 × 215 cm", precio: 12000 },
      { id: "acr-domedica", nombre: "DoMédica Integral",          medidas: "85 × 175 cm", precio: 12000 }
    ],
    iluminacion: {
      precio: 3800,
      titulo: "Iluminación en letreros de acrílico",
      descripcion: "Se aplica a los letreros de acrílico que elijas."
    }
  },

  /* ---------- LETREROS TIPO BANDERA (otras ubicaciones, opcionales) ---------- */
  banderas: {
    descripcion: "Letreros luminosos circulares tipo bandera para tus otras ubicaciones. Incluyen suministro e instalación.",
    items: [
      { id: "ban-80", nombre: "Letrero bandera circular de 80 cm", medidas: "Ø 80 cm", precio: 6800, imagen: "bandera80" },
      { id: "ban-60", nombre: "Letrero bandera circular de 60 cm", medidas: "Ø 60 cm", precio: 4500, imagen: "bandera60" }
    ]
  },

  /* ---------- OPCIONES DE INSTALACIÓN ---------- */
  instalacion: [
    {
      id: "muro",
      nombre: "Directo a muro",
      precio: 6500,
      descripcion: "Las letras se fijan directamente sobre la fachada. Limpio, directo y la opción más accesible.",
      imagen: "muro"
    },
    {
      id: "bastidor",
      nombre: "Bastidor metálico",
      precio: 10500,
      descripcion: "Bastidor metálico con tratamiento anticorrosivo y acabado gris mate.",
      imagen: "bastidor"
    },
    {
      id: "bastidor-panel",
      nombre: "Bastidor con panel compuesto",
      precio: 25500,
      descripcion: "Bastidor metálico con tratamiento anticorrosivo, forrado en panel de aluminio compuesto con acabado gris mate.",
      imagen: "bastidorPanel"
    },
    {
      id: "estructura",
      nombre: "Estructura en toda el área superior",
      precio: 50000,
      descripcion: "Estructura metálica forrada de panel compuesto en acabado gris mate en toda el área superior de la fachada.",
      imagen: "estructura",
      /* Texto que se despliega en "Ver detalles del montaje". imagen: "" = sin imagen */
      detalle: {
        texto: "Bastidor de metal ligero de aproximadamente 1.30 × 15 m, anclado a la losa con tornillería de fijación directa para concreto, que evita fisuras. Se forra con panel de aluminio compuesto (ACM) y sobre él se colocan los letreros. Para las maniobras y para reducir riesgos, el área de estacionamiento debe estar despejada.",
        imagen: ""   // ej. "assets/img/detalle-estructura.jpg"
      }
    }
  ]
};
