(function () {
  function getTheme() {
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
})();
