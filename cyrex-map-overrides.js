(function(){
  if (typeof MAPS === 'undefined' || typeof DATA === 'undefined') return;

  MAPS.sector = 'https://res.cloudinary.com/dkhxur6ga/image/upload/v1778961572/3CBFD685-3530-4EDF-93A2-2930D48A4B3E_ix7jh1.png';
  MAPS.grayline = 'https://res.cloudinary.com/dkhxur6ga/image/upload/v1778961571/5B969DAF-97F0-4FBD-97CB-25D45A3F5261_zfiv15.png';
  MAPS.dock12 = 'https://res.cloudinary.com/dkhxur6ga/image/upload/v1778961571/0E1F8AD3-B7C0-4480-985C-D107CE050C5F_vesk82.png';
  MAPS.blackrow = 'https://res.cloudinary.com/dkhxur6ga/image/upload/v1778961571/C14EC770-EB68-444B-A1A6-1C1AD52127CC_reoa7r.png';
  MAPS.clinic = 'https://res.cloudinary.com/dkhxur6ga/image/upload/v1778961571/C14EC770-EB68-444B-A1A6-1C1AD52127CC_reoa7r.png';

  const districtMap = {
    grayline: MAPS.grayline,
    dock12: MAPS.dock12,
    blackrow: MAPS.blackrow,
    clinic: MAPS.clinic
  };

  if (Array.isArray(DATA.districts)) {
    DATA.districts.forEach(function(d){
      if (districtMap[d.id]) d.image = districtMap[d.id];
    });
  }
})();
