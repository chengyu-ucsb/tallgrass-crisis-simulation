#!/usr/bin/env python3
"""Build the printable quick reference from the website's shared content."""

import json
import os
from pathlib import Path
import shutil
import subprocess
from xml.sax.saxutils import escape

import reportlab
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / "docs" / "downloads" / "Tallgrass_Quick_Reference.pdf"
NODE = os.environ.get("CODEX_PRIMARY_RUNTIME_NODE") or shutil.which("node")
if not NODE:
    raise SystemExit("Node.js is required to read the shared website content.")

source = subprocess.check_output(
    [NODE, "-e", "const fs=require('fs'),vm=require('vm');const s={window:{}};"
     "vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),s);"
     "process.stdout.write(JSON.stringify(s.window.CRISIS_CONTENT));",
     str(ROOT / "docs" / "content.js")],
    text=True,
)
data = json.loads(source)
DESTINATION.parent.mkdir(parents=True, exist_ok=True)

FOREST = colors.HexColor("#1d3933")
INK = colors.HexColor("#222a26")
MUTED = colors.HexColor("#56625a")
LINE = colors.HexColor("#d7dfd4")
PALE = colors.HexColor("#f0f3eb")
FONT_ROOT = Path(reportlab.__file__).resolve().parent / "fonts"
pdfmetrics.registerFont(TTFont("ReferenceSans", str(FONT_ROOT / "Vera.ttf")))
pdfmetrics.registerFont(TTFont("ReferenceSans-Bold", str(FONT_ROOT / "VeraBd.ttf")))
pdfmetrics.registerFontFamily("ReferenceSans", normal="ReferenceSans", bold="ReferenceSans-Bold")

styles = {
    "course": ParagraphStyle("Course", fontName="ReferenceSans-Bold", fontSize=8.5,
                             leading=11, textColor=FOREST, spaceAfter=8),
    "title": ParagraphStyle("Title", fontName="ReferenceSans-Bold", fontSize=23,
                            leading=27, textColor=FOREST, spaceAfter=9),
    "intro": ParagraphStyle("Intro", fontName="ReferenceSans", fontSize=10.5,
                            leading=14, textColor=INK, spaceAfter=11),
    "heading": ParagraphStyle("Heading", fontName="ReferenceSans-Bold", fontSize=11.5,
                              leading=15, textColor=FOREST, spaceBefore=13, spaceAfter=7),
    "body": ParagraphStyle("Body", fontName="ReferenceSans", fontSize=10.25,
                           leading=13.7, textColor=INK, spaceAfter=7),
    "table": ParagraphStyle("Table", fontName="ReferenceSans", fontSize=10,
                            leading=13, textColor=INK, alignment=TA_LEFT),
    "table_head": ParagraphStyle("TableHead", fontName="ReferenceSans-Bold", fontSize=9,
                                 leading=12, textColor=FOREST),
}


def text(value):
    return escape(value.replace("\u2013", "-").replace("\u2014", "-").replace("\u2011", "-"))


def paragraph(value, style="body"):
    return Paragraph(value, styles[style])


story = [
    paragraph("COMM 5009  |  CRISIS-IN-A-BOX", "course"),
    paragraph("Tallgrass quick reference", "title"),
    paragraph("One team memo. Three updates. Use only the information available at each point.", "intro"),
    paragraph("Team roles", "heading"),
]

rows = [[paragraph("Role", "table_head"), paragraph("Responsibility", "table_head")]]
for role in data["roles"]:
    rows.append([paragraph("<b>" + text(role["name"]) + "</b>", "table"),
                 paragraph(text(role["description"]), "table")])
roles = Table(rows, colWidths=[117, 411], hAlign="LEFT")
roles.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), PALE),
    ("LINEBELOW", (0, 0), (-1, -1), .45, LINE),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
]))
story.extend([roles, paragraph("Questions for each update", "heading")])
for index, concept in enumerate(data["guide"]["concepts"], 1):
    story.append(paragraph(f'<b>{index}. {text(concept["title"])}.</b> {text(concept["prompt"])}'))

story.extend([
    paragraph("Keep a record", "heading"),
    paragraph("Before the next update, write what you decided and what changed your thinking in section 7. "
              "Preserve your original statement and record later revisions."),
    paragraph("Turn in", "heading"),
    paragraph("<b>Team:</b> One complete briefing memo on Canvas by the end of class. "
              "Read your public statement and explain one changed decision in a two-minute briefing."),
    paragraph("<b>Individual:</b> An approximately two-page Post-Crisis Evaluation on Canvas by "
              "<b>Friday, November 20, 2026, at 11:59 p.m.</b>"),
])


def footer(canvas, document):
    canvas.saveState()
    canvas.setFont("ReferenceSans", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(42, 25, "Fictional classroom scenario  |  Chengyu Fang  |  COMM 5009")
    canvas.restoreState()


document = SimpleDocTemplate(
    str(DESTINATION), pagesize=letter, rightMargin=42, leftMargin=42,
    topMargin=33, bottomMargin=40, title="Tallgrass quick reference",
    author="Chengyu Fang", subject="COMM 5009 Crisis-in-a-Box classroom reference",
)
document.build(story, onFirstPage=footer, onLaterPages=footer)
print(DESTINATION)
