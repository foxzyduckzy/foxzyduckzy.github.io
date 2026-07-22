/* Loopable8 — demo account system.
   Accounts live only in this browser's localStorage (no server, no real
   credentials). Passwords are lightly encoded, not securely hashed —
   this is a front-end demo of the flow, stated on the auth pages. */

(function () {
  "use strict";

  var S = (window.LO8 && LO8.store) || {
    user: "lo8_user", session: "lo8_session", news: "lo8_newsletter"
  };

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function encode(pw) { return btoa(unescape(encodeURIComponent("lo8:" + pw))); }
  function licenseKey() {
    var block = function () {
      var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", out = "";
      for (var i = 0; i < 4; i++) out += chars[Math.floor(Math.random() * chars.length)];
      return out;
    };
    return "LO8-" + block() + "-" + block() + "-" + block();
  }

  function setError(form, id, show) {
    var field = form.querySelector("#" + id);
    var err = form.querySelector('[data-error-for="' + id + '"]');
    if (field) field.classList.toggle("invalid", !!show);
    if (err) err.classList.toggle("show", !!show);
  }
  function boxMsg(sel, text) {
    var box = document.querySelector(sel);
    if (!box) return;
    box.textContent = text;
    box.classList.add("show");
  }

  /* ---------- Password show/hide ---------- */
  document.querySelectorAll(".pw-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = btn.parentElement.querySelector("input");
      var showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.textContent = showing ? "Show" : "Hide";
      btn.setAttribute("aria-pressed", String(!showing));
    });
  });

  /* ---------- Sign up ---------- */
  var signupForm = document.getElementById("signupForm");
  if (signupForm) {
    // Pre-select plan from ?plan=pro
    var params = new URLSearchParams(location.search);
    var planParam = params.get("plan");
    var planSelect = document.getElementById("suPlan");
    if (planParam && planSelect) {
      var v = planParam.toLowerCase() === "pro" ? "pro" : "free";
      planSelect.value = v;
    }

    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("suName").value.trim();
      var email = document.getElementById("suEmail").value.trim().toLowerCase();
      var pw = document.getElementById("suPassword").value;
      var plan = planSelect ? planSelect.value : "free";
      var terms = document.getElementById("suTerms").checked;

      var ok = true;
      setError(signupForm, "suName", !(name.length >= 2)); ok = ok && name.length >= 2;
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setError(signupForm, "suEmail", !emailOk); ok = ok && emailOk;
      var pwOk = pw.length >= 8;
      setError(signupForm, "suPassword", !pwOk); ok = ok && pwOk;
      setError(signupForm, "suTerms", !terms); ok = ok && terms;
      if (!ok) return;

      var existing = read(S.user);
      if (existing && existing.email === email) {
        boxMsg("#signupError", "An account with this email already exists on this device. Try signing in instead.");
        return;
      }

      var user = {
        name: name,
        email: email,
        pw: encode(pw),
        plan: plan,
        license: licenseKey(),
        created: new Date().toISOString(),
        newsletter: false
      };
      write(S.user, user);
      write(S.session, { email: email, at: Date.now() });
      location.href = "dashboard.html";
    });
  }

  /* ---------- Sign in ---------- */
  var signinForm = document.getElementById("signinForm");
  if (signinForm) {
    signinForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("siEmail").value.trim().toLowerCase();
      var pw = document.getElementById("siPassword").value;

      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setError(signinForm, "siEmail", !emailOk);
      if (!emailOk) return;

      var user = read(S.user);
      if (!user || user.email !== email || user.pw !== encode(pw)) {
        boxMsg("#signinError", "No matching account on this device. Check your email and password, or create an account.");
        return;
      }
      write(S.session, { email: email, at: Date.now() });
      location.href = "dashboard.html";
    });
  }

  /* ---------- Dashboard ---------- */
  var dashRoot = document.getElementById("dashRoot");
  if (dashRoot) {
    var user = read(S.user);
    var session = read(S.session);
    if (!user || !session) {
      location.replace("signin.html");
      return;
    }

    // Fill identity
    document.querySelectorAll("[data-user-name]").forEach(function (el) { el.textContent = user.name.split(" ")[0]; });
    document.querySelectorAll("[data-user-email]").forEach(function (el) { el.textContent = user.email; });
    var planName = user.plan === "pro" ? "Pro (early access)" : "Free";
    document.querySelectorAll("[data-user-plan]").forEach(function (el) { el.textContent = planName; });
    var since = new Date(user.created);
    document.querySelectorAll("[data-user-since]").forEach(function (el) {
      el.textContent = since.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    });
    var keyEl = document.querySelector("[data-license]");
    if (keyEl) keyEl.textContent = user.license;

    // Latest release info
    var latest = (LO8.releases || [])[0];
    if (latest) {
      document.querySelectorAll("[data-latest-ver]").forEach(function (el) { el.textContent = "v" + latest.ver; });
    }

    // Copy license
    var copyBtn = document.getElementById("copyLicense");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var done = function () {
          copyBtn.textContent = "Copied!";
          setTimeout(function () { copyBtn.textContent = "Copy"; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(user.license).then(done, done);
        } else { done(); }
      });
    }

    // Downloads list
    var dlList = document.getElementById("dashDownloads");
    if (dlList && LO8.releases) {
      dlList.innerHTML = LO8.releases.slice(0, 4).map(function (r) {
        return '<div class="dl-row">' +
          "<div><b>Loopable8 " + r.ver + "</b> " + (r.latest ? '<span class="badge badge-live">Latest</span>' : "") +
          '<div class="mono">' + r.date + " · Windows x64 · " + r.size + "</div></div>" +
          '<a class="btn btn-ghost btn-sm" href="download.html">Download</a>' +
        "</div>";
      }).join("");
    }

    // Newsletter switch
    var newsSwitch = document.getElementById("dashNewsletter");
    if (newsSwitch) {
      newsSwitch.checked = !!user.newsletter;
      newsSwitch.addEventListener("change", function () {
        user.newsletter = newsSwitch.checked;
        write(S.user, user);
        try {
          var list = JSON.parse(localStorage.getItem(S.news) || "[]");
          var idx = list.indexOf(user.email);
          if (user.newsletter && idx === -1) list.push(user.email);
          if (!user.newsletter && idx !== -1) list.splice(idx, 1);
          localStorage.setItem(S.news, JSON.stringify(list));
        } catch (e) {}
      });
    }

    // Theme pref switch mirrors current theme
    var themeSwitch = document.getElementById("dashTheme");
    if (themeSwitch) {
      themeSwitch.checked = document.documentElement.getAttribute("data-theme") === "light";
      themeSwitch.addEventListener("change", function () {
        var t = themeSwitch.checked ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", t);
        try { localStorage.setItem(S.theme || "lo8_theme", t); } catch (e) {}
      });
    }

    // Sign out
    var signout = document.getElementById("signOut");
    if (signout) {
      signout.addEventListener("click", function () {
        try { localStorage.removeItem(S.session); } catch (e) {}
        location.href = "index.html";
      });
    }

    // Delete account (destructive → confirm)
    var del = document.getElementById("deleteAccount");
    if (del) {
      del.addEventListener("click", function () {
        if (!confirm("Delete your local Loopable8 account? This removes the demo account and license key stored in this browser.")) return;
        try {
          localStorage.removeItem(S.user);
          localStorage.removeItem(S.session);
        } catch (e) {}
        location.href = "index.html";
      });
    }
  }

  /* ---------- Contact form ---------- */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("cName").value.trim();
      var email = document.getElementById("cEmail").value.trim();
      var topic = document.getElementById("cTopic").value;
      var msg = document.getElementById("cMessage").value.trim();

      var ok = true;
      setError(contactForm, "cName", name.length < 2); ok = ok && name.length >= 2;
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setError(contactForm, "cEmail", !emailOk); ok = ok && emailOk;
      setError(contactForm, "cMessage", msg.length < 10); ok = ok && msg.length >= 10;
      if (!ok) return;

      try {
        var inbox = JSON.parse(localStorage.getItem("lo8_contact_msgs") || "[]");
        inbox.push({ name: name, email: email, topic: topic, msg: msg, at: new Date().toISOString() });
        localStorage.setItem("lo8_contact_msgs", JSON.stringify(inbox));
      } catch (err) {}

      contactForm.reset();
      var success = document.getElementById("contactSuccess");
      if (success) {
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
})();
