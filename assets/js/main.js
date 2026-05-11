/* =============================================
   ESTOFARIA CARIOCA — main.js
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Navbar scroll ──────────────────────── */
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  /* ── Active link ────────────────────────── */
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .nav-drawer-links a').forEach(function (a) {
    var h = a.getAttribute('href') || '';
    if (h === page || h.endsWith('/' + page)) a.classList.add('active');
  });

  /* ── Mobile Drawer ──────────────────────── */
  var hamburger = document.querySelector('.hamburger');
  var drawer = document.querySelector('.nav-drawer');
  var overlay = document.querySelector('.nav-drawer-overlay');
  var drawerClose = document.querySelector('.nav-drawer-close');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    overlay && overlay.classList.add('open');
    hamburger && hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    overlay && overlay.classList.remove('open');
    hamburger && hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger && hamburger.addEventListener('click', openDrawer);
  drawerClose && drawerClose.addEventListener('click', closeDrawer);
  overlay && overlay.addEventListener('click', closeDrawer);
  drawer && drawer.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeDrawer);
  });

  /* ── Testimonial Slider ─────────────────── */
  var track = document.querySelector('.testimonials-track');
  if (track) {
    var slides = track.querySelectorAll('.testimonial-card');
    var dots = document.querySelectorAll('.testimonial-dot');
    var current = 0;
    var total = slides.length;
    var timer;

    function goTo(n) {
      current = ((n % total) + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }
    function startAuto() { timer = setInterval(function () { goTo(current + 1); }, 5800); }
    function resetAuto() { clearInterval(timer); startAuto(); }

    var prev = document.querySelector('.testimonial-prev');
    var next = document.querySelector('.testimonial-next');
    prev && prev.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    next && next.addEventListener('click', function () { goTo(current + 1); resetAuto(); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); resetAuto(); }); });

    goTo(0); startAuto();
  }

  /* ── Counters ───────────────────────────── */
  var counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.dataset.target, 10);
        var suffix = el.dataset.suffix || '';
        var start = 0;
        var step = target / (1500 / 16);
        var t = setInterval(function () {
          start += step;
          if (start >= target) { start = target; clearInterval(t); }
          el.textContent = Math.floor(start) + suffix;
        }, 16);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 }).observe && counters.forEach(function (el) {
      var obs = new IntersectionObserver(function (entries, o) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var target = parseInt(el.dataset.target, 10);
          var suffix = el.dataset.suffix || '';
          var start = 0;
          var step = target / (1500 / 16);
          var t = setInterval(function () {
            start += step;
            if (start >= target) { start = target; clearInterval(t); }
            el.textContent = Math.floor(start) + suffix;
          }, 16);
          o.unobserve(el);
        });
      }, { threshold: 0.5 });
      obs.observe(el);
    });
  }

  /* ── Fade-in on scroll ──────────────────── */
  var fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    var fadeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); fadeObs.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    fadeEls.forEach(function (el) { fadeObs.observe(el); });
  }

  /* ── Shop Filter ────────────────────────── */
  document.querySelectorAll('.filter-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.filter-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var cat = tab.dataset.filter;
      document.querySelectorAll('.product-card[data-category]').forEach(function (c) {
        c.style.display = (cat === 'all' || c.dataset.category === cat) ? '' : 'none';
      });
    });
  });

  /* ── Contact form ───────────────────────── */
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type=submit]');
      var orig = btn.textContent;
      btn.textContent = '✓ Mensagem enviada!';
      btn.disabled = true;
      btn.style.background = '#2f6b50';
      setTimeout(function () {
        btn.textContent = orig;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3500);
    });
  }

  /* ── Lightbox ───────────────────────────── */
  var lb = document.querySelector('.lightbox');
  if (!lb) return;

  var lbImg = lb.querySelector('.lightbox-img');
  var lbCaption = lb.querySelector('.lightbox-caption');
  var lbClose = lb.querySelector('.lightbox-close');
  var lbPrev = lb.querySelector('.lb-prev');
  var lbNext = lb.querySelector('.lb-next');
  var lbDots = lb.querySelectorAll('.lb-dot');

  var items = [];
  var lbCurrent = 0;

  document.querySelectorAll('.portfolio-item[data-src]').forEach(function (el, i) {
    items.push({ src: el.dataset.src, caption: el.dataset.caption || '' });
    el.addEventListener('click', function () { openLb(i); });
  });

  function openLb(index) {
    lbCurrent = index;
    updateLb();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function updateLb() {
    lbImg.src = items[lbCurrent].src;
    if (lbCaption) lbCaption.textContent = items[lbCurrent].caption;
    lbDots.forEach(function (d, i) { d.classList.toggle('active', i === lbCurrent); });
  }
  function prevLb() { lbCurrent = ((lbCurrent - 1) + items.length) % items.length; updateLb(); }
  function nextLb() { lbCurrent = (lbCurrent + 1) % items.length; updateLb(); }

  lbClose && lbClose.addEventListener('click', closeLb);
  lbPrev && lbPrev.addEventListener('click', prevLb);
  lbNext && lbNext.addEventListener('click', nextLb);
  lbDots.forEach(function (d, i) { d.addEventListener('click', function () { lbCurrent = i; updateLb(); }); });

  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') prevLb();
    if (e.key === 'ArrowRight') nextLb();
  });

});
