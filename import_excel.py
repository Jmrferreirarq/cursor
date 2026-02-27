"""
import_excel.py — Lê FA_.xls e gera fa360_import.json compatível com o localStorage da plataforma FA-360.

Uso:
  python import_excel.py
  python import_excel.py --xls "caminho\para\FA_.xls"

O ficheiro fa360_import.json pode ser importado diretamente em Definições > Importar dados.
"""

import json
import argparse
import math
from datetime import datetime, date

try:
    import pandas as pd
except ImportError:
    raise SystemExit("Instala pandas: pip install pandas xlrd")


def safe_str(val) -> str:
    if val is None or (isinstance(val, float) and math.isnan(val)):
        return ""
    if isinstance(val, (datetime, date)):
        return str(val)[:10]
    return str(val).strip()


def safe_float(val) -> float:
    try:
        f = float(val)
        return 0.0 if math.isnan(f) or math.isinf(f) else f
    except Exception:
        return 0.0


def uid(prefix: str, i: int) -> str:
    return f"{prefix}-xls-{i:04d}"


def parse_tranches(proporção: str, cotação: float) -> list:
    """Converte '50+35+15' em lista de PaymentTranche com valores calculados."""
    labels = ["Adjudicação", "Intermédia", "Final", "Extra"]
    tranches = []
    try:
        parts = [p.strip() for p in proporção.replace(",", ".").split("+")]
        pcts = [float(p) for p in parts if p]
        for i, pct in enumerate(pcts):
            label = labels[i] if i < len(labels) else f"Tranche {i+1}"
            tranches.append({
                "label": label,
                "percentage": f"{pct:.0f}%",
                "value": round(cotação * pct / 100, 2),
                "hasVat": True,
                "invoiceDate": None,
                "status": "pending",
                "notes": None,
            })
    except Exception:
        pass
    return tranches


def parse_status(val) -> str:
    s = safe_str(val).strip()
    if s == "+":
        return "paid"
    if s == "-":
        return "invoiced"
    return "pending"


def parse_tranche_detail(label: str, value_raw, iva_raw, estado_raw, fatura_raw, notas_raw, pct: str = "") -> dict | None:
    value = safe_float(value_raw)
    if value == 0 and not safe_str(value_raw):
        return None
    fatura = safe_str(fatura_raw)
    estado = safe_str(estado_raw).strip()
    # Se tem data de fatura → pelo menos faturado; se Estado="+" → pago
    if estado == "+":
        status = "paid"
    elif fatura and fatura not in ("NaT", "nan", ""):
        status = "invoiced"
    else:
        status = "pending"
    return {
        "label": label,
        "percentage": pct,
        "value": round(value, 2),
        "hasVat": safe_str(iva_raw).strip() == "+",
        "invoiceDate": fatura[:10] if fatura and fatura not in ("NaT", "nan", "") else None,
        "status": status,
        "notes": safe_str(notas_raw) or None,
    }


def import_clients(df: pd.DataFrame) -> list:
    clients = []
    for i, row in df.iterrows():
        name = safe_str(row.get("NOME", ""))
        if not name:
            continue
        clients.append({
            "id": uid("cli", i),
            "name": name,
            "email": safe_str(row.get("EMAIL", "")),
            "phone": safe_str(row.get("CONTACTO", "")),
            "role": safe_str(row.get("CARGO", "")),
            "company": safe_str(row.get("EMPRESA", "")),
            "projects": [],
            "createdAt": date.today().isoformat(),
            "notes": None,
        })
    return clients


def import_projects(df: pd.DataFrame) -> list:
    projects = []
    for i, row in df.iterrows():
        name = safe_str(row.get("REQUERENTE", ""))
        if not name:
            continue
        projects.append({
            "id": uid("proj", i),
            "name": safe_str(row.get("OBRA", name)),
            "client": name,
            "status": "active",
            "phase": safe_str(row.get("FASE", "")),
            "startDate": safe_str(row.get("Data", ""))[:10] or date.today().isoformat(),
            "deadline": "",
            "budget": 0,
            "hoursLogged": 0,
            "team": [],
            "address": safe_str(row.get("MORADA DA OBRA", "")),
            "municipality": safe_str(row.get("CÂMARA", "")),
            "projectType": safe_str(row.get("ÂMBITO", "")),
            "processNumber": safe_str(row.get("Nº PROCESSO", "")),
            "scope": safe_str(row.get("ÂMBITO", "")),
            "camProcessNumber": safe_str(row.get("PROC Nº", "")),
            "pendingNote": safe_str(row.get("POR FAZER", "")),
        })
    return projects


