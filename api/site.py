"""Northside Annex site registry: map layout, sensor kinds, and each sensor's binding to backend data.

Every UI sensor is bound to one channel of a wallsense unit's time-series. The displayed
reading is ``base + gain * (channel - channel_healthy_baseline)``, so a sensor sits at its
installed baseline while its unit is healthy and drifts as the unit's fault develops.
"""

SITE = {"id": "northside-annex", "name": "Northside Annex", "initials": "NA"}

# Display + threshold config per sensor kind. `up` = higher readings are worse.
KINDS = {
    "humidity": {"name": "Humidity", "dev": "Humidity sensor", "unit": "%RH", "lo": 30, "hi": 100, "w": 70, "c": 85, "up": True, "dp": 0},
    "moisture": {"name": "Membrane moisture", "dev": "Moisture sensor", "unit": "%", "lo": 0, "hi": 40, "w": 15, "c": 30, "up": True, "dp": 0},
    "thermal": {"name": "Temperature rise", "dev": "Thermal sensor", "unit": "°C", "lo": 0, "hi": 8, "w": 2.5, "c": 5, "up": True, "dp": 1, "plus": True},
    "vibration": {"name": "Vibration", "dev": "Vibration sensor", "unit": "mm/s", "lo": 0, "hi": 10, "w": 4, "c": 7, "up": True, "dp": 1},
    "acoustic": {"name": "Leak noise", "dev": "Acoustic sensor", "unit": "dB", "lo": 15, "hi": 55, "w": 32, "c": 40, "up": True, "dp": 0},
    "pressure": {"name": "Pressure", "dev": "Pressure sensor", "unit": "psi", "lo": 0, "hi": 25, "w": 13, "c": 9, "up": False, "dp": 0},
    "strain": {"name": "Strain", "dev": "Strain gauge", "unit": "µε", "lo": 100, "hi": 400, "w": 230, "c": 320, "up": True, "dp": 0},
    "sprinkler": {"name": "Water pressure", "dev": "Pressure sensor", "unit": "psi", "lo": 20, "hi": 90, "w": 58, "c": 45, "up": False, "dp": 0},
    "crack": {"name": "Crack width", "dev": "Crack gauge", "unit": "mm", "lo": 0, "hi": 3, "w": 0.8, "c": 1.5, "up": True, "dp": 1},
}

# Default wallsense channel and calibration gain per sensor kind.
KIND_BINDING = {
    "humidity": ("moisture", 1.8),
    "moisture": ("moisture", 2.5),
    "thermal": ("temperature", 0.4),
    "vibration": ("vibration_rms", 12.0),
    "acoustic": ("flow_rate", 6.0),
    "pressure": ("pressure", 0.3),
    "sprinkler": ("pressure", 1.5),
    "strain": ("current", 15.0),
    "crack": ("vibration_rms", 5.0),
}

LEVELS = {
    "roof": {"key": "roof", "name": "Roof", "entry": {"x": 40, "y": 340}, "lanes": [66, 122, 187, 290],
             "rooms": [{"label": "Stair B", "x": 22, "y": 344, "w": 38, "h": 32}]},
    "l1": {"key": "l1", "name": "Level 1", "entry": {"x": 40, "y": 318}, "lanes": [180],
           "rooms": [
               {"label": "Mechanical", "x": 20, "y": 20, "w": 130, "h": 120}, {"label": "Electrical", "x": 160, "y": 20, "w": 118, "h": 86},
               {"label": "Offices", "x": 70, "y": 210, "w": 70, "h": 80}, {"label": "Clinic", "x": 160, "y": 210, "w": 118, "h": 80},
               {"label": "Lobby", "x": 100, "y": 300, "w": 100, "h": 80}, {"label": "Stair B", "x": 20, "y": 300, "w": 40, "h": 40},
           ]},
    "grounds": {"key": "grounds", "name": "Grounds", "entry": {"x": 165, "y": 158}, "lanes": [200, 285],
                "rooms": [{"label": "Annex building", "x": 80, "y": 30, "w": 160, "h": 110},
                          {"label": "Parking deck", "x": 24, "y": 250, "w": 252, "h": 120}]},
}


def _s(id, kind, zone, short, level, box, base, batt, mount, cat, unit, **extra):
    return {"id": id, "kind": kind, "zone": zone, "short": short, "level": level, "box": box, "base": base,
            "batt": batt, "mount": mount, "cat": cat, "unit": unit, **extra}


