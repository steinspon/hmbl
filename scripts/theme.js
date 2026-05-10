(function () {
  const OVERRIDE_KEY = "themeOverride";

  function getThemeByTime(date) {
    const now = date || new Date();
    const hour = now.getHours();
    return (hour >= 19 || hour < 7) ? "dark" : "light";
  }

  function getNextBoundaryTs(date) {
    const now = date || new Date();
    const next = new Date(now);
    const hour = now.getHours();

    if (hour >= 19) {
      next.setDate(now.getDate() + 1);
      next.setHours(7, 0, 0, 0);
    } else if (hour < 7) {
      next.setHours(7, 0, 0, 0);
    } else {
      next.setHours(19, 0, 0, 0);
    }

    return next.getTime();
  }

  function loadOverride() {
    try {
      const raw = localStorage.getItem(OVERRIDE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.theme || !parsed.expiresAt) return null;

      if (Date.now() >= parsed.expiresAt) {
        localStorage.removeItem(OVERRIDE_KEY);
        return null;
      }

      return parsed;
    } catch (err) {
      return null;
    }
  }

  function saveOverride(theme) {
    const payload = {
      theme,
      expiresAt: getNextBoundaryTs(new Date())
    };
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(payload));
  }

  function clearOverride() {
    localStorage.removeItem(OVERRIDE_KEY);
  }

  function getTheme() {
    const override = loadOverride();
    if (override) return override.theme;

    const hour = new Date().getHours();
    return (hour >= 19 || hour < 7) ? "dark" : "light";
  }

  function applyTheme() {
    const theme = getTheme();
    document.documentElement.setAttribute("data-theme", theme);

    const logoPath = theme === "dark" ? "logo-night.png" : "logo.png";
    const mainLogo = document.getElementById("main-logo");
    const favicon = document.getElementById("favicon-icon");
    const appleTouchIcon = document.getElementById("apple-touch-icon");

    if (mainLogo) mainLogo.src = logoPath;
    if (favicon) favicon.href = logoPath;
    if (appleTouchIcon) appleTouchIcon.href = logoPath;
  }

  window.initializeTheme = function initializeTheme() {
    applyTheme();
    setInterval(applyTheme, 60000);
  };

  window.setThemeOverride = function setThemeOverride(theme) {
    if (theme !== "dark" && theme !== "light") return;
    saveOverride(theme);
    applyTheme();
  };

  window.clearThemeOverride = function clearThemeOverride() {
    clearOverride();
    applyTheme();
  };

  window.getEffectiveTheme = function getEffectiveTheme() {
    return getTheme();
  };

  window.getAutoTheme = function getAutoTheme() {
    return getThemeByTime(new Date());
  };

  window.getThemeMode = function getThemeMode() {
    const override = loadOverride();
    if (!override) return "auto";
    return override.theme;
  };

  window.setThemeMode = function setThemeMode(mode) {
    if (mode === "auto") {
      clearOverride();
      applyTheme();
      return;
    }

    if (mode === "light" || mode === "dark") {
      saveOverride(mode);
      applyTheme();
    }
  };
})();
