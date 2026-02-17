from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data_fetcher import (
    total_assets,
    active_assets,
    assets_by_department,
    total_vulnerabilities,
    vulnerabilities_by_severity,
    average_risk_score,
    assets_by_month,
    assets_by_type_donut,
    latest_vulnerabilities,
    most_critical_asset
    
)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/health")
def health():
    return {"status": "ok", "message": "Backend is running"}


@app.get("/total-assets")
def get_total_assets():
    return total_assets()

@app.get("/active-assets")
def get_active_assets():
    return active_assets()

@app.get("/assets-department")
def get_assets_department():
    return assets_by_department()

@app.get("/total-vulnerabilities")
def get_total_vulnerabilities():
    return total_vulnerabilities()

@app.get("/vulnerabilities-severity")
def get_vulnerabilities_severity():
    return vulnerabilities_by_severity()

@app.get("/average-risk")
def get_average_risk():
    return average_risk_score()

@app.get("/assets-monthly")
def get_assets_monthly():
    return assets_by_month()

@app.get("/assets-type-donut")
def get_assets_type_donut():
    return assets_by_type_donut()

@app.get("/latest-vulnerabilities")
def get_latest_vulnerabilities():
    return latest_vulnerabilities()

@app.get("/most-critical-asset")
def get_most_critical_asset():
    return most_critical_asset()





