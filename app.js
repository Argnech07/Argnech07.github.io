/* ============================================================
   ABUELA MACHA — interacciones
   ============================================================ */

// ---------- nav: fondo al hacer scroll + menú móvil ----------
const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
const burger = document.getElementById("navBurger");
const scrollBar = document.getElementById("scrollBar");

function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 40);
  const max = document.documentElement.scrollHeight - innerHeight;
  scrollBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.classList.remove("open");
  })
);

// ---------- reveal on scroll ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ---------- contadores ----------
const counterIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1400;
      const t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      counterIO.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll("[data-count]").forEach((el) => counterIO.observe(el));

// ---------- brasas / chiles flotantes ----------
const emberBox = document.getElementById("embers");
const EMBER_ICONS = ["🌶️", "🔥", "🌶️", "✨", "🔥"];
const EMBER_DOTS = ["rgba(255,74,42,.9)", "rgba(255,179,0,.85)", "rgba(232,48,28,.8)"];

function spawnEmber() {
  if (document.hidden) return;
  const e = document.createElement("span");
  e.className = "ember";
  const isIcon = Math.random() < 0.4;
  if (isIcon) {
    e.textContent = EMBER_ICONS[Math.floor(Math.random() * EMBER_ICONS.length)];
    e.style.fontSize = 14 + Math.random() * 20 + "px";
  } else {
    const s = 3 + Math.random() * 5;
    e.style.width = s + "px";
    e.style.height = s + "px";
    e.style.borderRadius = "50%";
    e.style.background = EMBER_DOTS[Math.floor(Math.random() * EMBER_DOTS.length)];
    e.style.boxShadow = "0 0 10px " + e.style.background;
  }
  e.style.left = Math.random() * 100 + "%";
  const dur = 7 + Math.random() * 8;
  e.style.animationDuration = dur + "s";
  emberBox.appendChild(e);
  setTimeout(() => e.remove(), dur * 1000);
}
setInterval(spawnEmber, 700);
for (let i = 0; i < 8; i++) setTimeout(spawnEmber, i * 220);

// ---------- tilt en tarjetas ----------
if (matchMedia("(hover: hover)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (ev) => {
      const r = card.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// ---------- medidor de fuego ----------
const range = document.getElementById("heatRange");
const face = document.getElementById("heatFace");
const level = document.getElementById("heatLevel");
const salsa = document.getElementById("heatSalsa");

const HEAT_LEVELS = {
  1: { face: "😇", level: "Ni me entero", salsa: "Poco Picante 🫑" },
  2: { face: "😌", level: "Apenas cosquillas", salsa: "Macha de Jamaica �" },
  3: { face: "😊", level: "Dulce y coqueta", salsa: "Macha de Fresa 🍓" },
  4: { face: "🙂", level: "Se siente rico", salsa: "Macha de Piña 🍍" },
  5: { face: "😋", level: "Con carácter", salsa: "Macha de Mango 🥭" },
  6: { face: "😮", level: "Ya pica en serio", salsa: "Picante 🌶️" },
  7: { face: "🥵", level: "Me hace sudar", salsa: "Muy Picante 🔥" },
  8: { face: "💀", level: "¡MODO DIABLO!", salsa: "Extra Picante 🚨" },
};

function updateHeat() {
  const v = range.value;
  const h = HEAT_LEVELS[v];
  face.textContent = h.face;
  level.textContent = h.level;
  salsa.textContent = h.salsa;
  face.classList.remove("shake");
  void face.offsetWidth; // reinicia la animación
  face.classList.add("shake");
}
range.addEventListener("input", updateHeat);

// ---------- parallax en la foto de frascos ----------
const showcaseImg = document.getElementById("showcaseImg");
if (showcaseImg) {
  const media = showcaseImg.parentElement;
  function parallax() {
    const r = media.getBoundingClientRect();
    if (r.bottom < -80 || r.top > innerHeight + 80) return;
    const progress = (innerHeight - r.top) / (innerHeight + r.height);
    showcaseImg.style.transform =
      `scale(1.18) translateY(${(progress - 0.5) * 90}px)`;
  }
  addEventListener("scroll", parallax, { passive: true });
  parallax();
}

// ---------- glow que sigue al cursor ----------
const glow = document.getElementById("cursorGlow");
let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; });
(function animateGlow() {
  gx += (tx - gx) * 0.08;
  gy += (ty - gy) * 0.08;
  glow.style.transform = `translate(${gx - 170}px, ${gy - 170}px)`;
  requestAnimationFrame(animateGlow);
})();
