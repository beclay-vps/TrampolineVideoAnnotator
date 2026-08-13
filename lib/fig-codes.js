/**
 * Trampoline Gymnastics FIG Code of Points 2025-2028 Official Database
 */

export const FIG_PRESETS = [

  // Body Drops / Landings (1/4 Somersault - 1xx)
  { code: "10o", name: "Front Drop (tuck)", points: 0.1 },
  { code: "10o", name: "Back Drop (tuck)", points: 0.1 },
  { code: "10<", name: "Front Drop (pike)", points: 0.1 },
  { code: "10<", name: "Back Drop (pike)", points: 0.1 },
  { code: "10/", name: "Front Drop (straight)", points: 0.1 },
  { code: "10/", name: "Back Drop (straight)", points: 0.1 },
  { code: "11/", name: "1/2 Twist to Back (straight)", points: 0.2 },
  { code: "11/", name: "1/2 Twist to Front (straight)", points: 0.2 },
  { code: "12/", name: "Full Twist to Front (straight)", points: 0.3 },
  { code: "12/", name: "Full Twist to Back (straight)", points: 0.3 },

  // 3/4 Somersaults (3xx)
  { code: "30/", name: "3/4 Front (straight)", points: 0.3 },
  { code: "30o", name: "3/4 Back (tuck)", points: 0.3 },
  { code: "30<", name: "3/4 Back (pike)", points: 0.3 },
  { code: "30/", name: "3/4 Back (straight)", points: 0.3 },
  { code: "31o", name: "Barani to Front (tuck)", points: 0.4 },
  { code: "31<", name: "Barani to Front (pike)", points: 0.4 },
  { code: "31/", name: "Barani to Front (straight)", points: 0.4 },
  { code: "31/", name: "Half in 3/4 Front (straight)", points: 0.4 },
  { code: "32/", name: "Back full to Front (straight)", points: 0.5 },

  // Single Somersaults (4xx)
  { code: "40o", name: "Front Somersault (tuck)", points: 0.5 },
  { code: "40o", name: "Back Somersault (tuck)", points: 0.5 },
  { code: "40<", name: "Front Somersault (pike)", points: 0.6 },
  { code: "40<", name: "Back Somersault (pike)", points: 0.6 },
  { code: "40/", name: "Front Somersault (straight)", points: 0.6 },
  { code: "40/", name: "Back Somersault (straight)", points: 0.6 },
  { code: "41o", name: "Barani (tuck)", points: 0.6 },
  { code: "41o", name: "Back Somersault with 1/2 Twist (tuck)", points: 0.6 },
  { code: "41<", name: "Barani (pike)", points: 0.6 },
  { code: "41<", name: "Back Somersault with 1/2 Twist (pike)", points: 0.6 },
  { code: "41/", name: "Barani (straight)", points: 0.6 },
  { code: "41/", name: "Back Somersault with 1/2 Twist (straight)", points: 0.6 },
  { code: "42/", name: "Back Full (straight)", points: 0.7 },
  { code: "43/", name: "Rudolph (Rudy) (straight)", points: 0.8 },
  { code: "44/", name: "Double Full (straight)", points: 0.9 },
  { code: "45/", name: "Randolph (Randy) (straight)", points: 1.0 },
  { code: "46/", name: "Triple Full (straight)", points: 1.1 },
  { code: "47/", name: "3 1/2 Twisting Front (straight)", points: 1.2 },
  { code: "48/", name: "Quadruple full (straight)", points: 1.3 },
  { code: "49/", name: "4 1/2 Twisting Front (straight)", points: 1.4 },

  // 1 1/4 Somersaults (Ballouts & Codys - 5xx)
  { code: "50o", name: "Cody or 1 1/4 Back (tuck)", points: 0.6 },
  { code: "50<", name: "Cody or 1 1/4 Back (pike)", points: 0.7 },
  { code: "50/", name: "Cody or 1 1/4 Back (straight)", points: 0.7 },
  { code: "51o", name: "Barani Ballout (tuck)", points: 0.7 },
  { code: "51<", name: "Barani Ballout (pike)", points: 0.7 },
  { code: "51/", name: "Barani Ballout (straight)", points: 0.7 },
  { code: "52/", name: "Cody with Full Twist (straight)", points: 0.8 },
  { code: "53/", name: "Rudolph Ballout (straight)", points: 0.9 },
  { code: "54/", name: "Cody with Double Twist (straight)", points: 1.0 },
  { code: "55/", name: "Randolph Ballout (straight)", points: 1.1 },

  // 1 3/4 Somersaults (7xx)
  { code: "70o", name: "1 3/4 Front (tuck)", points: 0.8 },
  { code: "70<", name: "1 3/4 Front (pike)", points: 0.9 },
  { code: "70/", name: "1 3/4 Front (straight)", points: 0.9 },

  // Double Somersaults (FIG 2025-2028 - 8xx)
  { code: "800o", name: "Double Back (tuck)", points: 1.1 },
  { code: "800<", name: "Double Back (pike)", points: 1.3 },
  { code: "800/", name: "Double Back (straight)", points: 1.3 },
  { code: "801o", name: "Half Out (tuck)", points: 1.1 },
  { code: "801<", name: "Half Out (pike)", points: 1.3 },
  { code: "801/", name: "Half Out (straight)", points: 1.3 },
  { code: "802o", name: "Back In Full Out (tuck)", points: 1.3 },
  { code: "802<", name: "Back In Full Out (pike)", points: 1.5 },
  { code: "802/", name: "Back In Full Out (straight)", points: 1.5 },
  { code: "803o", name: "Rudy Out (tuck)", points: 1.3 },
  { code: "803<", name: "Rudy Out (pike)", points: 1.5 },
  { code: "803/", name: "Rudy Out (straight)", points: 1.5 },
  { code: "805o", name: "Randy Out (tuck)", points: 1.6 },
  { code: "805<", name: "Randy Out (pike)", points: 1.8 },
  { code: "805/", name: "Randy Out (straight)", points: 1.8 },
  { code: "807o", name: "3 1/2 Out (tuck)", points: 2.0 },
  { code: "807<", name: "3 1/2 Out (pike)", points: 2.2 },
  { code: "807/", name: "3 1/2 Out (straight)", points: 2.2 },
  { code: "811o", name: "Half In Half Out (tuck)", points: 1.3 },
  { code: "811<", name: "Half In Half Out (pike)", points: 1.5 },
  { code: "811/", name: "Half In Half Out (straight)", points: 1.5 },
  { code: "813o", name: "Half In Rudy Out (tuck)", points: 1.5 },
  { code: "813<", name: "Half In Rudy Out (pike)", points: 1.7 },
  { code: "815o", name: "Half In Randy Out (tuck)", points: 1.9 },
  { code: "815<", name: "Half In Randy Out (pike)", points: 2.1 },
  { code: "817o", name: "Half In 3 1/2 Out (tuck)", points: 2.3 },
  { code: "817<", name: "Half In 3 1/2 Out (pike)", points: 2.5 },
  { code: "821o", name: "Full Half (tuck)", points: 1.3 },
  { code: "821<", name: "Full Half (pike)", points: 1.5 },
  { code: "821/", name: "Full Half (straight)", points: 1.5 },
  { code: "822o", name: "Full In Full Out (tuck)", points: 1.5 },
  { code: "822/", name: "Full In Full Out (straight)", points: 1.7 },
  { code: "823o", name: "Full Rudy (tuck)", points: 1.6 },
  { code: "823<", name: "Full Rudy (pike)", points: 1.8 },
  { code: "823/", name: "Full Rudy (straight)", points: 1.8 },
  { code: "825o", name: "Full Randy (tuck)", points: 2.0 },
  { code: "825<", name: "Full Randy (pike)", points: 2.2 },
  { code: "825/", name: "Full Randy (straight)", points: 2.2 },
  { code: "831o", name: "1 1/2 in Half Out (tuck)", points: 1.5 },
  { code: "831<", name: "1 1/2 in Half Out (pike)", points: 1.7 },
  { code: "833o", name: "1 1/2 In 1 1/2 Out (tuck)", points: 1.9 },
  { code: "833<", name: "1 1/2 In 1 1/2 Out (pike)", points: 2.1 },
  { code: "833/", name: "1 1/2 In 1 1/2 Out (straight)", points: 2.1 },
  { code: "835o", name: "1 1/2 In Randy Out (tuck)", points: 2.3 },
  { code: "835<", name: "1 1/2 In Randy Out (pike)", points: 2.5 },
  { code: "844/", name: "Double Full In Double Full Out (straight)", points: 2.5 },

  // 2 3/4 Somersaults (11xx)
  { code: "1100o", name: "2 3/4 Front (tuck)", points: 1.3 },
  { code: "1100<", name: "2 3/4 Front (pike)", points: 1.5 },
  { code: "1100/", name: "2 3/4 Front (straight)", points: 1.5 },
  { code: "1110o", name: "2 3/4 Back with Half Twist (tuck)", points: 1.5 },
  { code: "1110<", name: "2 3/4 Back with Half Twist (pike)", points: 1.7 },
  { code: "1110/", name: "2 3/4 Back with Half Twist (straight)", points: 1.7 },

  // Triple Somersaults (12xxx)
  { code: "12000o", name: "Triple Back (tuck)", points: 1.8 },
  { code: "12000<", name: "Triple Back (pike)", points: 2.1 },
  { code: "12000/", name: "Triple Back (straight)", points: 2.1 },
  { code: "12001o", name: "Front Front Half (tuck)", points: 1.7 },
  { code: "12001<", name: "Front Front Half (pike)", points: 2.0 },
  { code: "12003o", name: "Front Front Rudy (tuck)", points: 2.1 },
  { code: "12003<", name: "Front Front Rudy (pike)", points: 2.4 },
  { code: "12021o", name: "Front Full Half (tuck)", points: 2.1 },
  { code: "12021<", name: "Front Full Half (pike)", points: 2.4 },
  { code: "12023o", name: "Front Full Rudy (tuck)", points: 2.7 },
  { code: "12023<", name: "Front Full Rudy (pike)", points: 3.0 },
  { code: "12101o", name: "Half Front Half (tuck)", points: 2.0 },
  { code: "12101<", name: "Half Front Half (pike)", points: 2.3 },
  { code: "12103o", name: "Half Front Rudy (tuck)", points: 2.6 },
  { code: "12103<", name: "Half Front Rudy (pike)", points: 2.9 },
  { code: "12121o", name: "Half Full Half (tuck)", points: 2.6 },
  { code: "12121<", name: "Half Full Half (pike)", points: 2.9 },
  { code: "12201o", name: "Full Front Half (tuck)", points: 2.1 },
  { code: "12201<", name: "Full Front Half (pike)", points: 2.4 },
  { code: "12203o", name: "Full Front Rudy (tuck)", points: 2.7 },
  { code: "12203<", name: "Full Front Rudy (pike)", points: 3.0 },
  { code: "12221o", name: "Full Full Half (tuck)", points: 2.7 },
  { code: "12221<", name: "Full Full Half (pike)", points: 3.0 },
  { code: "12222o", name: "Full Full Full (tuck)", points: 3.2 },
  { code: "12222/", name: "Full Full Full (straight)", points: 3.5 },
  { code: "12303o", name: "1 1/2 Front Rudy Out (tuck)", points: 3.2 },
  { code: "12303<", name: "1 1/2 Front Rudy Out (pike)", points: 3.5 },

  // Quadruple Somersaults (Quadriffis - 16xxxx)
  { code: "160001o", name: "Front Front Front Half (tuck)", points: 2.5 },
  { code: "160001<", name: "Front Front Front Half (pike)", points: 2.9 },
  { code: "160003o", name: "Front Front Front Rudy (tuck)", points: 3.1 },
  { code: "160003<", name: "Front Front Front Rudy (pike)", points: 3.5 },
  { code: "161001o", name: "Half in half out quadriffis (tuck)", points: 3.1 },
  { code: "161001<", name: "Half in half out quadriffis (pike)", points: 3.5 },
  { code: "161003o", name: "Half in rudy out quadriffis (tuck)", points: 3.7 },
  { code: "161003<", name: "Half in rudy out quadriffis (pike)", points: 4.1 }
];

export function searchFigCodes(query = '') {
  if (!query) return FIG_PRESETS;
  let q = query.toLowerCase().trim();

  // Support searching French position names as well
  let qClean = q.replace(/\s+/g, '');
  if (qClean.includes('groupe') || qClean.includes('groupé')) qClean = qClean.replace(/group[é|e]/g, 'tuck');
  if (qClean.includes('carpe') || qClean.includes('carpé')) qClean = qClean.replace(/carp[é|e]/g, 'pike');
  if (qClean.includes('tendu')) qClean = qClean.replace(/tendu/g, 'straight');

  return FIG_PRESETS.filter(
    item =>
      item.code.toLowerCase().replace(/\s+/g, '').includes(qClean) ||
      item.name.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(qClean)
  );
}
