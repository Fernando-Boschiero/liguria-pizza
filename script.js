/* Liguria Pizza — behaviour
   1. PT/EN copy switch
   2. menu cards rendered from data
   3. equalise + centre a short final row of cards
*/
(function () {
  "use strict";

  const WA = "5519989601411";

  const COPY = {
    pt: {
      navCta: "Mensagem",
      h1: "Napolitana de Verdade, na Feira de Barão",
      sub: "Massa de longa fermentação, assada na hora. Pizzas individuais de 22 cm feitas com ingredientes simples e bem escolhidos.",
      heroCta: "Onde nos encontrar",
      heroCta2: "Ver o cardápio",
      menuTitle: "Nossas pizzas",
      menuNote: "Individuais · 22 cm",
      vegTag: "Vegetariana",
      photoTodo: "foto:",
      whereTitle: "Onde estamos",
      whereKicker: "Todo sábado",
      whereName: "Feira de Barão Geraldo",
      whereAddr: "“Praça do Coco”, Barão Geraldo — Campinas, SP",
      whereDay: "Sábado",
      whereCta: "Como chegar",
      contactTitle: "Contato",
      contactBody:
        "Quer a Liguria no seu evento? Mande uma mensagem — respondemos o mais breve possível.",
      contactWa: "Falar no WhatsApp",
      fName: "Nome",
      fEmail: "E-mail",
      fMsg: "Mensagem",
      fSend: "Enviar mensagem",
      rights: "Todos os direitos reservados",
      by: "Site por",
    },
    en: {
      navCta: "Message",
      h1: "Real Neapolitan Pizza, at the Barão Market",
      sub: "Long-fermented dough, baked to order. Individual 22 cm pizzas made with simple, carefully chosen ingredients.",
      heroCta: "Where to find us",
      heroCta2: "See the menu",
      menuTitle: "Our pizzas",
      menuNote: "Individual pies · 22 cm",
      vegTag: "Vegetarian",
      photoTodo: "photo:",
      whereTitle: "Find us",
      whereKicker: "Every Saturday",
      whereName: "Barão Geraldo Market",
      whereAddr: "“Praça do Coco”, Barão Geraldo — Campinas, SP",
      whereDay: "Saturday",
      whereCta: "Get directions",
      contactTitle: "Contact",
      contactBody:
        "Want Liguria at your event? Send us a message — we'll reply as soon as we can.",
      contactWa: "Chat on WhatsApp",
      fName: "Name",
      fEmail: "E-mail",
      fMsg: "Message",
      fSend: "Send message",
      rights: "All rights reserved",
      by: "Site by",
    },
  };

  /* img: null renders a placeholder tile instead of borrowing another photo. */
  const MENU = [
    {
      img: "MARGHERITA.png",
      veg: true,
      name: "Margherita",
      pt: "Molho de tomate, mozzarella, tomate cereja, manjericão e parmesão.",
      en: "Tomato sauce, mozzarella, cherry tomato, basil and parmesan.",
    },
    {
      img: "ZUCCHINE.png",
      veg: true,
      name: "Zucchine",
      pt: "Molho de tomate, mozzarella, abobrinha italiana, alho e parmesão.",
      en: "Tomato sauce, mozzarella, Italian zucchini, garlic and parmesan.",
    },
    {
      img: "CAPRESE.png",
      veg: true,
      name: "Caprese",
      pt: "Molho de tomate, mozzarela de búfala, tomate cereja confitado, pesto de azeitonas azapa e manjericão.",
      en: "Tomato sauce, buffalo mozzarella, cherry tomato confit, Azapa olive pesto, and basil.",
    },
    {
      img: "CALABRIA.png",
      veg: false,
      name: "Calabria",
      pt: "Molho de tomate, calabresa defumada, cebola roxa, mozzarella e orégano.",
      en: "Tomato sauce, smoked calabrian sausage, red onion, mozzarella, and oregano.",
    },
    {
      img: "VEGANA.png",
      veg: true,
      name: "Vegana",
      pt: "Molho de tomate, abobrinha italiana temperadas com alho e orégano, cebola roxa, tomate cereja confitado e pesto de azeitonas azapa.",
      en: "Tomato sauce, Italian zucchini seasoned with garlic and oregano, red onion, cherry tomato confit, and Azapa olive pesto.",
    },
  ];

  const grid = document.getElementById("menu-grid");
  /* Always start in Portuguese; EN is opt-in via the nav toggle. */
  let lang = "pt";

  function renderMenu() {
    const t = COPY[lang];
    let html = "";

    MENU.forEach(function (p) {
      const shot = p.img
        ? '<img src="' + p.img + '" alt="Pizza ' + p.name + '" loading="lazy">'
        : "<span>" + t.photoTodo + " " + p.name + "</span>";
      const tag = p.veg ? '<span class="tag">' + t.vegTag + "</span>" : "";

      html +=
        '<article class="menu__card">' +
        '<div class="menu__shot">' +
        shot +
        "</div>" +
        "<div>" +
        '<div class="menu__name"><h3>' +
        p.name +
        "</h3>" +
        tag +
        "</div>" +
        '<p class="menu__desc">' +
        p[lang] +
        "</p>" +
        "</div>" +
        "</article>";
    });

    /* Fillers occupy the empty slots of the last row (CSS-only safety net). */
    html += '<i class="menu__filler" aria-hidden="true"></i>'.repeat(3);
    grid.innerHTML = html;
    balanceLastRow();
  }

  /* Cards use flex-grow so they fill each row. That makes a lone card on the
     final row wider than the rest, so: measure row one, freeze the last row to
     that width, then offset it by half the leftover space to centre it. */
  function balanceLastRow() {
    const cards = Array.prototype.filter.call(grid.children, function (c) {
      return c.tagName === "ARTICLE";
    });
    if (!cards.length) return;

    cards.forEach(function (c) {
      c.style.marginLeft = "";
      c.style.flex = "";
      c.style.width = "";
    });

    const rows = [];
    cards.forEach(function (c) {
      const row = rows.filter(function (r) {
        return Math.abs(r.top - c.offsetTop) < 4;
      })[0];
      if (row) {
        row.items.push(c);
      } else {
        rows.push({ top: c.offsetTop, items: [c] });
      }
    });
    if (rows.length < 2) return;

    const last = rows[rows.length - 1];
    const perRow = Math.max.apply(
      null,
      rows.map(function (r) {
        return r.items.length;
      }),
    );
    if (last.items.length >= perRow) return;

    const w = rows[0].items[0].getBoundingClientRect().width;
    last.items.forEach(function (c) {
      c.style.flex = "0 0 " + w + "px";
      c.style.width = w + "px";
    });

    const extra = grid.clientWidth + 18 - last.items.length * (w + 18);
    if (extra > 0) last.items[0].style.marginLeft = 9 + extra / 2 + "px";
  }

  function applyLang() {
    const t = COPY[lang];
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const val = t[el.getAttribute("data-i18n")];
      if (val) el.textContent = val;
    });

    document.querySelectorAll(".lang__btn").forEach(function (b) {
      const on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", String(on));
    });

    renderMenu();
  }

  document.querySelectorAll(".lang__btn").forEach(function (b) {
    b.addEventListener("click", function () {
      lang = b.getAttribute("data-lang");
      applyLang();
    });
  });

  window.addEventListener("resize", balanceLastRow);
  window.addEventListener("load", balanceLastRow);
  if (window.ResizeObserver) new ResizeObserver(balanceLastRow).observe(grid);

  applyLang();
})();
