var userLang = navigator.language || navigator.userLanguage;
if (userLang.toLowerCase().includes('fr')) {
  window.location.href = "fr/"
}
else {
  window.location.href = "en/"
}
