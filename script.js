const enterScreen = document.querySelector("#enterScreen");
const enterButton = document.querySelector("#enterButton");
const cursor = document.querySelector(".leaf-cursor");
const cursorArt = document.querySelector(".leaf-cursor-art");
const copyEmail = document.querySelector("#copyEmail");
const terminal = document.querySelector("#terminal");
const terminalInput = document.querySelector("#terminalInput");
const terminalOutput = document.querySelector("#terminalOutput");
const curiousButton = document.querySelector("#curiousButton");
const certificateDialog = document.querySelector("#certificateDialog");
const certificateImage = document.querySelector("#certificateImage");

const certificateMap = {
  junior: {
    src: "assets/cert-junior.jpg",
    alt: "人工智能训练师初级证书原图",
  },
  advanced: {
    src: "assets/cert-advanced.jpg",
    alt: "人工智能训练师高级证书原图",
  },
  aiIntro: {
    src: "assets/cert-ai-intro.jpg",
    alt: "人工智能初识微认证证书原图",
  },
  aiPrompt: {
    src: "assets/cert-ai-prompt.jpg",
    alt: "AI大学堂 Prompt 工程师认证证书原图",
  },
  aiAgent: {
    src: "assets/cert-ai-agent.jpg",
    alt: "AI大学堂 智能体工程师认证证书原图",
  },
  aiTuning: {
    src: "assets/cert-ai-tuning.jpg",
    alt: "AI大学堂 微调工程师认证证书原图",
  },
  aiRag: {
    src: "assets/cert-ai-rag.jpg",
    alt: "AI大学堂 RAG 工程师认证证书原图",
  },
};

function openDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

if (sessionStorage.getItem("portfolio-entered") || matchMedia("(prefers-reduced-motion: reduce)").matches) {
  enterScreen.classList.add("is-hidden");
}

enterButton.addEventListener("click", () => {
  sessionStorage.setItem("portfolio-entered", "true");
  enterScreen.classList.add("is-hidden");
});

if (cursor && cursorArt && matchMedia("(pointer: fine)").matches) {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hotspot = { x: 21.4, y: 2.5 };
  let mouseX = -100;
  let mouseY = -100;
  let previousX = mouseX;
  let previousY = mouseY;
  let velocityX = 0;
  let smoothSpeed = 0;
  let rotation = 0;
  let rotationVelocity = 0;
  let scaleX = 1;
  let scaleY = 1;
  let interactive = false;
  let pressed = false;
  let hasPointerPosition = false;
  let lastFrame = performance.now();

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  document.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    if (!hasPointerPosition) {
      previousX = mouseX;
      previousY = mouseY;
      hasPointerPosition = true;
    }
    document.body.style.setProperty("--mx", `${mouseX}px`);
    document.body.style.setProperty("--my", `${mouseY}px`);
    cursor.classList.add("is-visible");
  }, { passive: true });

  document.documentElement.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
  document.documentElement.addEventListener("mouseenter", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    previousX = mouseX;
    previousY = mouseY;
    hasPointerPosition = true;
    cursor.classList.add("is-visible");
  });

  const interactiveSelector = 'a, button, [role="button"], input[type="submit"], .clickable, [data-cursor="interactive"], .interactive';
  document.addEventListener("pointerover", (event) => {
    interactive = Boolean(event.target.closest(interactiveSelector));
    cursor.classList.toggle("is-active", interactive);
  });
  document.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget || !event.relatedTarget.closest?.(interactiveSelector)) {
      interactive = false;
      cursor.classList.remove("is-active");
    }
  });
  document.addEventListener("pointerdown", () => { pressed = true; });
  document.addEventListener("pointerup", () => { pressed = false; });
  window.addEventListener("blur", () => { pressed = false; });

  const animateCursor = (now) => {
    const frameScale = clamp((now - lastFrame) / (1000 / 60), 0.5, 2);
    lastFrame = now;

    const dx = mouseX - previousX;
    const dy = mouseY - previousY;
    previousX = mouseX;
    previousY = mouseY;
    velocityX += (dx - velocityX) * (0.34 * frameScale);
    const speed = Math.hypot(dx, dy);
    smoothSpeed += (speed - smoothSpeed) * (0.25 * frameScale);

    const motionRotation = reducedMotion ? 0 : clamp(velocityX * 0.22, -6, 6);
    const targetRotation = interactive ? motionRotation * 0.55 : motionRotation;
    const spring = reducedMotion ? 0.7 : 0.2;
    const damping = reducedMotion ? 0 : 0.72;
    rotationVelocity = (rotationVelocity + (targetRotation - rotation) * spring * frameScale) * damping;
    rotation += rotationVelocity * frameScale;

    const speedRatio = reducedMotion ? 0 : clamp(smoothSpeed / 34, 0, 1);
    const hoverScale = interactive ? 1.09 : 1;
    const pressScaleX = pressed ? 0.94 : 1;
    const pressScaleY = pressed ? 0.96 : 1;
    const targetScaleX = hoverScale * pressScaleX * (1 - speedRatio * 0.025);
    const targetScaleY = hoverScale * pressScaleY * (1 + speedRatio * 0.025);
    const scaleEase = pressed ? 0.48 : 0.2;
    scaleX += (targetScaleX - scaleX) * scaleEase * frameScale;
    scaleY += (targetScaleY - scaleY) * scaleEase * frameScale;

    // The outer layer locks the SVG hotspot to the pointer; all motion pivots behind it.
    cursor.style.transform = `translate3d(${mouseX - hotspot.x}px, ${mouseY - hotspot.y}px, 0)`;
    cursorArt.style.transform = `rotate(${rotation + (pressed ? 1.2 : 0)}deg) scale(${scaleX}, ${scaleY})`;
    requestAnimationFrame(animateCursor);
  };

  requestAnimationFrame(animateCursor);
}

