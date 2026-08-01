const hotspots = document.querySelectorAll(".hotspot");

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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
});

// Acrescente ?debug=1 ao endereÃ§o para visualizar as Ã¡reas clicÃ¡veis.
if (new URLSearchParams(window.location.search).get("debug") === "1") {
  document.documentElement.dataset.debug = "true";
}