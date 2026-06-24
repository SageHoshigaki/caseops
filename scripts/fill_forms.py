#!/usr/bin/env python3
"""
fill_forms.py — CaseOps PDF form filler
Usage: python fill_forms.py '<json_payload>' '<output_dir>'

Called by Tauri as a sidecar. Reads a JSON payload containing all packet
data and fills the appropriate PDF forms for the selected district.

Install deps:  pip install pypdf
Place template PDFs in:  templates/california/  and  templates/georgia/
"""

import json
import sys
import os
from datetime import date
from pathlib import Path
from pypdf import PdfReader, PdfWriter

TEMPLATES = Path(__file__).parent / "templates"
TODAY = date.today().strftime("%m/%d/%Y")

# ─── Entry point ──────────────────────────────────────────────────────────────
def main():
    if len(sys.argv) < 3:
        print("Usage: fill_forms.py '<json>' '<output_dir>'", file=sys.stderr)
        sys.exit(1)

    payload    = json.loads(sys.argv[1])
    output_dir = Path(sys.argv[2])
    output_dir.mkdir(parents=True, exist_ok=True)

    packet     = payload["packet"]
    client     = payload["client"]
    attorney   = payload["attorney"]
    defendants = payload["defendants"]
    violations = payload["violations"]
    district   = packet["district"]

    results = []

    if district == "california":
        results += fill_ao440(packet, client, attorney, defendants, output_dir)
        results += fill_cv030(packet, client, attorney, defendants, output_dir)
        results += fill_cv071(packet, client, attorney, defendants, violations, output_dir)
    elif district == "georgia":
        results += fill_ao440(packet, client, attorney, defendants, output_dir)
        results += fill_js44(packet, client, attorney, defendants, violations, output_dir)

    print(json.dumps({"success": True, "files": results}))


# ─── Helpers ──────────────────────────────────────────────────────────────────
def fill_pdf(template_path: Path, field_values: dict, output_path: Path) -> str:
    """Fill a fillable PDF and flatten it."""
    reader = PdfReader(str(template_path))
    writer = PdfWriter()
    writer.append(reader)

    for page in writer.pages:
        writer.update_page_form_field_values(page, field_values)

    with open(output_path, "wb") as f:
        writer.write(f)

    return str(output_path)


def attorney_block(a: dict) -> str:
    """Multi-line attorney block for form header fields."""
    lines = [a["name"], a["firm"], a["address"], a["phone"]]
    if a.get("email"):
        lines.append(a["email"])
    return "\n".join(lines)


def defendant_names(defendants: list) -> str:
    return "\n".join(d["name"] for d in defendants)


def cause_of_action(violations: list) -> str:
    """Concatenate statutes + brief descriptions for Section VI / V."""
    parts = []
    for v in violations:
        parts.append(f"{v['statute']} — {v['description']}")
    return "; ".join(parts)


def checked(value="Yes") -> str:
    return value


# ─── AO 440 — Summons ─────────────────────────────────────────────────────────
def fill_ao440(packet, client, attorney, defendants, output_dir):
    results = []
    template = TEMPLATES / "california" / "ao440.pdf"   # same form for both districts

    for i, defendant in enumerate(defendants):
        suffix  = f"_{i+1}" if len(defendants) > 1 else ""
        outfile = output_dir / f"AO440_Summons{suffix}.pdf"

        district_label = (
            "Central District of California"
            if packet["district"] == "california"
            else "Northern District of Georgia"
        )

        fields = {
            "Dist":               district_label,
            "Plaintiff":          client["name"],
            "Defendant":          defendant["name"],
            "Defendant address":  defendant["serviceAddress"],
            "Plaintiff address":  attorney_block(attorney),
            "Civil action number": packet["caseNumber"],
            "Date_Today":         TODAY,
            # Page 2 — repeat defendant name
            "Defendant2":         defendant["name"],
        }

        fill_pdf(template, fields, outfile)
        results.append(str(outfile))

    return results


