const imagem = document.querySelector("#imagem-tela-6");
const hotspots = document.querySelectorAll(".hotspot");

function getRenderedImageRect() {
  const elementRect = imagem.getBoundingClientRect();
  const naturalWidth = imagem.naturalWidth;
  const naturalHeight = imagem.naturalHeight;

  if (!naturalWidth || !naturalHeight) {
    return null;
  }

  const imageRatio = naturalWidth / naturalHeight;
  const elementRatio = elementRect.width / elementRect.height;

  if (elementRatio > imageRatio) {
    const height = elementRect.height;
    const width = height * imageRatio;

    return {
      left: elementRect.left + (elementRect.width - width) / 2,
      top: elementRect.top,
      width,
      height,
    };
  }

  const width = elementRect.width;
  const height = width / imageRatio;

  return {
    left: elementRect.left,
    top: elementRect.top + (elementRect.height - height) / 2,
    width,
    height,
  };
}

function positionHotspots() {
  const renderedImage = getRenderedImageRect();

  if (!renderedImage) {
    return;
  }

  hotspots.forEach((hotspot) => {
    const x = Number(hotspot.dataset.x);
    const y = Number(hotspot.dataset.y);
    const width = Number(hotspot.dataset.width);
    const height = Number(hotspot.dataset.height);

    hotspot.style.left = `${renderedImage.left + x * renderedImage.width}px`;
    hotspot.style.top = `${renderedImage.top + y * renderedImage.height}px`;
    hotspot.style.width = `${width * renderedImage.width}px`;
    hotspot.style.height = `${height * renderedImage.height}px`;
  });

  document.documentElement.dataset.hotspotsReady = "true";
}

let positionFrame;

function scheduleHotspotPositioning() {
  cancelAnimationFrame(positionFrame);
  positionFrame = requestAnimationFrame(positionHotspots);
}

function clearPressedState() {
  hotspots.forEach((hotspot) => hotspot.classList.remove("is-pressed"));
}

hotspots.forEach((hotspot) => {
  hotspot.addEventListener("pointerdown", () => {
    clearPressedState();
    hotspot.classList.add("is-pressed");
  });

  hotspot.addEventListener("pointerup", clearPressedState);
  hotspot.addEventListener("pointercancel", clearPressedState);
  hotspot.addEventListener("pointerleave", clearPressedState);
});

window.addEventListener("pageshow", clearPressedState);
window.addEventListener("blur", clearPressedState);
window.addEventListener("resize", scheduleHotspotPositioning);
window.addEventListener("orientationchange", scheduleHotspotPositioning);

imagem.addEventListener("load", scheduleHotspotPositioning);

if (imagem.complete) {
  scheduleHotspotPositioning();
}

if ("ResizeObserver" in window) {
  new ResizeObserver(scheduleHotspotPositioning).observe(imagem);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
});

// Acrescente ?debug=1 ao endereço para visualizar a área clicável.
if (new URLSearchParams(window.location.search).get("debug") === "1") {
  document.documentElement.dataset.debug = "true";
}
