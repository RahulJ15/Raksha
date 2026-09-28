"""Convert the Claude Design Main.dc.html template + logic into a React JSX template and logic module."""

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

SRC = Path(sys.argv[1])
OUT = Path(sys.argv[2])
html = SRC.read_text()

tpl_start = html.index("</helmet>") + len("</helmet>")
tpl_end = html.index("</x-dc>")
template = html[tpl_start:tpl_end]
styles = re.search(r"<helmet>.*?<style>(.*?)</style>", html, re.S).group(1)
logic = re.search(r"<script type=\"text/x-dc\"[^>]*>(.*?)</script>", html, re.S).group(1)

ATTR_MAP = {
    "class": "className", "for": "htmlFor", "text-anchor": "textAnchor", "autocomplete": "autoComplete",
    "viewbox": "viewBox", "onclick": "onClick", "onpointerup": "onPointerUp", "onpointerdown": "onPointerDown",
    "onpointermove": "onPointerMove", "onpointercancel": "onPointerCancel", "onpointerleave": "onPointerLeave",
    "onchange": "onChange", "onsubmit": "onSubmit", "onscroll": "onScroll", "tabindex": "tabIndex",
    "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin",
    "stroke-dasharray": "strokeDasharray", "stroke-dashoffset": "strokeDashoffset", "fill-rule": "fillRule",
    "clip-rule": "clipRule", "font-size": "fontSize", "font-weight": "fontWeight", "dominant-baseline": "dominantBaseline",
    "readonly": "readOnly", "maxlength": "maxLength",
}
VOID = {"br", "input", "img", "hr", "meta", "link", "source"}
EXPR = re.compile(r"\{\{\s*(.*?)\s*\}\}")


class Conv(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.scopes = []  # loop variable names
        self.stack = []
        self.depth = 0

    def expr(self, e):
        if e in ("true", "false", "null"):
            return e
        if re.fullmatch(r"-?\d+(\.\d+)?", e):
            return e
        head = e.split(".")[0]
        if not re.fullmatch(r"[A-Za-z_$][\w$]*(\.[\w$]+)*", e):
            raise ValueError("complex expr: " + e)
        return e if head in self.scopes else "v." + e

    def interp(self, s):
        """Attribute value -> JSX expression source."""
        m = EXPR.fullmatch(s.strip())
        if m:
            return self.expr(m.group(1))
        if "{{" not in s:
            return json.dumps(s)
        parts = EXPR.split(s)
        out = "`"
        for i, p in enumerate(parts):
            if i % 2:
                out += "${" + self.expr(p) + "}"
            else:
                out += p.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
        return out + "`"

    def emit(self, s):
        self.out.append("  " * self.depth + s)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "sc-if":
            self.emit("{" + self.interp(a["value"]) + " ? (<>")
            self.stack.append(("sc-if", None))
            self.depth += 1
            return
        if tag == "sc-for":
            var = a["as"]
            self.emit("{(" + self.interp(a["list"]) + " || []).map((" + var + ", " + var + "$i) => (<Fragment key={" + var + "$i}>")
            self.scopes.append(var)
            self.stack.append(("sc-for", var))
            self.depth += 1
            return
        parts = []
        for k, val in attrs:
            if k.startswith("hint-"):
                continue
            name = ATTR_MAP.get(k, k)
            val = "" if val is None else val
            if name == "style":
                parts.append("style={css(" + self.interp(val) + ")}")
            elif "{{" in val:
                parts.append(name + "={" + self.interp(val) + "}")
            else:
                parts.append(name + "=" + json.dumps(val))
        open_ = "<" + tag + ("" if not parts else " " + " ".join(parts))
        if tag in VOID:
            self.emit(open_ + " />")
            return
        self.emit(open_ + ">")
        self.stack.append((tag, None))
        self.depth += 1

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID and not tag.startswith("sc-"):
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        kind, var = self.stack.pop()
        assert kind == tag, (kind, tag, self.getpos())
        self.depth -= 1
        if tag == "sc-if":
            self.emit("</>) : null}")
        elif tag == "sc-for":
            self.scopes.pop()
            self.emit("</Fragment>))}")
        else:
            self.emit("</" + tag + ">")

    def handle_data(self, data):
        if not data.strip():
            return
        lead = " " if data[0].isspace() else ""
        trail = " " if data[-1].isspace() else ""
        text = re.sub(r"\s+", " ", data.strip())
        pieces = EXPR.split(text)
        out = "{' '}" if lead else ""
        for i, p in enumerate(pieces):
            if i % 2:
                out += "{" + self.expr(p) + "}"
            elif p:
                out += re.sub(r"[{}<>]", lambda m: "{'" + m.group(0) + "'}", p)
        out += "{' '}" if trail else ""
        self.emit(out)


c = Conv()
c.feed(template)
assert not c.stack, c.stack
body = "\n".join(c.out)

OUT.mkdir(parents=True, exist_ok=True)
(OUT / "template.jsx").write_text(
    "// Generated from infrasensor/source/Main.dc.html by dc2jsx.py. Edit the markup here directly.\n"
    "import { Fragment } from 'react';\nimport { css } from './css';\n\n"
    "export default function renderTemplate(v) {\n  return (<>\n" + body + "\n  </>);\n}\n"
)
(OUT / "main.css").write_text(styles.strip() + "\n")
(OUT / "logic.raw.js").write_text(logic)
print("ok", len(c.out), "lines")
