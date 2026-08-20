/* Loopable8 — shared layout: nav, footer, theme, cookie banner,
   newsletter, scroll reveal, FAQ accordions.
   Every page loads this file; page identity comes from <body data-page="...">. */

(function () {
  "use strict";

  var STORE = {
    theme: "lo8_theme",
    cookie: "lo8_cookie_consent",
    news: "lo8_newsletter",
    user: "lo8_user",
    session: "lo8_session"
  };

  /* ---------- Theme (runs first to avoid flash; also inlined in <head>) ---------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORE.theme, theme); } catch (e) {}
  }
  function currentTheme() {
    try {
      var saved = localStorage.getItem(STORE.theme);
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) {}
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  applyTheme(currentTheme());

  /* ---------- Session helpers (shared with auth.js) ---------- */
  window.LO8 = window.LO8 || {};
  LO8.store = STORE;
  LO8.getUser = function () {
    try {
      if (!localStorage.getItem(STORE.session)) return null;
      var raw = localStorage.getItem(STORE.user);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  };
  // Only builds that actually exist. This list drives the dashboard and the
  // download history, so an invented entry becomes a download nobody can get.
  LO8.releases = [
    { ver: "1.0.0", date: "2026-07-24", size: "19.1 MB", note: "First public release for Windows", latest: true }
  ];

  /* ---------- Nav ---------- */
  var page = document.body.getAttribute("data-page") || "";
  var user = LO8.getUser();

  var navLinks = [
    { href: "features.html", key: "features", label: "Features" },
    // Pricing is hidden pre-launch: nothing can be purchased until the
    // payment provider is live, so a price list only raises a question
    // we cannot answer yet. Restore this line when checkout works.
    // Absolute, not relative: the app lives in its own directory, so
    // "design/" resolves differently depending on which page the nav is on.
    { href: "/design/", key: "design", label: "Design" },
    { href: "docs.html", key: "docs", label: "Docs" },
    { href: "blog.html", key: "blog", label: "Blog" },
    { href: "changelog.html", key: "changelog", label: "Changelog" }
  ];

  var linksHtml = navLinks.map(function (l) {
    var cur = l.key === page ? ' aria-current="page"' : "";
    return '<li><a href="' + l.href + '"' + cur + ">" + l.label + "</a></li>";
  }).join("");

  var accountHtml = user
    ? '<a href="dashboard.html" class="nav-signin">' + escapeHtml(firstName(user.name)) + '</a>' +
      '<a href="dashboard.html" class="btn btn-primary">Dashboard</a>'
    : '<a href="signin.html" class="nav-signin">Sign in</a>' +
      '<a href="download.html" class="btn btn-primary">Download</a>';

  var navEl = document.createElement("nav");
  navEl.className = "nav";
  navEl.id = "nav";
  navEl.setAttribute("aria-label", "Main");
  navEl.innerHTML =
    '<div class="container nav-inner">' +
      '<a href="index.html" class="nav-logo" aria-label="Loopable8 home">' +
        '<svg class="logo-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/></svg>Loopable8</a>' +
      '<ul class="nav-links" id="navLinks">' + linksHtml + "</ul>" +
      '<div class="nav-cta">' +
        '<button class="theme-toggle" id="themeToggle" aria-label="Toggle dark or light theme">' +
          '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>' +
          '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
        "</button>" +
        accountHtml +
        '<button class="nav-burger" id="navBurger" aria-label="Toggle menu" aria-expanded="false">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>' +
        "</button>" +
      "</div>" +
    "</div>";

  var shell = document.querySelector(".shell");
  shell.insertBefore(navEl, shell.firstChild);

  /* ---------- Footer ---------- */
  var year = new Date().getFullYear();
  var footerEl = document.createElement("footer");
  footerEl.className = "footer";
  footerEl.innerHTML =
    '<div class="container">' +
      '<div class="footer-grid">' +
        '<div class="footer-brand">' +
          '<a href="index.html" class="nav-logo"><svg class="logo-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/></svg>Loopable8</a>' +
          "<p>The AI coding assistant built to ship — with an expanding studio for chat, media generation and game development.</p>" +
          '<div class="socials" aria-label="Social links">' +
            '<a href="https://github.com/loopable8" aria-label="GitHub" rel="noopener" target="_blank"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.11-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.14c0 .3.2.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg></a>' +
            '<a href="https://x.com/loopable8" aria-label="X (Twitter)" rel="noopener" target="_blank"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z"/></svg></a>' +
            '<a href="https://youtube.com/@loopable8" aria-label="YouTube" rel="noopener" target="_blank"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z"/></svg></a>' +
            '<a href="https://discord.gg/loopable8" aria-label="Discord" rel="noopener" target="_blank"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.32 4.37a19.8 19.8 0 0 0-4.93-1.51 13.78 13.78 0 0 0-.64 1.29 18.27 18.27 0 0 0-5.5 0 12.64 12.64 0 0 0-.64-1.29 19.74 19.74 0 0 0-4.93 1.51C.53 9.05-.32 13.58.1 18.06a19.9 19.9 0 0 0 6.07 3.03c.49-.66.93-1.37 1.3-2.1a12.88 12.88 0 0 1-2.05-.98c.17-.12.34-.25.5-.38a14.2 14.2 0 0 0 12.17 0c.16.13.33.26.5.38-.65.39-1.34.72-2.06.98.37.73.8 1.44 1.3 2.1a19.84 19.84 0 0 0 6.07-3.03c.5-5.18-.84-9.67-3.58-13.69ZM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.95-2.42 2.16-2.42 1.21 0 2.18 1.09 2.16 2.42 0 1.34-.95 2.42-2.16 2.42Zm7.96 0c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.95-2.42 2.16-2.42 1.21 0 2.18 1.09 2.16 2.42 0 1.34-.95 2.42-2.16 2.42Z"/></svg></a>' +
          "</div>" +
        "</div>" +
        "<div><h4>Product</h4><ul>" +
          '<li><a href="features.html">Features</a></li>' +
          '<li><a href="download.html">Download</a></li>' +
          '<li><a href="changelog.html">Changelog</a></li>' +
          '<li><a href="features.html#roadmap">Roadmap</a></li>' +
        "</ul></div>" +
        "<div><h4>Resources</h4><ul>" +
          '<li><a href="docs.html">Documentation</a></li>' +
          '<li><a href="blog.html">Blog</a></li>' +
          '<li><a href="faq.html">FAQ</a></li>' +
          '<li><a href="contact.html">Support</a></li>' +
          '<li><a href="license.html">License</a></li>' +
        "</ul></div>" +
        '<div class="footer-news"><h4>Company</h4><ul>' +
          '<li><a href="about.html">About</a></li>' +
          '<li><a href="contact.html">Contact</a></li>' +
        "</ul>" +
        "<h4>Stay in the loop</h4>" +
        '<form class="newsletter-form" data-newsletter novalidate>' +
          '<label class="sr-only" for="footerEmail" style="position:absolute;left:-9999px">Email address</label>' +
          '<input class="input" id="footerEmail" type="email" name="email" placeholder="you@email.com" autocomplete="email" required />' +
          '<button class="btn btn-primary" type="submit">Subscribe</button>' +
        "</form>" +
        '<p class="newsletter-msg" data-newsletter-msg></p>' +
        "</div>" +
      "</div>" +
      '<div class="footer-bottom">' +
        "<span>© " + year + " Loopable8 Studio. All rights reserved.</span>" +
        '<div class="footer-legal">' +
          '<a href="privacy.html">Privacy</a>' +
          '<a href="terms.html">Terms</a>' +
          '<a href="refund.html">Refunds</a>' +
          '<a href="cookies.html">Cookies</a>' +
          '<a href="license.html">License</a>' +
        "</div>" +
        '<span class="footer-status"><i class="dot" aria-hidden="true"></i> all systems operational</span>' +
      "</div>" +
    "</div>";
  shell.appendChild(footerEl);

  /* ---------- Nav behavior ---------- */
  var nav = navEl;
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 12); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var burger = document.getElementById("navBurger");
  var links = document.getElementById("navLinks");
  burger.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  document.getElementById("themeToggle").addEventListener("click", function () {
    applyTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
  });

  /* ---------- Scroll reveal ---------- */
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- FAQ accordions ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var answer = item.querySelector(".faq-a");
    if (!btn || !answer) return;
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      var group = item.closest("[data-faq-group]") || document;
      group.querySelectorAll(".faq-item.open").forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".faq-a").style.maxHeight = null;
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Newsletter (all forms with data-newsletter) ---------- */
  document.querySelectorAll("[data-newsletter]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var msg = form.parentElement.querySelector("[data-newsletter-msg]") || form.querySelector("[data-newsletter-msg]");
      var email = (input.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (msg) { msg.textContent = "Please enter a valid email address."; msg.className = "newsletter-msg err"; }
        input.focus();
        return;
      }
      try {
        var list = JSON.parse(localStorage.getItem(STORE.news) || "[]");
        if (list.indexOf(email) === -1) list.push(email);
        localStorage.setItem(STORE.news, JSON.stringify(list));
      } catch (err) {}
      form.reset();
      if (msg) { msg.textContent = "You're in! We'll email you when something ships."; msg.className = "newsletter-msg ok"; }
    });
  });

  /* ---------- Cookie banner ---------- */
  var consent = null;
  try { consent = localStorage.getItem(STORE.cookie); } catch (e) {}
  if (!consent) {
    var banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.innerHTML =
      "<h4>We value your privacy</h4>" +
      '<p>Loopable8 uses essential local storage to remember your theme and session. No tracking cookies, ever. Read our <a href="cookies.html">Cookie Policy</a>.</p>' +
      '<div class="cookie-actions">' +
        '<button class="btn btn-primary" data-cookie="accepted">Accept</button>' +
        '<button class="btn btn-ghost" data-cookie="essential">Essential only</button>' +
      "</div>";
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add("show"); });
    banner.addEventListener("click", function (e) {
      var choice = e.target.getAttribute && e.target.getAttribute("data-cookie");
      if (!choice) return;
      try { localStorage.setItem(STORE.cookie, choice); } catch (err) {}
      banner.remove();
    });
  }

  /* ---------- Utils ---------- */
  function firstName(name) { return String(name || "").split(" ")[0] || "Account"; }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  LO8.escapeHtml = escapeHtml;
})();

