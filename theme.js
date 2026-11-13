(() => {
  const storageKey = "krishitrust-theme";
  const root = document.documentElement;

  function read() {
    try {
      const v = localStorage.getItem(storageKey);
      return v === "light" || v === "dark" ? v : "dark";
    } catch (e) {
      return "dark";
    }
  }

  function save(theme) {
    try { localStorage.setItem(storageKey, theme); } catch (e) {}
  }

  function updateButton() {
    const theme = root.dataset.theme === "light" ? "light" : "dark";
    const next = theme === "dark" ? "light" : "dark";
    const icon = next === "light" ? "☀️" : "🌙";

    document.querySelectorAll("#themeToggle").forEach((button) => {
      if (button.textContent.trim() !== icon) button.textContent = icon;
      button.setAttribute("aria-label", `Switch to ${next} mode`);
    });
  }

  root.dataset.theme = read();
  updateButton();

  new MutationObserver(updateButton).observe(root, { childList: true, subtree: true });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest("#themeToggle")) return;

    const newTheme = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = newTheme;
    save(newTheme);
    updateButton();
  });
  window.addEventListener("storage", (e) => {
    if (e.key !== storageKey) return;
    root.dataset.theme = read();
    updateButton();
  });
})();