#!/bin/sh
# Re-port the Claude Design prototype into the React app after the design changes.
#   sh web/scripts/port_design.sh ~/Downloads/infrasensor/source/Main.dc.html
# Regenerates src/infrasensor/{template.jsx,main.css,Main.jsx}; ScanPanel, InfoCard, glossary, css.js are kept.
set -e
SRC="${1:-$HOME/Downloads/infrasensor/source/Main.dc.html}"
DIR="$(cd "$(dirname "$0")/.." && pwd)/src/infrasensor"
HERE="$(cd "$(dirname "$0")" && pwd)"
python3 "$HERE/dc2jsx.py" "$SRC" "$DIR"
python3 "$HERE/port_logic.py" "$DIR"
python3 "$HERE/patch_template.py" "$DIR"
python3 "$HERE/plain_names.py" "$DIR/Main.jsx" "$DIR/template.jsx"
echo "Ported $SRC -> $DIR"
