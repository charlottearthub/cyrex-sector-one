const mapStyles = document.createElement('link');
mapStyles.rel = 'stylesheet';
mapStyles.href = 'cyrex-mapnav.css';
document.head.appendChild(mapStyles);

const houseStyles = document.createElement('link');
houseStyles.rel = 'stylesheet';
houseStyles.href = 'cyrex-housing.css';
document.head.appendChild(houseStyles);

const gameScript = document.createElement('script');
gameScript.src = 'game-fixed.js';
gameScript.onload = function () {
  const mapScript = document.createElement('script');
  mapScript.src = 'cyrex-mapnav.js';
  mapScript.onload = function () {
    const houseScript = document.createElement('script');
    houseScript.src = 'cyrex-nav-house.js';
    document.body.appendChild(houseScript);
  };
  document.body.appendChild(mapScript);
};
document.body.appendChild(gameScript);
