// Plain-language explanations for contractors: what each measurement and each model result means on site.
// Fields: title, what (what it is), signs (what you'd see/hear/feel), causes, check (first things to look at).

export const MEASUREMENTS = {
  humidity: {
    title: 'Humidity (%RH)',
    what: 'How much water vapour is in the air inside a duct or cavity. 100 %RH means the air is fully saturated and water starts condensing on surfaces.',
    signs: 'Damp or dripping ducts, wet insulation, water stains on the ceiling below, musty smell.',
    causes: 'Rain getting past a vent or roof seal, a plumbing leak nearby, or warm moist air hitting a cold surface.',
    check: 'Flashing and seals around the vent, insulation in the duct, the ceiling under it.',
  },
  moisture: {
    title: 'Membrane moisture (%)',
    what: 'How wet the insulation is under the roof membrane. Dry insulation reads in single digits; above 15% it is holding water.',
    signs: 'Soft or spongy spots when you walk the roof, blisters in the membrane, leaks inside after rain.',
    causes: 'A split seam, a failed drain ring or flashing, or ponding water finding its way under the membrane.',
    check: 'Drain rings and clamps, seams and laps near the sensor, any ponding.',
  },
  thermal: {
    title: 'Temperature rise (°C)',
    what: 'How much hotter this spot is than its surroundings. A few degrees is normal; a steady rise means heat is being made or lost where it should not be.',
    signs: 'Warm to the touch, discoloured insulation or plastic, a hot smell near panels.',
    causes: 'Loose or overloaded electrical connections, or conditioned air leaking through a gap.',
    check: 'For panels, only a licensed electrician should open it. For vents, the collar seal and fasteners.',
  },
  vibration: {
    title: 'Vibration (mm/s)',
    what: 'How hard the machine is shaking, measured as speed of movement. Under 4 mm/s is normal for most fans and pumps; above 7 mm/s is severe.',
    signs: 'Humming or rattling, loose bolts, the unit walking on its mounts, grinding or squealing.',
    causes: 'Worn bearings, a bent or unbalanced fan wheel, a motor out of line with what it drives, or loose mounts.',
    check: 'Mount bolts, belt tension, bearing noise with a stethoscope, fan blades for build-up or damage.',
  },
  acoustic: {
    title: 'Leak noise (dB)',
    what: 'How loud the hiss is in the pipe, picked up by a microphone clamped to it. Water escaping under pressure makes a steady hiss that is louder the bigger the leak.',
    signs: 'A hiss you can sometimes hear with your ear on the pipe, damp walls, higher water bills.',
    causes: 'A cracked joint, a corroded pipe wall, or a failing gasket or valve seat.',
    check: 'The nearest joints and fittings, access panels in the riser, pressure at the nearest gauge.',
  },
  pressure: {
    title: 'Pressure (psi)',
    what: 'How hard the water is pushing inside a closed loop. For this sensor, lower is worse: a drop means water is getting out somewhere.',
    signs: 'Boiler shutting off on low pressure, gauge reading below its usual mark, drips at fittings.',
    causes: 'A slow leak in the loop, a relief valve letting by, or an expansion tank that has lost its charge.',
    check: 'The gauge on the boiler, relief valve discharge pipe, visible fittings and valves.',
  },
  sprinkler: {
    title: 'Water pressure (psi)',
    what: 'Pressure in the fire sprinkler riser. Sprinklers need enough pressure to work in a fire, so a low reading matters even if nothing is leaking.',
    signs: 'Riser gauge below its normal mark, alarm valve trouble signal.',
    causes: 'A partly closed control valve, a leak in the system, or low supply pressure from the street.',
    check: 'That the main control valve is fully open, the riser gauges, then call the fire protection contractor.',
  },
  strain: {
    title: 'Strain (µε, microstrain)',
    what: 'How much the concrete or steel is stretching under load, in millionths of its length. It is tiny, but a rising number means the member is carrying more than before.',
    signs: 'New cracks, rust stains bleeding from concrete, spalling near the sensor.',
    causes: 'Heavier loads, support movement, or the member losing strength from corrosion or damage.',
    check: 'Look for fresh cracks or rust around the gauge. A structural engineer should review any rise.',
  },
  crack: {
    title: 'Crack width (mm)',
    what: 'How wide an existing crack is, measured by a gauge fixed across it. A crack that keeps opening means the wall is still moving.',
    signs: 'The crack looks wider, new cracks branching off, loose pieces, water getting in.',
    causes: 'Settlement, thermal movement, or corroding steel pushing the masonry apart.',
    check: 'Photograph it with a tape measure in shot, keep the area below clear if anything looks loose.',
  },
};