def import_proposals(df: pd.DataFrame, done: bool = False) -> list:
    proposals = []

    # Calcular percentagens por linha (a partir da coluna Proporção)
    def get_pcts(proporção: str) -> list:
        try:
            parts = [p.strip() for p in proporção.replace(",", ".").split("+")]
            return [f"{float(p):.0f}%" for p in parts if p]
        except Exception:
            return []

    for i, row in df.iterrows():
        client = safe_str(row.get("Cliente", ""))
        if not client:
            continue
        cotação = safe_float(row.get("Cotação", 0))
        proporção = safe_str(row.get("Proporção", ""))
        pcts = get_pcts(proporção)

        # FA / FA_Done têm colunas distintas — suportar ambas
        # Adjudicação
        adj_val = row.get("Adj", row.get("Adjudicação", ""))
        adj_iva = row.get("IVA", "")
        adj_est = row.get("Estado", row.get("Estado Ad", ""))
        adj_fat = row.get("Fatura", row.get("Fatura Ad", ""))
        adj_not = row.get("Notas", row.get("Notas Ad", ""))

        # Intermédia
        int_val = row.get("Intermédia", row.get("Tranche Intermédia", ""))
        int_iva = row.get("IVA2", row.get("IVA1", ""))
        int_est = row.get("Estado2", row.get("Estado Int", ""))
        int_fat = row.get("Fatura2", row.get("Fatura Int", ""))
        int_not = row.get("Notas2", row.get("Notas Int", ""))

        # Final
        fin_val = row.get("Final", row.get("Tranche Final", ""))
        fin_iva = row.get("IVA3", row.get("IVA2", ""))
        fin_est = row.get("Estado3", row.get("Estado Final", ""))
        fin_fat = row.get("Fatura3", row.get("Fatura Final", ""))
        fin_not = row.get("Notas3", row.get("Notas Final", ""))

        tranches = []
        t1 = parse_tranche_detail("Adjudicação", adj_val, adj_iva, adj_est, adj_fat, adj_not, pcts[0] if len(pcts) > 0 else "")
        t2 = parse_tranche_detail("Intermédia",  int_val, int_iva, int_est, int_fat, int_not, pcts[1] if len(pcts) > 1 else "")
        t3 = parse_tranche_detail("Final",       fin_val, fin_iva, fin_est, fin_fat, fin_not, pcts[2] if len(pcts) > 2 else "")

        if t1: tranches.append(t1)
        if t2: tranches.append(t2)
        if t3: tranches.append(t3)

        # Fallback: calcular pelas proporções se nenhuma tranche foi lida
        if not tranches and proporção:
            tranches = parse_tranches(proporção, cotação)

        # Estado da proposta com base nas tranches
        all_paid = tranches and all(t["status"] == "paid" for t in tranches)
        any_active = any(t["status"] in ("paid", "invoiced") for t in tranches)
        if done or all_paid:
            status = "accepted"
        elif any_active:
            status = "sent"
        else:
            status = "sent"

        proposals.append({
            "id": uid("prop-done" if done else "prop", i),
            "clientId": "",
            "clientName": client,
            "projectType": "",
            "phases": [],
            "totalValue": cotação,
            "vatRate": 23,
            "totalWithVat": round(cotação * 1.23, 2),
            "status": status,
            "createdAt": date.today().isoformat(),
            "projectName": f"Projeto {client}",
            "paymentTranches": tranches,
            "isBillingDone": done,
        })
    return proposals


def import_specialists(df: pd.DataFrame) -> list:
    specialists = []
    for i, row in df.iterrows():
        name = safe_str(row.get("NOME", ""))
        if not name:
            continue
        specialists.append({
            "id": uid("spec", i),
            "name": name,
            "specialty": safe_str(row.get("ESPECIALIDADE", "")),
            "phone": safe_str(row.get("CONTACTO", "")),
            "email": safe_str(row.get("EMAIL", "")),
            "priceUpTo300m2": safe_str(row.get("Preço até 300m2", "")),
            "fees": safe_str(row.get("Taxas", "")),
            "notes": None,
        })
    return specialists