# ─── CV-030 — Notice of Interested Parties (California only) ──────────────────
def fill_cv030(packet, client, attorney, defendants, output_dir):
    template = TEMPLATES / "california" / "CV-030.pdf"
    outfile  = output_dir / "CV030_Interested_Parties.pdf"

    # Build interested parties table content
    party_names       = "\n".join(d["name"] for d in defendants)
    party_connections = "\n".join("Direct pecuniary interest as named defendant" for _ in defendants)

    fields = {
        "topmostSubform[0].Page1[0].IMPORTANT_INFO[0]": attorney_block(attorney),
        "topmostSubform[0].Page1[0].FOR[0]":            f"Plaintiff {client['name']}",
        "topmostSubform[0].Page1[0].PLANTIFF[0]":       client["name"],
        "topmostSubform[0].Page1[0].DEFENDANTS[0]":     defendant_names(defendants),
        "topmostSubform[0].Page1[0].CASE_NUM[0]":       packet["caseNumber"],
        "topmostSubform[0].Page1[0].NAME[0]":           party_names,
        "topmostSubform[0].Page1[0].PARTY_S[0]":        "Defendant" if len(defendants) == 1 else "Defendants",
        "topmostSubform[0].Page1[0].CONNECTION[0]":     party_connections,
        "topmostSubform[0].Page1[0].DATE[0]":           TODAY,
        "topmostSubform[0].Page1[0].APPEARING[0]":      attorney["name"],
        "topmostSubform[0].Page1[0].APPEARING[1]":      attorney["name"],
    }

    fill_pdf(template, fields, outfile)
    return [str(outfile)]


# ─── CV-071 — Civil Cover Sheet (California) ──────────────────────────────────
def fill_cv071(packet, client, attorney, defendants, violations, output_dir):
    template = TEMPLATES / "california" / "CV-071.pdf"
    outfile  = output_dir / "CV071_Civil_Cover_Sheet.pdf"

    fields = {
        # Section I — parties
        "I a PLAINTIFFS   Check box if you are representing yourself": client["name"],
        "DEFENDANTS  Check box if you are representing yourself":      defendant_names(defendants),
        "b County of Residence of First Listed Plaintiff":             client.get("county", ""),
        "County of Residence of First Listed Defendant":               defendants[0].get("county", "") if defendants else "",

        # Section I — attorneys
        "c Attorneys Firm Name Address and Telephone Number  If you are representing yourself provide the same information": attorney_block(attorney),
        "Attorneys Firm Name Address and Telephone Number  If you are representing yourself provide the same information":   "",  # defense side — blank

        # Section V — complaint
        "Check Yes only if demanded in complaint":  packet.get("amountDemanded", ""),
        "Amount Demanded":                          packet.get("amountDemanded", ""),

        # Section VI — cause of action
        "VII NATURE OF SUIT Place an X in one box only": cause_of_action(violations),

        # Section IX — identical/related cases (default No)
        "If yes list case numbers":                 "",
        "If yes you must file a Notice of Related Cases  See Local Rule 8313": "",

        # CACD Division
        "Initial Division in CACD":                 packet.get("cacdDivision", "Western"),

        # Date
        "Date7_af_date":                            TODAY,
    }

    # Jury demand checkbox
    if packet.get("juryDemand"):
        fields["V REQUESTED IN COMPLAINT  JURY DEMAND"] = "Yes"

    # Origin — always "1 Original Proceeding" for new cases
    fields["Origin"] = "1"

    # Nature of suit checkboxes — check fields mapped to selected violations
    for v in violations:
        field = v.get("cv071CheckboxField")
        if field:
            fields[field] = "Yes"

    fill_pdf(template, fields, outfile)
    return [str(outfile)]


# ─── JS44 — Civil Cover Sheet (Georgia) ───────────────────────────────────────
def fill_js44(packet, client, attorney, defendants, violations, output_dir):
    template = TEMPLATES / "georgia" / "JS44_202409.pdf"
    outfile  = output_dir / "JS44_Civil_Cover_Sheet.pdf"

    fields = {
        "Text1":   client["name"],
        "Text2":   defendant_names(defendants),
        "Text3":   client.get("county", ""),
        "Text4":   defendants[0].get("county", "") if defendants else "",
        "Text5":   attorney_block(attorney),
        "Text6":   "",   # defense attorney — blank
        "Text7":   cause_of_action(violations),
        "Text8":   packet.get("amountDemanded", ""),
        "Text9":   "",   # related case judge
        "Text10":  "",   # related case docket
        "Text11":  attorney["name"],
        "Text152": TODAY,
    }

    # Nature of suit checkboxes
    for v in violations:
        field = v.get("js44CheckboxField")
        if field:
            fields[field] = "Yes"

    # Jury demand
    if packet.get("juryDemand"):
        fields["Check Box1"] = "Yes"

    # Origin — box 1 (Original Proceeding)
    fields["Check Box36"] = "Yes"

    fill_pdf(template, fields, outfile)
    return [str(outfile)]


if __name__ == "__main__":
    main()
