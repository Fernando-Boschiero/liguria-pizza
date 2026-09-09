/* Liguria Pizza — behaviour
   1. PT/EN copy switch
   2. menu cards rendered from data
   3. equalise + centre a short final row of cards
   4. contact form hands off to WhatsApp (no backend needed)
*/
(function () {
  'use strict';

  var WA = '5519989601411';

  var COPY = {
    pt: {
      navCta: 'Mensagem',
      h1: 'Napolitana de Verdade, na Feira de Barão',
      sub: 'Massa de longa fermentação, assada na hora. Pizzas individuais de 22 cm feitas com ingredientes simples e bem escolhidos.',
      heroCta: 'Onde nos encontrar',
      heroCta2: 'Ver o cardápio',
      menuTitle: 'Nossas pizzas',
      menuNote: 'Individuais · 22 cm',
      vegTag: 'Vegetariana',
      photoTodo: 'foto:',
      whereTitle: 'Onde estamos',
      whereKicker: 'Todo sábado',
      whereName: 'Feira de Barão Geraldo',
      whereAddr: '“Praça do Coco”, Barão Geraldo — Campinas, SP',
      whereDay: 'Sábado',
      whereCta: 'Como chegar',
      contactTitle: 'Contato',
      contactBody: 'Quer a Liguria no seu evento? Mande uma mensagem — respondemos o mais breve possível.',
      contactWa: 'Falar no WhatsApp',
      fName: 'Nome',
      fEmail: 'E-mail',
      fMsg: 'Mensagem',
      fSend: 'Enviar mensagem',
      fNote: 'Abre o WhatsApp com sua mensagem pronta para enviar.',
      rights: 'Todos os direitos reservados',
      by: 'Site por'
    },
    en: {
      navCta: 'Message',
      h1: 'Real Neapolitan Pizza, at the Barão Market',
      sub: 'Long-fermented dough, baked to order. Individual 22 cm pizzas made with simple, carefully chosen ingredients.',
      heroCta: 'Where to find us',
      heroCta2: 'See the menu',
      menuTitle: 'Our pizzas',
      menuNote: 'Individual · 22 cm',
      vegTag: 'Vegetarian',
      photoTodo: 'photo:',
      whereTitle: 'Find us',
      whereKicker: 'Every Saturday',
      whereName: 'Barão Geraldo Market',
      whereAddr: '“Praça do Coco”, Barão Geraldo — Campinas, SP',
      whereDay: 'Saturday',
      whereCta: 'Get directions',
      contactTitle: 'Contact',
      contactBody: 'Want Liguria at your event? Send us a message — we reply as soon as we can.',
      contactWa: 'Chat on WhatsApp',
      fName: 'Name',
      fEmail: 'E-mail',
      fMsg: 'Message',
      fSend: 'Send message',
      fNote: 'Opens WhatsApp with your message ready to send.',
      rights: 'All rights reserved',
      by: 'Site by'
    }
  };

  /* img: null renders a placeholder tile instead of borrowing another photo. */
  var MENU = [
    { img: 'MARGHERITA.png', veg: true,  name: 'Margherita',
      pt: 'Molho de tomate, mozzarella, tomate cereja, manjericão e parmesão.',
      en: 'Tomato sauce, mozzarella, cherry tomato, basil and parmesan.' },
    { img: 'ZUCCHINE.png', veg: true, name: 'Zucchine',
      pt: 'Molho de tomate, mozzarella, abobrinha italiana, alho e parmesão.',
      en: 'Tomato sauce, mozzarella, Italian zucchini, garlic and parmesan.' },
    { img: null, veg: false, name: 'Peperoni',
      pt: 'Molho de tomate, mozzarella e peperoni.',
      en: 'Tomato sauce, mozzarella and pepperoni.' },
    { img: 'CALABRIA.png', veg: false, name: 'Calabria',
      pt: 'Molho de tomate, calabresa defumada, cebola roxa, mozzarella e orégano.',
      en: 'Tomato sauce, smoked calabresa, red onion, mozzarella and oregano.' },
    { img: null, veg: true, name: 'Quattro Formaggi',
      pt: 'Molho de tomate, mozzarella, gorgonzola, catupiry e parmesão.',
      en: 'Tomato sauce, mozzarella, gorgonzola, catupiry and parmesan.' }
  ];

  var grid = document.getElementById('menu-grid');
  /* Always start in Portuguese; EN is opt-in via the nav toggle. */
  var lang = 'pt';

  function renderMenu() {
    var t = COPY[lang];
    var html = '';

    MENU.forEach(function (p) {
      var shot = p.img
        ? '<img src="' + p.img + '" alt="Pizza ' + p.name + '" loading="lazy">'
        : '<span>' + t.photoTodo + ' ' + p.name + '</span>';
      var tag = p.veg ? '<span class="tag">' + t.vegTag + '</span>' : '';

      html +=
        '<article class="menu__card">' +
          '<div class="menu__shot">' + shot + '</div>' +
          '<div>' +
            '<div class="menu__name"><h3>' + p.name + '</h3>' + tag + '</div>' +
            '<p class="menu__desc">' + p[lang] + '</p>' +
          '</div>' +
        '</article>';
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
    var cards = Array.prototype.filter.call(grid.children, function (c) {
      return c.tagName === 'ARTICLE';
    });
    if (!cards.length) return;

    cards.forEach(function (c) {
      c.style.marginLeft = '';
      c.style.flex = '';
      c.style.width = '';
    });

    var rows = [];
    cards.forEach(function (c) {
      var row = rows.filter(function (r) { return Math.abs(r.top - c.offsetTop) < 4; })[0];
      if (row) { row.items.push(c); } else { rows.push({ top: c.offsetTop, items: [c] }); }
    });
    if (rows.length < 2) return;

    var last = rows[rows.length - 1];
    var perRow = Math.max.apply(null, rows.map(function (r) { return r.items.length; }));
    if (last.items.length >= perRow) return;

    var w = rows[0].items[0].getBoundingClientRect().width;
    last.items.forEach(function (c) {
      c.style.flex = '0 0 ' + w + 'px';
      c.style.width = w + 'px';
    });

    var extra = (grid.clientWidth + 18) - last.items.length * (w + 18);
    if (extra > 0) last.items[0].style.marginLeft = (9 + extra / 2) + 'px';
  }

  function applyLang() {
    var t = COPY[lang];
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = t[el.getAttribute('data-i18n')];
      if (val) el.textContent = val;
    });

    document.querySelectorAll('.lang__btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });

    renderMenu();
  }

  document.querySelectorAll('.lang__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      lang = b.getAttribute('data-lang');
      applyLang();
    });
  });

  /* No server: bundle the fields into a prefilled WhatsApp message. Swap this
     for a real POST if you ever add a backend or a form service. */
  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target;
    var text =
      'Olá, Liguria! Sou ' + f.nome.value +
      ' (' + f.email.value + ').\n\n' + f.mensagem.value;
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank');
  });

  window.addEventListener('resize', balanceLastRow);
  window.addEventListener('load', balanceLastRow);
  if (window.ResizeObserver) new ResizeObserver(balanceLastRow).observe(grid);

  applyLang();
})();