export const RESULTS = {
  sound: {
    healthy: {
      title: 'Healthy',
      what: 'The recording sounds like normal operation: a machine running smoothly, or a pipe with no leak.',
      signs: 'Nothing unusual to hear or feel.',
      causes: 'No fault detected.',
      check: 'Nothing needed now. The sensor keeps listening.',
    },
    bearing_fault: {
      title: 'Bearing fault',
      what: 'The bearings that let a shaft spin smoothly are damaged. Worn bearings make a rough, gritty or ticking sound that gets worse over time.',
      signs: 'Grinding, rumbling or squealing, the housing running hot, more vibration than usual.',
      causes: 'Old or dried-out grease, dirt or water in the bearing, or overloading.',
      check: 'Feel the bearing housing for heat, listen with a stethoscope, check the grease. Plan a replacement before it seizes.',
    },
    unbalanced_rotor: {
      title: 'Unbalanced rotor',
      what: 'The spinning part (fan wheel, impeller) is heavier on one side, so it wobbles once every turn.',
      signs: 'A rhythmic thump or hum that rises with speed, the unit shaking on its mounts.',
      causes: 'Dirt build-up on fan blades, a damaged or missing blade, or a loose balance weight.',
      check: 'Clean the fan wheel, look for bent or broken blades, re-balance if needed.',
    },
    misalignment: {
      title: 'Misalignment',
      what: 'The motor shaft and the shaft it drives are not in a straight line, so the coupling is being bent every turn.',
      signs: 'Vibration along the shaft, hot couplings or bearings, worn coupling inserts, belt wear on one edge.',
      causes: 'Loose or shifted mounts, a motor put back without being re-aligned, or the base settling.',
      check: 'Mount bolts and shims, the coupling for wear. Re-align with a laser or dial tool.',
    },
    pipe_leak: {
      title: 'Pipe leak',
      what: 'Water is escaping from a pressurised pipe. Escaping water makes a steady hiss the microphone can hear through the pipe wall.',
      signs: 'Damp walls or ceilings, pooling water, a hiss at joints, higher water use.',
      causes: 'A cracked joint, corroded pipe, failed gasket, or a valve not seating.',
      check: 'Joints and fittings near the sensor, access panels. Close the nearest shut-off if water is spraying.',
    },
  },
  bearing: {
    healthy: {
      title: 'Healthy bearing',
      what: 'The vibration pattern matches a bearing in good condition.',
      signs: 'Smooth, quiet running.',
      causes: 'No fault detected.',
      check: 'Nothing needed now beyond normal greasing.',
    },
    inner_race_fault: {
      title: 'Inner race fault',
      what: 'Damage on the inner ring of the bearing, the part that turns with the shaft. The balls hit the damaged spot many times per turn.',
      signs: 'A fast ticking or rough noise, rising vibration, heat at the housing.',
      causes: 'Fatigue from age or overload, poor lubrication, or dirt getting in.',
      check: 'Grease condition and heat. Replace the bearing soon; inner race damage spreads quickly.',
    },
    outer_race_fault: {
      title: 'Outer race fault',
      what: 'Damage on the outer ring of the bearing, the part fixed in the housing. It is the most common bearing failure.',
      signs: 'Steady rough rumble, vibration at the housing, sometimes heat.',
      causes: 'Wear over time, a bad fit in the housing, contamination, or overload.',
      check: 'Housing fit and bolts, grease. Schedule a bearing replacement.',
    },
    ball_fault: {
      title: 'Ball fault',
      what: 'One or more of the balls inside the bearing is chipped or pitted, so it knocks as it rolls.',
      signs: 'Irregular clicking or grinding, vibration that comes and goes.',
      causes: 'Contamination, lack of grease, or a hard shock load.',
      check: 'Grease for metal flakes, listen for grinding. Replace the bearing.',
    },
    cage_fault: {
      title: 'Cage fault',
      what: 'The cage that keeps the balls evenly spaced is worn or broken, so the balls bunch up.',
      signs: 'Low, uneven rattling; can fail suddenly once the cage breaks.',
      causes: 'Poor lubrication, high speed, or vibration from other faults.',
      check: 'Treat as urgent: stop the unit if the noise changes suddenly, then replace the bearing.',
    },
  },
};

