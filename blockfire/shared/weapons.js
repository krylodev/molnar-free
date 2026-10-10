// Weapon definitions. The server uses these to validate shots and compute
// damage; the client uses them for spread, recoil and the HUD.

export const WEAPONS = [
  {
    id: 'rifle',
    name: 'Rifle',
    damage: 22,
    headMult: 1.5,
    fireInterval: 0.1,
    auto: true,
    mag: 30,
    reload: 1.5,
    pellets: 1,
    spreadHip: 0.03,
    spreadAds: 0.006,
    moveSpread: 0.03,
    airSpread: 0.05,
    range: 250,
    falloffStart: 30,
    falloffEnd: 80,
    minFalloff: 0.6,
    adsFov: 55,
    adsTime: 0.15,
    recoil: 0.012,
  },
  {
    id: 'sniper',
    name: 'Sniper',
    damage: 85,
    headMult: 2,
    fireInterval: 1.1,
    auto: false,
    mag: 5,
    reload: 2.3,
    pellets: 1,
    spreadHip: 0.08,
    spreadAds: 0,
    moveSpread: 0.04,
    airSpread: 0.08,
    range: 400,
    falloffStart: 1000,
    falloffEnd: 1000,
    minFalloff: 1,
    adsFov: 22,
    adsTime: 0.22,
    recoil: 0.06,
    scope: true,
  },
  {
    id: 'shotgun',
    name: 'Shotgun',
    damage: 12,
    headMult: 1.25,
    fireInterval: 0.8,
    auto: false,
    mag: 6,
    reload: 2.0,
    pellets: 9,
    spreadHip: 0.09,
    spreadAds: 0.07,
    moveSpread: 0.01,
    airSpread: 0.02,
    range: 60,
    falloffStart: 6,
    falloffEnd: 25,
    minFalloff: 0.25,
    adsFov: 70,
    adsTime: 0.15,
    recoil: 0.05,
  },
];

export function damageAt(weapon, dist) {
  if (dist <= weapon.falloffStart) return weapon.damage;
  if (dist >= weapon.falloffEnd) return weapon.damage * weapon.minFalloff;
  const k = (dist - weapon.falloffStart) / (weapon.falloffEnd - weapon.falloffStart);
  return weapon.damage * (1 - k * (1 - weapon.minFalloff));
}
