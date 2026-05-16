const mapStyles = document.createElement('link');
mapStyles.rel = 'stylesheet';
mapStyles.href = 'cyrex-mapnav.css';
document.head.appendChild(mapStyles);

const gameScript = document.createElement('script');
gameScript.src = 'game-fixed.js';
gameScript.onload = function () {
  const mapScript = document.createElement('script');
  mapScript.src = 'cyrex-mapnav.js';
  document.body.appendChild(mapScript);
};
document.body.appendChild(gameScript);
