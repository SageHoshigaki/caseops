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
from pypdf.generic import NameObject

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
def fill_pdf(template_path: Path, field_values: dict, output_path: Path,
             radio_values: dict = None) -> str:
    """Fill a fillable PDF. Handles text fields via field_values and
    radio groups via radio_values separately for correctness."""
    reader = PdfReader(str(template_path))
    writer = PdfWriter()
    writer.append(reader)

    # Set text fields and checkboxes
    for page in writer.pages:
        writer.update_page_form_field_values(page, field_values)

    # FIX #6: Handle radio groups properly — pypdf needs direct widget manipulation
    if radio_values:
        for field_name, value in radio_values.items():
            set_radio(writer, field_name, value)

    with open(output_path, "wb") as f:
        writer.write(f)

    return str(output_path)


def set_radio(writer, field_name, value):
    """Set a radio button group to a specific value using pypdf."""
    try:
        for page in writer.pages:
            annots = page.get("/Annots")
            if not annots:
                continue
            for annot in annots:
                obj = annot.get_object()
                t = obj.get("/T", "")
                if str(t) == field_name:
                    # This is a radio group parent — set its /V value
                    obj[NameObject("/V")] = NameObject("/" + value)
                    # Update kids
                    kids = obj.get("/Kids", [])
                    for kid in kids:
                        ko = kid.get_object()
                        ap = ko.get("/AP", {})
                        if hasattr(ap, 'get_object'):
                            ap = ap.get_object()
                        n = ap.get("/N", {})
                        if hasattr(n, 'get_object'):
                            n = n.get_object()
                        if hasattr(n, 'keys'):
                            opts = [str(k).lstrip("/") for k in n.keys() if str(k) != "/Off"]
                            if value in opts:
                                ko[NameObject("/AS")] = NameObject("/" + value)
                            else:
                                ko[NameObject("/AS")] = NameObject("/Off")
    except Exception as e:
        print(f"Warning: set_radio({field_name}, {value}) failed: {e}", file=sys.stderr)


def attorney_block(a: dict) -> str:
    """Multi-line attorney block for form header fields."""
    # FIX #18: Consistent format matching filed examples
    lines = [a["name"]]
    if a.get("barNumber"):
        lines[0] += f" ({a['barNumber']})"
    lines.append(a["firm"])
    lines.append(a["address"])
    if a.get("phone"):
        lines.append("P: " + a["phone"])
    if a.get("email"):
        lines.append("E: " + a["email"])
    return "\n".join(filter(None, lines))


def attorney_block_cdca(a: dict) -> str:
    """CDCA-style attorney block with Telephone: prefix."""
    lines = [a["name"]]
    if a.get("barNumber"):
        lines[0] += f" ({a['barNumber']})"
    lines.append(a["firm"])
    lines.append(a["address"])
    if a.get("phone"):
        lines.append("Telephone: " + a["phone"])
    return "\n".join(filter(None, lines))


def defendant_names(defendants: list) -> str:
    return ", ".join(d["name"] for d in defendants)


def cause_of_action(violations: list) -> str:
    parts = []
    for v in violations:
        parts.append(f"{v['statute']} — {v['description']}")
    return "; ".join(parts)


# ─── AO 440 — Summons ─────────────────────────────────────────────────────────
def fill_ao440(packet, client, attorney, defendants, output_dir):
    results = []
    # FIX #3: Select template per district
    if packet["district"] == "georgia":
        template = TEMPLATES / "georgia" / "ao440.pdf"
    else:
        template = TEMPLATES / "california" / "ao440.pdf"

    for i, defendant in enumerate(defendants):
        suffix  = f"_{i+1}" if len(defendants) > 1 else ""
        outfile = output_dir / f"AO440_Summons{suffix}.pdf"

        fields = {
            # FIX #2: Use "Dist.Info" not "Dist" for the dropdown field
            "Dist.Info":          (
                "         Central District of California"
                if packet["district"] == "california"
                else "       Northern District of Georgia "
            ),
            "Plaintiff":          client["name"],
            "Defendant":          defendant["name"],
            "Defendant address":  defendant["serviceAddress"],
            "Plaintiff address":  attorney_block(attorney),
            "Civil action number": packet.get("caseNumber", ""),
            "Date_Today":         TODAY,
            "Defendant2":         defendant["name"],
        }

        fill_pdf(template, fields, outfile)
        results.append(str(outfile))

    return results


