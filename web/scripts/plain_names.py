"""Replace facility-manager jargon (RTU-1, Riser A, Pier P2...) with names anyone understands.

Applied to the generated Main.jsx / template.jsx (activity log, chat examples, ticket history) and to
api/site.py (sensor names and problem text), so the whole app uses the same plain names.

Usage: python plain_names.py FILE [FILE ...]
"""

import re
import sys
from pathlib import Path

RENAMES = [
    (r"\bInfrasensor\b", "Raksha"),  # product name (lowercase code paths/keys are left alone)
    (r"/\^RTU/", "/^Rooftop AC/"),
    (r"\bRTU-(\d)", r"Rooftop AC \1"),
    (r"/\^Riser/", "/^Water pipe/"),
    (r"\bSprinkler riser\b", "Fire sprinkler pipe"),
    (r"\bsprinkler riser\b", "sprinkler pipe"),
    (r"\bRiser ([AB])\b", r"Water pipe \1"),
    (r"\briser\b", "pipe"),
    (r"\brisers\b", "pipes"),
    (r"\bPanel L1\b", "Electrical panel"),
    (r"\bBoiler B-1\b", "Boiler"),
    (r"\bPump P-2\b", "Water pump"),
    (r"\bDrain N\b", "Roof drain"),
    (r"\bParapet S\b", "Roof edge wall"),
    (r"\bthe south parapet\b", "the roof edge wall"),
    (r"\bparapet\b", "roof edge wall"),
    (r"/\^Hydrant/", "/^Fire hydrant/"),
    (r"\bHydrant H-(\d)", r"Fire hydrant \1"),
    (r"\bValve pit V-7\b", "Water valve pit"),
    (r"/\^Pier/", "/^Parking column/"),
    (r"\bPier P(\d)", r"Parking column \1"),
    (r"/\^Vent/", "/^Roof vent/"),
    (r"\bVent (\d)", r"Roof vent \1"),
]

# Short labels on the map chips (only the larger chips have room for a word).
SHORTS = {"RTU-1": "AC 1", "RTU-2": "AC 2", "B-1": "Boiler", "P-2": "Pump", "EL": "Panel", "E1": "Lift", "PS": "Wall"}


def rename(text: str) -> str:
    for pattern, repl in RENAMES:
        text = re.sub(pattern, repl, text)
    return text


if __name__ == "__main__":
    for f in sys.argv[1:]:
        path = Path(f)
        before = path.read_text()
        after = rename(before)
        path.write_text(after)
        print(f"{path.name}: {sum(1 for a, b in zip(before.splitlines(), after.splitlines()) if a != b)} lines renamed")
