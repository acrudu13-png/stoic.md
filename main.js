/* ────────────────────────────────────────────────────────────
   STOIC.MD — behavior layer
   Industrial motion: instant, precise, deterministic.
──────────────────────────────────────────────────────────── */
"use strict";

/* ── 1 · HERO TERMINAL — looping cross-stack compilation ── */
(function heroTerminal() {
  const el = document.getElementById("terminal");
  if (!el) return;

  // [cssClass, text, delayAfterLineMs]
  const SCRIPT = [
    ["t-cmd",  "$ stoic pipeline run --model User --targets dotnet,react", 420],
    ["t-step", "▸ ast.parse        models/user.py", 90],
    ["t-code", "  class <span class=\"t-kw\">User</span>(BaseModel):", 40],
    ["t-code", "      id: UUID", 40],
    ["t-code", "      role: Literal[\"admin\", \"operator\"]", 220],
    ["t-step", "▸ transpile → .NET 8                          12ms", 90],
    ["t-code", "  <span class=\"t-kw\">public sealed record</span> User(Guid Id, Role Role);", 220],
    ["t-step", "▸ transpile → React / TS                       9ms", 90],
    ["t-code", "  <span class=\"t-kw\">interface</span> User { id: string; role: \"admin\" | \"operator\" }", 220],
    ["t-step", "▸ contract.diff    py ⇄ cs ⇄ tsx", 160],
    ["t-dim",  "  fields 3/3 · nullability ✓ · enums ✓ · casing ✓", 160],
    ["t-ok",   "✓ CONVERGENCE VERIFIED — 3 stacks · 1 schema · 0 drift", 1600],
  ];

  const latencyEl = document.getElementById("latency");
  const cycleEl = document.getElementById("cycle-count");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cycle = 1;
  let line = 0;
  let rendered = [];

  function paint(withCaret) {
    el.innerHTML =
      rendered.map(([cls, html]) => `<span class="${cls}">${html}</span>`).join("\n") +
      (withCaret ? '\n<span class="caret"></span>' : "");
  }

  function tick() {
    if (line >= SCRIPT.length) {
      cycle += 1;
      cycleEl.textContent = "CYCLE " + String(cycle).padStart(4, "0");
      latencyEl.textContent = (2 + Math.floor(Math.random() * 6)) + "ms";
      line = 0;
      rendered = [];
      paint(true);
      setTimeout(tick, 500);
      return;
    }
    const [cls, text, delay] = SCRIPT[line];
    rendered.push([cls, text]);
    line += 1;
    paint(line < SCRIPT.length);
    setTimeout(tick, reduced ? 0 : delay);
  }

  tick();
})();

/* ── 2 · SCROLL REVEALS — snap in, no drift ──────────────── */
(function reveals() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
})();

/* ── 3 · ECOSYSTEM — deterministic pipeline tracing ──────── */
(function ecosystem() {
  const svg = document.getElementById("eco-svg");
  if (!svg) return;

  const nodes = [...svg.querySelectorAll(".node")];
  const pipes = [...svg.querySelectorAll(".pipe")];
  const labels = [...svg.querySelectorAll(".pipe-labels text")];
  const packets = [...svg.querySelectorAll(".packet")];
  const readout = document.getElementById("readout-text");

  const DEFAULT_MSG =
    "HOVER OR SELECT A NODE — ONE TOPOLOGY OF MANY. EVERY PIPELINE ROUTES THROUGH THE STOIC CORE, WHATEVER THE STACK.";

  const TRACES = {
    python:
      "PYTHON → CORE · gRPC/PROTOBUF · AI & DATA PLANE EMITS CANONICAL SCHEMAS. MODELS COMPILE DOWNSTREAM WITHOUT MANUAL TRANSLATION.",
    dotnet:
      ".NET → CORE · REST/OPENAPI · ENTERPRISE DOMAIN LOGIC BOUND TO THE SAME CONTRACT REGISTRY. DRIFT REJECTED AT COMMIT TIME.",
    react:
      "CORE → REACT · TYPED SDK · CLIENT CONSUMES GENERATED TSX BINDINGS. UI STATE IS A PURE FUNCTION OF VERIFIED SERVER CONTRACTS.",
    angular:
      "CORE → ANGULAR · SIGNALR/RXJS · REALTIME STREAMS DELIVERED THROUGH THE SAME DETERMINISTIC PIPELINE. ONE SCHEMA, EVERY SURFACE.",
    core:
      "STOIC CORE · ORCHESTRATION · EVERY PIPELINE TERMINATES HERE. AI AGENTS AUDIT EACH TRANSIT — ANY STACK, 0 ARCHITECTURAL DRIFT.",
    anystack:
      "YOUR STACK → CORE · ANY PROTOCOL · JVM, GO, RUST, NODE, PHP — ADAPTERS ARE GENERATED, NOT HANDWRITTEN. THE DISCIPLINE HOLDS FOR ANY RUNTIME.",
  };

  let pinned = null;

  function setActive(name) {
    const active = name || pinned;
    for (const p of pipes) {
      const on = !!active && p.dataset.nodes.split(" ").includes(active);
      p.classList.toggle("active", on);
    }
    for (const l of labels) {
      const on = !!active && l.dataset.nodes.split(" ").includes(active);
      l.classList.toggle("active", on);
    }
    for (const pk of packets) {
      const pipe = svg.querySelector("#" + pk.dataset.pipe);
      pk.classList.toggle("active", !!pipe && pipe.classList.contains("active"));
    }
    for (const n of nodes) {
      const id = n.dataset.node;
      const connected =
        !active ||
        id === active ||
        id === "core" ||
        active === "core" ||
        pipes.some(
          (p) =>
            p.classList.contains("active") &&
            p.dataset.nodes.split(" ").includes(id)
        );
      n.classList.toggle("dimmed", !!active && !connected);
      n.classList.toggle("active", id === active);
    }
    readout.textContent = active ? TRACES[active] : DEFAULT_MSG;
  }

  for (const n of nodes) {
    const id = n.dataset.node;
    n.addEventListener("mouseenter", () => setActive(id));
    n.addEventListener("mouseleave", () => setActive(null));
    n.addEventListener("focus", () => setActive(id));
    n.addEventListener("blur", () => setActive(null));
    n.addEventListener("click", () => {
      pinned = pinned === id ? null : id;
      setActive(pinned);
    });
    n.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pinned = pinned === id ? null : id;
        setActive(pinned);
      }
    });
  }

  setActive(null);
})();

/* ── 4 · PROTOCOL FORM — execute ─────────────────────────── */
(function protocolForm() {
  const form = document.getElementById("protocol-form");
  if (!form) return;
  const status = document.getElementById("form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const domain = form.domain.value.trim();
    const challenge = form.challenge.value.trim();
    const callback = form.callback.value.trim();

    if (!domain || !challenge || !callback || !/^\S+@\S+\.\S+$/.test(callback)) {
      status.textContent = "✗ INPUT REJECTED — ALL FIELDS REQUIRED, CALLBACK MUST BE VALID";
      status.classList.add("error");
      return;
    }

    status.classList.remove("error");
    status.textContent = "▸ TRANSMITTING…";

    // Wire to a real endpoint when available; acknowledgment is immediate by design.
    setTimeout(() => {
      status.textContent = "✓ PROTOCOL RECEIVED — ARCHITECT RESPONSE < 24H";
      form.reset();
    }, 400);
  });
})();