# `unit` is the wallsense unit whose time-series drives the sensor. `model` names the
# classifier run on the sensor's captured spectrogram (paths relative to the repo root).
BEARING = "vibro-acoustic-bearing-fault-diagnosis/demo_samples/"
SOUND = "wallsense/data/spectrograms/"  # held-out recordings (not seen in training)
SENSORS = [
    _s("RH-V1", "humidity", "Vent 1", "V1", "roof", [50, 80, 24, 24], 55, 81, "inside the vent curb", "water", "102"),
    _s("RH-V2", "humidity", "Vent 2", "V2", "roof", [100, 80, 24, 24], 55, 77, "inside the vent curb", "water", "104"),
    _s("RH-V3", "humidity", "Vent 3", "V3", "roof", [150, 80, 24, 24], 55, 64, "inside the vent curb", "water", "202"),
    _s("RH-V4", "humidity", "Vent 4", "V4", "roof", [200, 80, 24, 24], 55, 90, "inside the vent curb", "water", "203"),
    _s("RH-V9", "humidity", "Vent 9", "V9", "roof", [250, 140, 24, 24], 55, 100, "inside the vent curb", "water", "504",
       pending=True),  # installed but not paired yet: appears after the in-app pairing flow
    _s("TH-V5", "thermal", "Vent 5", "V5", "roof", [50, 140, 24, 24], 0.5, 72, "on the vent collar", "mech", "304"),
    _s("RH-V6", "humidity", "Vent 6", "V6", "roof", [100, 140, 24, 24], 55, 81, "inside the vent curb", "water", "101"),
    _s("RH-V7", "humidity", "Vent 7", "V7", "roof", [150, 140, 24, 24], 55, 68, "inside the vent curb", "water", "204"),
    _s("RH-V8", "humidity", "Vent 8", "V8", "roof", [200, 140, 24, 24], 55, 83, "inside the vent curb", "water", "302"),
    _s("VB-R1", "vibration", "RTU-1", "RTU-1", "roof", [56, 210, 80, 44], 2.1, 88, "on the fan housing", "mech", "303",
       model=("bearing", BEARING + "healthy_3.png")),
    _s("VB-R2", "vibration", "RTU-2", "RTU-2", "roof", [170, 210, 80, 44], 2.1, 70, "on the fan housing", "mech", "301",
       model=("bearing", BEARING + "outer_race_1.png")),
    _s("MS-DN", "moisture", "Drain N", "DN", "roof", [245, 30, 24, 24], 9, 59, "beside the drain bowl", "water", "103"),
    _s("PR-B1", "pressure", "Boiler B-1", "B-1", "l1", [35, 45, 44, 30], 15, 92, "on the supply line", "mech", "101"),
    _s("VB-P2", "vibration", "Pump P-2", "P-2", "l1", [95, 95, 36, 26], 2.0, 85, "on the motor mount", "mech", "401",
       model=("bearing", BEARING + "healthy_3.png")),
    _s("AL-RA", "acoustic", "Riser A", "RA", "l1", [172, 120, 26, 26], 28, 76, "at the riser joint", "water", "101",
       model=("sound", SOUND + "pipe_leak/leak__ductile-iron-zone-1-0.25-MPa-NA-noise-logger-0-1__s0.png")),
    _s("AL-RB", "acoustic", "Riser B", "RB", "l1", [248, 120, 26, 26], 27, 80, "at the riser joint", "water", "402",
       model=("sound", SOUND + "healthy/noleak__ductile-iron-NA-NA-NA-noise-logger-4-5-11__s0.png")),
    _s("TH-EL", "thermal", "Panel L1", "EL", "l1", [205, 48, 44, 28], 1.0, 95, "inside the panel door", "elec", "201"),
    _s("SR-L1", "sprinkler", "Sprinkler riser", "SR", "l1", [210, 120, 26, 26], 65, 84, "on the riser above the check valve", "elec", "101"),
    _s("EV-E1", "vibration", "Elevator 1", "E1", "l1", [22, 215, 40, 40], 2.4, 78, "on the car frame", "mech", "502",
       gain=16.0, model=("bearing", BEARING + "cage_3.png")),
    _s("CR-PS", "crack", "Parapet S", "PS", "roof", [180, 352, 56, 18], 0.4, 74, "across the parapet crack", "struct", "103"),
    _s("AL-H2", "acoustic", "Hydrant H-2", "H-2", "grounds", [30, 175, 22, 22], 27, 73, "on the hydrant barrel", "water", "403",
       model=("sound", SOUND + "healthy/noleak__pe-NA-NA-NA-hydrophone-2-3-1__s0.png")),
    _s("AL-H3", "acoustic", "Hydrant H-3", "H-3", "grounds", [250, 175, 22, 22], 28, 66, "on the hydrant barrel", "water", "502",
       channel="moisture", gain=1.2, model=("sound", SOUND + "pipe_leak/leak__pe-NA-0.1869-MPa-3.77-ms-noise-logger-0-1-1__s0.png")),
    _s("PR-V7", "pressure", "Valve pit V-7", "V-7", "grounds", [140, 212, 26, 22], 60, 0, "in the valve pit", "water", None,
       off=True, since="23 Sep"),
    _s("SG-P1", "strain", "Pier P1", "P1", "grounds", [60, 300, 18, 18], 190, 71, "on the pier face", "struct", "404"),
    _s("SG-P2", "strain", "Pier P2", "P2", "grounds", [120, 300, 18, 18], 190, 62, "on the pier face", "struct", "304"),
    _s("SG-P3", "strain", "Pier P3", "P3", "grounds", [180, 300, 18, 18], 190, 58, "on the pier face", "struct", "501"),
    _s("SG-P4", "strain", "Pier P4", "P4", "grounds", [240, 300, 18, 18], 190, 9, "on the pier face", "struct", "503"),
]

