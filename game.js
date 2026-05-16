const mapStyles = document.createElement('link');
mapStyles.rel = 'stylesheet';
mapStyles.href = 'cyrex-mapnav.css';
document.head.appendChild(mapStyles);

const houseStyles = document.createElement('link');
houseStyles.rel = 'stylesheet';
houseStyles.href = 'cyrex-housing.css';
document.head.appendChild(houseStyles);

const iconStyles = document.createElement('link');
iconStyles.rel = 'stylesheet';
iconStyles.href = 'cyrex-icons.css';
document.head.appendChild(iconStyles);

const mobileFixStyles = document.createElement('link');
mobileFixStyles.rel = 'stylesheet';
mobileFixStyles.href = 'cyrex-mobile-fix.css';
document.head.appendChild(mobileFixStyles);

const gameScript = document.createElement('script');
gameScript.src = 'game-fixed.js';
gameScript.onload = function () {
  const mapOverrideScript = document.createElement('script');
  mapOverrideScript.src = 'cyrex-map-overrides.js';
  mapOverrideScript.onload = function () {
    const mapScript = document.createElement('script');
    mapScript.src = 'cyrex-mapnav.js';
    mapScript.onload = function () {
      const houseScript = document.createElement('script');
      houseScript.src = 'cyrex-nav-house.js';
      houseScript.onload = function () {
        const iconScript = document.createElement('script');
        iconScript.src = 'cyrex-icons-info.js';
        document.body.appendChild(iconScript);
      };
      document.body.appendChild(houseScript);
    };
    document.body.appendChild(mapScript);
  };
  document.body.appendChild(mapOverrideScript);
};
document.body.appendChild(gameScript);
