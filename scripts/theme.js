(function () {
  const OVERRIDE_KEY = "themeOverride";
  const DAYTIME_STYLE_KEY = "daytimeStyle";
  const SUMMER_START_MONTH = 4; // May (0-indexed)
  const SUMMER_START_DAY = 1;
  const SUMMER_END_MONTH = 9; // October (0-indexed)
  const SUMMER_END_DAY = 31;

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

  function isSummerSeason(date) {
    const now = date || new Date();
    const month = now.getMonth();
    const day = now.getDate();

    if (month < SUMMER_START_MONTH || month > SUMMER_END_MONTH) return false;
    if (month === SUMMER_START_MONTH && day < SUMMER_START_DAY) return false;
    if (month === SUMMER_END_MONTH && day > SUMMER_END_DAY) return false;
    return true;
  }

  function getDaytimeLogoPath(date) {
    return isSummerSeason(date) ? "logo_summer_daytime.png" : "logo_winter_daytime.png";
  }

  function getDaytimeStyle() {
    try {
      const value = localStorage.getItem(DAYTIME_STYLE_KEY);
      if (value === "auto" || value === "classic" || value === "summer-mono") return value;
      return "auto";
    } catch (err) {
      return "auto";
    }
  }

  function setDaytimeStyle(style) {
    if (style !== "auto" && style !== "classic" && style !== "summer-mono") return;
    try {
      localStorage.setItem(DAYTIME_STYLE_KEY, style);
    } catch (err) {
      // ignore storage failures; theme will still apply for current session
    }
  }

  function clearSeasonalOverrides() {
    const el = document.documentElement;
    [
      "--bg", "--card", "--text", "--muted", "--accent", "--accent-2", "--border", "--shadow",
      "--bg-top", "--bg-grad-top", "--bg-grad-bottom", "--logo-wrap-bg", "--logo-wrap-border",
      "--back-bg", "--back-border", "--bg-top-glow", "--shell-top", "--shell-bottom", "--shell-border",
      "--shell-shadow", "--hero-top", "--hero-bottom", "--card-strong", "--logo-bg", "--logo-shadow",
      "--tool-border", "--tool-active-top", "--tool-active-bottom", "--tool-active-shadow",
      "--btn-sms-border", "--manual-shadow", "--image-shadow", "--map-link", "--modal-overlay",
      "--modal-shadow", "--modal-sheet-bg", "--primary", "--primary-soft", "--success-bg", "--success-text",
      "--card-hover-border", "--card-hover-shadow"
    ].forEach((name) => el.style.removeProperty(name));
  }

  function applySummerMonoOverrides() {
    const el = document.documentElement;
    const vars = {
      "--bg": "#f4f4f4",
      "--card": "#ffffff",
      "--text": "#111111",
      "--muted": "#5f5f5f",
      "--accent": "#121212",
      "--accent-2": "#121212",
      "--border": "rgba(0,0,0,0.14)",
      "--shadow": "0 6px 18px rgba(0,0,0,0.08)",
      "--bg-top": "rgba(0,0,0,0.06)",
      "--bg-grad-top": "#fafafa",
      "--bg-grad-bottom": "#f2f2f2",
      "--logo-wrap-bg": "rgba(255,255,255,0.92)",
      "--logo-wrap-border": "rgba(0,0,0,0.14)",
      "--back-bg": "#ffffff",
      "--back-border": "rgba(0,0,0,0.16)",
      "--bg-top-glow": "rgba(0,0,0,0.06)",
      "--shell-top": "rgba(255,255,255,0.96)",
      "--shell-bottom": "rgba(255,255,255,0.96)",
      "--shell-border": "rgba(0,0,0,0.10)",
      "--shell-shadow": "0 10px 26px rgba(0,0,0,0.10)",
      "--hero-top": "rgba(255,255,255,0.8)",
      "--hero-bottom": "rgba(255,255,255,0.8)",
      "--card-strong": "#ffffff",
      "--logo-bg": "#ffffff",
      "--logo-shadow": "0 6px 18px rgba(0,0,0,0.08)",
      "--tool-border": "rgba(0,0,0,0.14)",
      "--tool-active-top": "#f2f2f2",
      "--tool-active-bottom": "#f2f2f2",
      "--tool-active-shadow": "0 4px 12px rgba(0,0,0,0.10)",
      "--btn-sms-border": "rgba(0,0,0,0.16)",
      "--manual-shadow": "0 6px 16px rgba(0,0,0,0.10)",
      "--image-shadow": "0 6px 16px rgba(0,0,0,0.10)",
      "--map-link": "#121212",
      "--modal-overlay": "rgba(0,0,0,0.45)",
      "--modal-shadow": "0 14px 36px rgba(0,0,0,0.22)",
      "--modal-sheet-bg": "#ffffff",
      "--primary": "#121212",
      "--primary-soft": "rgba(0,0,0,0.08)",
      "--success-bg": "#121212",
      "--success-text": "#ffffff",
      "--card-hover-border": "rgba(0,0,0,0.20)",
      "--card-hover-shadow": "0 12px 24px rgba(0,0,0,0.12)"
    };

    Object.entries(vars).forEach(([key, value]) => el.style.setProperty(key, value));
  }

  function applyTheme() {
    const now = new Date();
    const theme = getTheme();
    document.documentElement.setAttribute("data-theme", theme);

    clearSeasonalOverrides();
    const daytimeStyle = getDaytimeStyle();
    const seasonalLight = theme === "light" && isSummerSeason(now);
    const shouldUseSummerMono = theme === "light" && (
      daytimeStyle === "summer-mono" || (daytimeStyle === "auto" && seasonalLight)
    );
    document.documentElement.setAttribute("data-daytime-style", shouldUseSummerMono ? "summer-mono" : "default");
    if (shouldUseSummerMono) applySummerMonoOverrides();

    const logoPath = theme === "dark" ? "logo-night.png" : getDaytimeLogoPath(now);
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

  window.getDaytimeStyle = function getDaytimeStyleWindow() {
    return getDaytimeStyle();
  };

  window.setDaytimeStyle = function setDaytimeStyleWindow(style) {
    setDaytimeStyle(style);
    applyTheme();
  };
})();