# Plain-language explanation shown when a sensor is in a problem state.
ISSUES = {
    "RH-V6": {"h": "Water is getting into roof vent 6", "urg": "Fix now", "who": "Roofer",
              "note": "Water is getting into the duct at the vent curb.",
              "what": "The air inside the vent duct is almost fully saturated. That usually means rain is getting past the seal where the vent meets the roof.",
              "why": "Water in the duct can soak insulation, rust the duct and drip into the ceiling below. Wet insulation can grow mold if it stays wet.",
              "todo": ["Check the vent curb and flashing for gaps or lifted edges", "Look for wet insulation or ceiling stains in the room below", "Seal or re-flash the curb, then watch this reading drop"]},
    "AL-RA": {"h": "Pipe leak at Riser A", "urg": "Fix now", "who": "Plumber",
              "note": "Continuous leak noise at the riser joint.",
              "what": "The sensor hears a steady hiss at the riser joint. That is the sound a pressurized pipe makes when it leaks.",
              "why": "A leak inside a wall can go unseen until it damages drywall, flooring or wiring nearby.",
              "todo": ["Open the riser access panel and look for drips or rust at the joint", "If water is spraying, close the riser shut-off valve", "Have the joint repaired and check that the noise stops"]},
    "MS-DN": {"h": "Wet roof insulation near the north drain", "urg": "This week", "who": "Roofer",
              "note": "Moisture is building under the membrane around the drain.",
              "what": "Moisture under the roof membrane around the drain is higher than normal. Water is likely getting under the membrane at the drain edge.",
              "why": "Trapped water weakens roof insulation and can turn into a leak inside the building.",
              "todo": ["Clear leaves and debris from the drain", "Check the drain ring and membrane edge for gaps", "Ask a roofer to test the area if the reading keeps rising"]},
    "AL-H3": {"h": "Possible slow leak at Hydrant H-3", "urg": "This week", "who": "Water utility",
              "note": "Intermittent leak noise at the main valve.",
              "what": "The sensor picks up leak noise on and off near the hydrant main valve.",
              "why": "Hydrant leaks waste water and can wash out the soil around the base.",
              "todo": ["Look for pooling water or soft ground around the hydrant", "Report it to the water utility or the hydrant owner"]},
    "PR-V7": {"h": "Valve pit sensor is offline", "urg": "This week", "who": "Your site team",
              "note": "No readings since 23 Sep. Check power and signal at the pit.",
              "what": "This sensor hasn't sent a reading since 23 Sep, so conditions in the pit are unknown.",
              "why": "Until it reports again, a problem at this valve won't show up in the app.",
              "todo": ["Check that the pit is not flooded", "Check the sensor battery and antenna"]},
    "TH-EL": {"h": "A breaker in Panel L1 is running warm", "urg": "This week", "who": "Licensed electrician",
              "what": "Heat inside the panel is higher than normal. A loose connection or an overloaded circuit is the usual cause.",
              "why": "Heat at electrical connections tends to get worse over time and is a fire risk.",
              "todo": ["Do not open the panel unless you are qualified to", "Reduce the load on busy circuits if you can", "Have an electrician inspect and tighten the connections"]},
    "SR-L1": {"h": "Fire sprinkler pressure is low", "urg": "Within 48 hours", "who": "Fire protection contractor",
              "what": "Water pressure in the sprinkler riser is below its normal level.",
              "why": "Sprinklers need enough pressure to put out a fire. Low pressure can mean a closed valve or a leak.",
              "todo": ["Check that the main sprinkler valve is fully open", "Look for leaks around the riser", "Call your fire protection contractor to test the system"]},
    "VB-R2": {"h": "RTU-2 fan bearing is wearing out", "urg": "Within 48 hours", "who": "HVAC technician",
              "note": "The vibration pattern matches fan bearing wear.",
              "what": "The fan is shaking harder than normal, in a pattern that matches a worn bearing.",
              "why": "If the bearing fails, the unit stops cooling and the motor can be damaged, which costs more to fix.",
              "todo": ["Book an HVAC technician to inspect the fan bearing", "Listen for grinding or squealing while the fan runs"]},
    "TH-V5": {"h": "Warm air is leaking at Vent 5", "urg": "This month", "who": "HVAC technician",
              "note": "Warm air is escaping around the vent collar.",
              "what": "The vent collar is warmer than the air around it, so heated or cooled air is escaping.",
              "why": "The leak wastes energy and can let moisture condense inside the roof.",
              "todo": ["Check the collar seal and fasteners", "Reseal the joint"]},
    "PR-B1": {"h": "Boiler pressure is dropping", "urg": "This week", "who": "Boiler technician",
              "note": "Pressure has dropped below baseline. Check for a slow leak.",
              "what": "Pressure in the boiler loop is below normal. The system is probably losing water somewhere.",
              "why": "Low pressure can shut the boiler off, and a hidden leak can cause water damage.",
              "todo": ["Read the pressure gauge on the boiler", "Look for drips at valves and fittings", "Have a technician find and fix the leak"]},
    "EV-E1": {"h": "Elevator 1 ride is rougher than normal", "urg": "This month", "who": "Elevator service company",
              "what": "The car shakes more than usual while it moves. Worn guide rollers or rails are common causes.",
              "why": "A rough ride wears parts faster and can lead to the elevator being taken out of service.",
              "todo": ["Ride the car and note where the shaking happens", "Contact your elevator service company"]},
    "SG-P2": {"h": "Pier P2 is under more strain", "urg": "This month", "who": "Structural engineer",
              "note": "Strain is trending above baseline under load.",
              "what": "The pier is flexing more under load than it did when the sensor was installed.",
              "why": "Rising strain can mean the pier or the supports around it are getting weaker.",
              "todo": ["Look for new cracks or rust stains on the pier", "Keep heavy vehicles away from P2 if you see damage", "Have a structural engineer review the readings"]},
    "CR-PS": {"h": "Crack in the south parapet is widening", "urg": "This month", "who": "Structural engineer or mason",
              "what": "The crack gauge shows the crack has opened wider than when it was installed.",
              "why": "A growing crack lets water in and can mean the wall is moving.",
              "todo": ["Photograph the crack with a tape measure in the shot", "Keep the area below clear if any pieces look loose", "Ask a structural engineer or mason to assess it"]},
}


# Machines a scan can be linked to, with the live sensors mounted on each. Linking a scan to a machine
# adds these sensors' current readings to the combined per-machine verdict.
ASSETS = {
    "RTU-1": {"name": "RTU-1 (rooftop HVAC unit)", "sensors": ["VB-R1"]},
    "RTU-2": {"name": "RTU-2 (rooftop HVAC unit)", "sensors": ["VB-R2"]},
    "Pump P-2": {"name": "Pump P-2", "sensors": ["VB-P2"]},
    "Elevator 1": {"name": "Elevator 1 motor", "sensors": ["EV-E1"]},
    "Boiler B-1": {"name": "Boiler B-1", "sensors": ["PR-B1"]},
    "Panel L1": {"name": "Electrical panel L1", "sensors": ["TH-EL"]},
    "Pier P1": {"name": "Pier P1 (parking deck)", "sensors": ["SG-P1"]},
    "Pier P2": {"name": "Pier P2 (parking deck)", "sensors": ["SG-P2"]},
    "Parapet S": {"name": "South parapet wall", "sensors": ["CR-PS"]},
}