# ─── CV-030 — Notice of Interested Parties (California only) ──────────────────
def fill_cv030(packet, client, attorney, defendants, output_dir):
    template = TEMPLATES / "california" / "CV-030.pdf"
    outfile  = output_dir / "CV030_Interested_Parties.pdf"
    P = "topmostSubform[0].Page1[0]."

    fields = {
        # FIX #15-16: Correct field values matching filed examples
        f"{P}IMPORTANT_INFO[0]": attorney_block_cdca(attorney),
        f"{P}FOR[0]":            f"Plaintiff, {client['name']}",
        f"{P}PLANTIFF[0]":       client["name"],
        f"{P}DEFENDANTS[0]":     defendant_names(defendants),
        f"{P}CASE_NUM[0]":       packet.get("caseNumber", ""),
        # Interested parties table — plaintiff with no special pecuniary interest
        f"{P}NAME[0]":           client["name"],
        f"{P}PARTY_S[0]":        "Plaintiff",
        f"{P}CONNECTION[0]":     "None",
        f"{P}DATE[0]":           TODAY,
        # FIX #15: APPEARING[0] = client name, APPEARING[1] = attorney signature
        f"{P}APPEARING[0]":      client["name"],
        f"{P}APPEARING[1]":      f"/s/ {attorney['name']}",
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
        "c Attorneys Firm Name Address and Telephone Number  If you are representing yourself provide the same information": attorney_block_cdca(attorney),
        "Attorneys Firm Name Address and Telephone Number  If you are representing yourself provide the same information":   "",

        # Section II — Federal Question
        "3 Federal Question US": "Yes",

        # Section V
        "Amount Demanded": packet.get("amountDemanded", ""),

        # Section VI — cause of action
        "VII NATURE OF SUIT Place an X in one box only": cause_of_action(violations),

        # CACD Division
        "Initial Division in CACD": packet.get("cacdDivision", "Western"),

        # FIX #17: Signature with /s/ prefix
        "Notice to CounselParties  The submission of this Civil Cover Sheet is required by Local Rule 31  This Form CV71 and the information contained herein": f"/s/ {attorney['name']}",
        "Date7_af_date": TODAY,
    }

    # FIX #19: Nature of suit checkboxes — use cv071Field (matching JS and ViolationsPage)
    for v in violations:
        field = v.get("cv071Field")
        if field:
            fields[field] = "Yes"

    fill_pdf(template, fields, outfile, radio_values={
        # FIX #7-8: Origin — set to Original Proceeding
        "Origin": "Original Proceeding",
        # Jury demand
        "V REQUESTED IN COMPLAINT  JURY DEMAND": "Yes" if packet.get("juryDemand") else "No",
        # FIX #9: CLASS ACTION — No
        "CLASS ACTION under FRCvP 23": "No_2",
        # FIX #10: Lemon Law — No
        "VI_choice": "Choice2",
        # Venue questions
        "from state court": "No_3",
        "PLAINTIFF in this action": "No_4",
        "DEFENDANT in this action": "No_5",
        # FIX #11: D1 question
        "If yes your case will initially be assigned to the": "No_7",
        "D2  Is there at least one answer in Column B": "No_6",
        "undefined_14": "No_8",
        "undefined_15": "NO",
        "IXb RELATED CASES  Is this case related as defined below to any civil or criminal cases previously filed in this court": "NO_2",
        "X STATEWIDE OR NATIONWIDE RELIEF  Does this case seek to bar or mandate enforcement of a state or federal law and seek declaratory": "NO_3",
    })
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
        "Text6":   "",
        "Text7":   cause_of_action(violations),
        "Text8":   packet.get("amountDemanded", ""),
        "Text9":   "",
        "Text10":  "",
        # FIX #17: Signature with /s/ prefix
        "Text11":  f"/s/ {attorney['name']}",
        "Text152": TODAY,
        # Section II — Federal Question
        "Check Box13": "Yes",
        # Statewide relief — NO
        "Check Box300": "Yes",
    }

    # Jury demand
    if packet.get("juryDemand"):
        fields["Check Box1"] = "Yes"
    else:
        fields["Check Box2"] = "Yes"

    # FIX #19: Nature of suit — use js44Field (matching JS and ViolationsPage)
    for v in violations:
        field = v.get("js44Field")
        if field:
            fields[field] = "Yes"

    # FIX #6: Handle Origin radio group separately
    fill_pdf(template, fields, outfile, radio_values={
        "Check Box36": "Yes",
    })
    return [str(outfile)]


if __name__ == "__main__":
    main()
