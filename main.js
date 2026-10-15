(() => {
  "use strict";

  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const menuButton = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");
  const navLinks = nav.querySelectorAll("a");
  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".project-card");
  const status = document.getElementById("filter-status");
  const emptyState = document.getElementById("empty-state");

  function getTheme() {
    try { return localStorage.getItem("alexandra-portfolio-theme"); }
    catch (error) { return null; }
  }

  function saveTheme(theme) {
    try { localStorage.setItem("alexandra-portfolio-theme", theme); }
    catch (error) { /* Тема работает и без localStorage. */ }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const isDark = theme === "dark";
    themeButton.setAttribute("aria-label", isDark ? "Включить светлую тему" : "Включить тёмную тему");
    themeButton.title = isDark ? "Включить светлую тему" : "Включить тёмную тему";
    themeButton.querySelector(".theme-symbol").textContent = isDark ? "☼" : "◐";
  }

  const savedTheme = getTheme();
  applyTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark");

  themeButton.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    saveTheme(next);
  });

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  }

  menuButton.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });

  navLinks.forEach(link => link.addEventListener("click", () => setMenu(false)));

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuButton.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 600) setMenu(false);
  });

  function filterProjects(category) {
    let count = 0;
    cards.forEach(card => {
      const visible = category === "all" || card.dataset.category === category;
      card.hidden = !visible;
      if (visible) count++;
    });

    filters.forEach(button => {
      const active = button.dataset.filter === category;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    const labels = {
      all: "все проекты",
      design: "проекты по дизайну",
      development: "проекты по веб-разработке"
    };
    status.textContent = `Показаны ${labels[category]}: ${count}`;
    emptyState.hidden = count !== 0;
  }

  filters.forEach(button => {
    button.addEventListener("click", () => filterProjects(button.dataset.filter));
  });
})();