// The machine (audio + vibration) model uses the same fault types as the sound model.
RESULTS.machine = {
  healthy: { ...RESULTS.sound.healthy, what: 'Both the microphone and the vibration sensors match a machine running smoothly.' },
  bearing_fault: RESULTS.sound.bearing_fault,
  unbalanced_rotor: RESULTS.sound.unbalanced_rotor,
  misalignment: RESULTS.sound.misalignment,
};

RESULTS.thermal = {
  healthy: {
    title: 'Normal temperature',
    what: 'The motor is warm in the usual places and nothing stands out as a hotspot.',
    signs: 'Casing warm but touchable, even colour across the body.',
    causes: 'No fault detected.',
    check: 'Nothing needed now.',
  },
  stator_short_circuit: {
    title: 'Stator winding short circuit',
    what: 'Part of the copper winding inside the motor is shorting, so the motor body runs much hotter than normal. It is an electrical fault.',
    signs: 'Motor casing very hot, burning smell, breaker tripping, humming, less power.',
    causes: 'Old or damaged winding insulation, moisture, voltage spikes, overheating over time.',
    check: 'Isolate power first. A licensed electrician or motor rewinder should test the windings (megger test).',
  },
  cooling_fan_failure: {
    title: 'Cooling fan failure',
    what: 'The fan that blows air over the motor is not working, so heat builds up along the body.',
    signs: 'Motor hotter than usual, no airflow at the fan cowl, rattling or a broken fan behind the cover.',
    causes: 'Broken fan blades, fan slipped on the shaft, cowl blocked with dust or debris.',
    check: 'With power isolated, remove the fan cover and check the fan and air path. Cheap to fix if caught early.',
  },
  stuck_rotor: {
    title: 'Stuck rotor',
    what: 'The motor is powered but the shaft is not turning, so current and heat climb fast.',
    signs: 'Loud hum with no rotation, fast overheating, overload tripping.',
    causes: 'Seized bearings, a jammed load (pump or fan blocked), or a mechanical obstruction.',
    check: 'Turn it off now. Check the load and bearings turn freely by hand with power isolated.',
  },
};

RESULTS.crack = {
  crack: {
    title: 'Crack in concrete',
    what: 'The photo shows a visible crack in the concrete surface. Red boxes mark where. The photo alone cannot say whether it is cosmetic or structural.',
    signs: 'A dark line in the surface, sometimes with flaking, rust stains or damp along it.',
    causes: 'Shrinkage as concrete dries, temperature movement, settlement, overload, or rusting steel inside pushing it apart.',
    check: 'Measure the width (a coin or crack card helps) and photograph it with a tape measure. Wider than about 0.3 mm, growing, or near rust stains: ask a structural engineer.',
  },
  no_crack: {
    title: 'No crack found',
    what: 'The model did not find a visible crack in this photo.',
    signs: 'Surface looks continuous.',
    causes: 'No crack detected. Very fine hairline cracks, or cracks hidden by paint or dirt, can still be missed.',
    check: 'Nothing needed now. Re-photograph the same spot on the next visit to compare.',
  },
};

export const resultKey = (label) => label.toLowerCase().replace(/[^a-z]+/g, '_').replace(/^_|_$/g, '');
