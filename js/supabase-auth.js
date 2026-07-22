// ── Real authentication for the website (Supabase) ────────────────────────
//
// Replaces the old localStorage "demo" auth. Sign in / sign up / OAuth all go
// through the SAME Supabase project the desktop app uses, so a web account and
// an app account are the same account.
//
// The URL and publishable key are PUBLIC by design — the publishable key is a
// client key gated by row-level security, identical to the one shipped in the
// desktop app. Nothing secret lives here.
//
// Google and GitHub are already enabled as providers in the Supabase project
// (the app offers both). For them to work on the WEB, the deployed site URL —
// and http://localhost:8791 for local testing — must be added under
// Supabase → Authentication → URL Configuration → Redirect URLs. Until then
// OAuth returns "redirect not allowed" and the button says so.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ggatheckmdmoueaczpth.supabase.co";
const SUPABASE_KEY = "sb_publishable_XnSVpzz3zWksryi58tPIag_bOC9MGuW";

const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, detectSessionInUrl: true, flowType: "pkce" },
});

// Where OAuth / email confirmation returns to. Resolved RELATIVE to the current
// page, not from location.origin — so it stays correct whether the site is
// served from a domain root (foxzyduckzy.github.io) or a project subpath
// (foxzyduckzy.github.io/loopable8-website/). origin+"/dashboard.html" would
// drop the subpath and break the round-trip on a project Pages site.
const REDIRECT = new URL("dashboard.html", location.href).href;

// ── small DOM helpers ──────────────────────────────────────────────
function boxMsg(sel, text, ok) {
  const el = document.querySelector(sel);
  if (!el) return;
  el.textContent = text;
  el.style.display = text ? "block" : "none";
  el.classList.toggle("ok", !!ok);
}
function setBusy(btn, busy, idle) {
  if (!btn) return;
  btn.disabled = busy;
  btn.dataset.idle = btn.dataset.idle || idle || btn.textContent;
  btn.textContent = busy ? "Please wait…" : btn.dataset.idle;
}
function friendly(err) {
  const m = (err && err.message) || String(err || "Something went wrong.");
  if (/redirect/i.test(m)) {
    return "This site's URL isn't allow-listed for sign-in yet. Add it under " +
      "Supabase → Authentication → Redirect URLs.";
  }
  return m;
}

// Password show/hide (was in the old auth.js; ported so nothing regresses).
document.querySelectorAll(".pw-toggle").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const input = btn.parentElement.querySelector("input");
    if (!input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.textContent = show ? "Hide" : "Show";
    btn.setAttribute("aria-pressed", String(show));
  });
});

// ── OAuth buttons (Google / GitHub) ────────────────────────────────
document.querySelectorAll("[data-oauth]").forEach(function (btn) {
  btn.addEventListener("click", async function () {
    const provider = btn.getAttribute("data-oauth");
    setBusy(btn, true);
    const { error } = await sb.auth.signInWithOAuth({
      provider,
      options: { redirectTo: REDIRECT },
    });
    if (error) {
      setBusy(btn, false);
      boxMsg("#signinError", friendly(error));
      boxMsg("#signupError", friendly(error));
    }
    // On success the browser navigates to the provider; nothing else to do.
  });
});

// ── Sign up ────────────────────────────────────────────────────────
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    boxMsg("#signupError", "");
    const name = (document.getElementById("suName") || {}).value?.trim() || "";
    const email = (document.getElementById("suEmail").value || "").trim();
    const pw = document.getElementById("suPassword").value;
    const terms = document.getElementById("suTerms").checked;
    if (name.length < 2) return boxMsg("#signupError", "Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return boxMsg("#signupError", "Please enter a valid email address.");
    if (pw.length < 8)
      return boxMsg("#signupError", "Password must be at least 8 characters.");
    if (!terms)
      return boxMsg("#signupError", "Please accept the terms to continue.");

    const btn = signupForm.querySelector('button[type="submit"]');
    setBusy(btn, true, "Create account");
    const { data, error } = await sb.auth.signUp({
      email,
      password: pw,
      options: { data: { full_name: name }, emailRedirectTo: REDIRECT },
    });
    setBusy(btn, false);
    if (error) return boxMsg("#signupError", friendly(error));

    // If email confirmation is on, there's no session yet — tell them to check
    // their inbox. If it's off, they're signed in and we go to the dashboard.
    if (data.session) {
      location.href = "dashboard.html";
    } else {
      boxMsg(
        "#signupError",
        "Account created. Check your email to confirm, then sign in. " +
          "Your plan is chosen and paid inside the app.",
        true,
      );
    }
  });
}

// ── Sign in ────────────────────────────────────────────────────────
const signinForm = document.getElementById("signinForm");
if (signinForm) {
  signinForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    boxMsg("#signinError", "");
    const email = (document.getElementById("siEmail").value || "").trim();
    const pw = document.getElementById("siPassword").value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return boxMsg("#signinError", "Please enter a valid email address.");

    const btn = signinForm.querySelector('button[type="submit"]');
    setBusy(btn, true, "Sign in");
    const { error } = await sb.auth.signInWithPassword({ email, password: pw });
    setBusy(btn, false);
    if (error) {
      return boxMsg(
        "#signinError",
        /invalid/i.test(error.message)
          ? "Wrong email or password."
          : friendly(error),
      );
    }
    location.href = "dashboard.html";
  });
}

// ── Dashboard (gated on a REAL session) ────────────────────────────
const dashRoot = document.getElementById("dashRoot");
if (dashRoot) {
  (async function () {
    // detectSessionInUrl already consumed an OAuth/confirmation callback hash.
    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
      location.replace("signin.html");
      return;
    }
    const user = session.user;
    const meta = user.user_metadata || {};
    const name = (meta.full_name || meta.name || user.email || "there").split(
      " ",
    )[0];
    const fill = function (attr, val) {
      document.querySelectorAll("[" + attr + "]").forEach(function (el) {
        el.textContent = val;
      });
    };
    fill("data-user-name", name);
    fill("data-user-email", user.email || "");
    if (user.created_at) {
      fill(
        "data-user-since",
        new Date(user.created_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      );
    }

    // Plan comes from the profiles row (the only place entitlement lives).
    try {
      const { data: prof } = await sb
        .from("profiles")
        .select("plan, plan_status")
        .eq("id", user.id)
        .maybeSingle();
      const active = prof && prof.plan_status === "active" && prof.plan !== "free";
      const label = active
        ? prof.plan.charAt(0).toUpperCase() + prof.plan.slice(1)
        : "Free";
      fill("data-user-plan", label);
    } catch (_) {
      fill("data-user-plan", "Free");
    }

    // The old fake "license key" has no real analogue — entitlement is
    // server-side. Show the account id, which IS a real, stable identifier.
    fill("data-license", user.id);

    const latest = (window.LO8 && LO8.releases ? LO8.releases[0] : null);
    if (latest) fill("data-latest-ver", "v" + latest.ver);

    const out = document.getElementById("signOut");
    if (out) {
      out.addEventListener("click", async function () {
        await sb.auth.signOut();
        location.href = "signin.html";
      });
    }
  })();
}