def import_licenses(df: pd.DataFrame) -> list:
    licenses = []
    for i, row in df.iterrows():
        software = safe_str(row.get("Software", ""))
        if not software:
            continue
        expiry = safe_str(row.get("Data de Validade", ""))[:10]
        now = date.today().isoformat()
        status = "active" if expiry >= now else ("expired" if expiry else "unknown")
        value_raw = row.get("Valor", None)
        value = None
        try:
            if value_raw and str(value_raw).strip() not in ("", "nan"):
                value = float(str(value_raw).replace("$", "").replace("€", "").strip())
        except Exception:
            pass
        licenses.append({
            "id": uid("lic", i),
            "software": software,
            "registrationName": safe_str(row.get("Nome do registo", "")),
            "licenseNumber": safe_str(row.get("Nº Licença", "")),
            "computer": safe_str(row.get("Computador (Utilizador)", "")),
            "status": status,
            "expiryDate": expiry or None,
            "duration": safe_str(row.get("Duração", "")),
            "value": value,
        })
    return licenses


def import_construction_visits(df: pd.DataFrame) -> list:
    visits = []
    for i, row in df.iterrows():
        client = safe_str(row.get("Cliente", ""))
        if not client:
            continue
        km = safe_float(row.get("KM", 0))
        cost_per_km = safe_float(row.get("Custo/km - 0,36€", 0.36))
        duration = safe_float(row.get("Duração da Visita - horas", 0))
        cost_per_hour = safe_float(row.get("Custo/hora", 20))
        travel_cost = round(km * cost_per_km, 2)
        visit_cost = round(duration * cost_per_hour, 2)
        total = round(travel_cost + visit_cost, 2)
        visits.append({
            "id": uid("visit", i),
            "clientId": "",
            "clientName": client,
            "location": safe_str(row.get("Localização de Obra", "")),
            "visitDate": safe_str(row.get("Data", ""))[:10] or date.today().isoformat(),
            "distanceKm": km,
            "costPerKm": cost_per_km if cost_per_km else 0.36,
            "durationHours": duration,
            "costPerHour": cost_per_hour if cost_per_hour else 20,
            "travelCost": travel_cost,
            "visitCost": visit_cost,
            "total": total,
            "invoiced": bool(safe_str(row.get("Fatura", ""))),
            "invoiceRef": safe_str(row.get("Fatura", "")) or None,
            "notes": safe_str(row.get("Notas", "")) or None,
        })
    return visits


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--xls", default="FA_.xls", help="Caminho para o ficheiro FA_.xls")
    parser.add_argument("--out", default="fa360_import.json", help="Ficheiro JSON de saída")
    args = parser.parse_args()

    print(f"A ler {args.xls}...")
    sheets = pd.read_excel(args.xls, sheet_name=None, engine="xlrd")

    clients = import_clients(sheets.get("Contactos", pd.DataFrame()))
    projects = import_projects(sheets.get("Jé", pd.DataFrame()))
    proposals_active = import_proposals(sheets.get("FA", pd.DataFrame()), done=False)
    proposals_done = import_proposals(sheets.get("FA_Done", pd.DataFrame()), done=True)
    proposals_esp = import_proposals(sheets.get("FA ESP", pd.DataFrame()), done=True)
    proposals = proposals_active + proposals_done + proposals_esp
    specialists = import_specialists(sheets.get("ESPECIALIDADES", pd.DataFrame()))
    licenses = import_licenses(sheets.get("Licenças", pd.DataFrame()))
    construction_visits = import_construction_visits(sheets.get("Acomp Obra", pd.DataFrame()))

    output = {
        "_version": 1,
        "exportedAt": datetime.now().isoformat(),
        "clients": clients,
        "projects": projects,
        "proposals": proposals,
        "specialists": specialists,
        "licenses": licenses,
        "constructionVisits": construction_visits,
        "mediaAssets": [],
        "contentPacks": [],
        "contentPosts": [],
        "editorialDNA": None,
        "slots": [],
        "performanceEntries": [],
        "trashAssets": [],
        "trashPacks": [],
        "trashPosts": [],
    }

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2, default=str)

    print(f"\nResultado:")
    print(f"  Clientes (Contactos):     {len(clients)}")
    print(f"  Projetos (Jé):            {len(projects)}")
    print(f"  Propostas/Faturação:      {len(proposals)}")
    print(f"  Especialistas:            {len(specialists)}")
    print(f"  Licenças:                 {len(licenses)}")
    print(f"  Visitas de obra:          {len(construction_visits)}")
    print(f"\nFicheiro gerado: {args.out}")
    print("Importa-o na plataforma em: Definições > Importar dados")


if __name__ == "__main__":
    main()