document.querySelectorAll("article, .gallery img, .wave-cover, .xinyu-cover").forEach((element) => element.classList.add("reveal"));
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

copyEmail.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("2059877032@qq.com");
    copyEmail.textContent = "已复制";
    setTimeout(() => (copyEmail.textContent = "复制邮箱"), 1400);
  } catch {
    location.href = "mailto:2059877032@qq.com";
  }
});

document.querySelectorAll("[data-certificate]").forEach((button) => {
  button.addEventListener("click", () => {
    const certificate = certificateMap[button.dataset.certificate];
    if (!certificate) return;
    certificateImage.src = certificate.src;
    certificateImage.alt = certificate.alt;
    openDialog(certificateDialog);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (certificateDialog.open) closeDialog(certificateDialog);
  if (terminal.open) closeDialog(terminal);
});

document.querySelectorAll("dialog form[method='dialog']").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    closeDialog(form.closest("dialog"));
  });
});

const terminalCommands = {
  help: "可用命令：whoami / projects / skills / curiosity / grow / clear",
  whoami: "王果典。中药学本科生，关注 AI 辅助开发与创意实践。",
  projects: "浪尖学园：已发布浏览器游戏。心屿：开发中的 AI 陪伴软件实验。",
  skills: "AI 辅助开发、Vibe Coding、浏览器游戏、AI 应用、演示设计。",
  curiosity: "你找到了隐藏层。",
  grow: "继续生长。<br>继续创造。<br><span class='tiny-sprout' aria-hidden='true'></span>",
};

curiousButton.addEventListener("click", () => {
  openDialog(terminal);
  terminalInput.focus();
});

terminalInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const command = terminalInput.value.trim().toLowerCase();
  terminalInput.value = "";
  if (!command) return;
  if (command === "clear") {
    terminalOutput.innerHTML = "";
    return;
  }
  terminalOutput.insertAdjacentHTML(
    "beforeend",
    `<p>&gt; ${command}</p><p>${terminalCommands[command] || `未知命令：${command}`}</p>`
  );
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
});