/* Copy-to-clipboard for the terminal install commands.
   The async Clipboard API is denied outright in some contexts (permission
   policy, non-secure origins), and a silent rejection would leave the button
   doing nothing at all -- so every failure falls back, and the last resort
   selects the text so the user can still press Ctrl+C. */
document.addEventListener("click", function (e) {
  var btn = e.target.closest && e.target.closest(".term-copy");
  if (!btn) return;
  var el = document.getElementById(btn.getAttribute("data-copy"));
  if (!el) return;

  var flash = function (label) {
    var old = btn.getAttribute("data-label") || btn.textContent;
    btn.setAttribute("data-label", old);
    btn.textContent = label;
    setTimeout(function () { btn.textContent = old; }, 1600);
  };

  var selectText = function () {
    var r = document.createRange();
    r.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
  };

  var legacyCopy = function () {
    try {
      selectText();
      var ok = document.execCommand("copy");
      window.getSelection().removeAllRanges();
      return ok;
    } catch (err) { return false; }
  };

  var done = function () { flash("Copied"); };
  var failed = function () {
    // Nothing could write to the clipboard: leave the command selected and
    // say so, rather than pretending the click did something.
    selectText();
    flash("Press Ctrl+C");
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(el.textContent).then(done, function () {
      if (legacyCopy()) { done(); } else { failed(); }
    });
  } else if (legacyCopy()) {
    done();
  } else {
    failed();
  }
});
