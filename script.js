const canvas = document.querySelector("#dreamscape");
const ctx = canvas.getContext("2d");
const glow = document.querySelector(".cursor-glow");
const tooltip = document.querySelector("#skillTooltip");
const projectDetails = document.querySelector("#projectDetails");
const terminalInput = document.querySelector("#terminalInput");
const terminalOutput = document.querySelector("#terminalOutput");

const projects = {
  asl: {
    kicker: "Accessibility + AI",
    title: "ASL Gesture Detection",
    summary: "A real-time gesture detection project focused on accessibility and human-computer interaction.",
    problem: "Communication tools are not always inclusive for people who rely on sign language.",
    system: "Camera input, hand landmarks, classification logic, and real-time feedback to recognize gestures.",
    impact: "Shows how AI can be used for access, expression, and meaningful user support."
  },
  mcp: {
    kicker: "AI Agents",
    title: "WhatsApp MCP Agent",
    summary: "An automation experiment that connects messages, tools, and agent-style workflows.",
    problem: "Communication tasks can become repetitive when information is spread across tools and conversations.",
    system: "A workflow where an agent can interpret messages, use tools, and support useful actions.",
    impact: "Demonstrates curiosity in practical AI agents, automation, and intelligent communication systems."
  },
  weather: {
    kicker: "API + UI",
    title: "Weather App",
    summary: "A clean weather interface built around live API data and simple visual condition states.",
    problem: "Weather data is common, but the interface should quickly show what matters.",
    system: "API integration, city search, responsive layout, and clear condition-based presentation.",
    impact: "Shows UI thinking, API usage, and the ability to make a small product feel polished."
  }
};

const terminalResponses = {
  skills: "AI, ML, Python, APIs, SQL, LLM agents, MCP workflows, creative UI, leadership, and event coordination.",
  projects: "Selected projects: ASL Gesture Detection, WhatsApp MCP Agent, and Weather App.",
  leadership: "Leadership includes sessions, workshops, hackathons, SmartIDEAthon support, logistics, and team coordination.",
  contact: "Email: dgajjala576@gmail.com | LinkedIn: https://www.linkedin.com/in/deekshitha-gajjala-658530292/ | Phone: +91-7396413329",
  resume: "Open the Resume button in the top navigation or hero section to view the PDF.",
  help: "Available commands: skills, projects, leadership, contact, resume."
};

let width = 0;
let height = 0;
let particles = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let lastScrollY = window.scrollY;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = canvas.width = window.innerWidth * ratio;
  height = canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  particles = Array.from({ length: Math.min(48, Math.floor(window.innerWidth / 28)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: (Math.random() * 1.25 + 0.35) * ratio,
    vx: (Math.random() - 0.5) * 0.1 * ratio,
    vy: (Math.random() - 0.5) * 0.1 * ratio,
    a: Math.random() * 0.25 + 0.08
  }));
}

function drawDreamscape() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle, index) => {
    const dx = particle.x - mouse.x * window.devicePixelRatio;
    const dy = particle.y - mouse.y * window.devicePixelRatio;
    const distance = Math.hypot(dx, dy);

    if (distance < 130 * window.devicePixelRatio) {
      particle.x += dx * 0.0018;
      particle.y += dy * 0.0018;
    }

    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 121, 198, ${particle.a})`;
    ctx.fill();

    for (let j = index + 1; j < particles.length; j += 1) {
      const other = particles[j];
      const linkDistance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (linkDistance < 86 * window.devicePixelRatio) {
        ctx.strokeStyle = `rgba(255, 79, 163, ${0.055 - linkDistance / (1900 * window.devicePixelRatio)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawDreamscape);
}

function typeHeroLine() {
  const line = document.querySelector("[data-typewriter]");
  const text = line.dataset.typewriter;
  let index = 0;
  line.textContent = "";

  const timer = setInterval(() => {
    line.textContent = text.slice(0, index);
    index += 1;
    if (index > text.length) clearInterval(timer);
  }, 42);
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.classList.contains("stat-panel")) animateCount(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
}

function animateCount(panel) {
  const span = panel.querySelector("[data-count]");
  if (!span || span.dataset.done) return;

  span.dataset.done = "true";
  const target = Number(span.dataset.count);
  let current = 0;

  const tick = () => {
    current += Math.max(1, Math.ceil(target / 28));
    span.textContent = current >= target ? `${target}+` : current;
    if (current < target) requestAnimationFrame(tick);
  };

  tick();
}

function openProject(key) {
  const project = projects[key];
  document.querySelector("#projectKicker").textContent = project.kicker;
  document.querySelector("#projectTitle").textContent = project.title;
  document.querySelector("#projectSummary").textContent = project.summary;
  document.querySelector("#projectProblem").textContent = project.problem;
  document.querySelector("#projectSystem").textContent = project.system;
  document.querySelector("#projectImpact").textContent = project.impact;
  projectDetails.classList.add("open");
}

function addTerminalLine(text) {
  const line = document.createElement("p");
  line.textContent = text;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function runTerminalCommand(value) {
  const command = value.trim().toLowerCase();
  if (!command) return;
  addTerminalLine(`> ${command}`);
  addTerminalLine(terminalResponses[command] || "Command not found. Try help.");
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 90) {
    header.classList.add("hidden");
  } else {
    header.classList.remove("hidden");
  }

  lastScrollY = currentScrollY;
});
window.addEventListener("pointermove", event => {
  mouse = { x: event.clientX, y: event.clientY };
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

document.querySelectorAll("[data-skill]").forEach(node => {
  node.addEventListener("pointerenter", () => {
    document.querySelectorAll("[data-skill]").forEach(item => item.classList.remove("active"));
    node.classList.add("active");
    tooltip.textContent = node.dataset.skill;
  });
  node.addEventListener("focus", () => {
    document.querySelectorAll("[data-skill]").forEach(item => item.classList.remove("active"));
    node.classList.add("active");
    tooltip.textContent = node.dataset.skill;
  });
});

document.querySelectorAll("[data-project]").forEach(card => {
  card.querySelector("button").addEventListener("click", () => openProject(card.dataset.project));
});

document.querySelector("#closeProject").addEventListener("click", () => projectDetails.classList.remove("open"));

terminalInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    runTerminalCommand(terminalInput.value);
    terminalInput.value = "";
  }
});

resizeCanvas();
drawDreamscape();
typeHeroLine();
revealOnScroll();
