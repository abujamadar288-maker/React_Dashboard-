import warnings

import pandas as pd
import numpy as np
from db_connection import get_connection

# Suppress noisy pandas warning about non-SQLAlchemy connections with Snowflake.
# Snowflake's DBAPI connection works fine here; this just hides repeated console spam.
warnings.filterwarnings(
    "ignore",
    message="pandas only supports SQLAlchemy connectable",
    category=UserWarning,
)


def make_json_safe(df: pd.DataFrame) -> list:
    df = df.replace({np.nan: None, np.inf: None, -np.inf: None})

    for col in df.columns:
        if pd.api.types.is_datetime64_any_dtype(df[col]):
            df[col] = df[col].astype(str).replace("NaT", None)

    return df.to_dict(orient="records")


def total_assets():
    try:
        conn = get_connection()
        df = pd.read_sql("SELECT COUNT(*) AS total FROM assets", conn)
        conn.close()
        return make_json_safe(df)
    except Exception as e:
        print(f"total_assets error: {e}")
        return [{"total": 0}]


def active_assets():
    try:
        conn = get_connection()
        df = pd.read_sql("""
            SELECT COUNT(*) AS active_assets
            FROM assets
            WHERE ASSET_STATUS = 'Active'
        """, conn)
        conn.close()
        return make_json_safe(df)
    except Exception as e:
        print(f"active_assets error: {e}")
        return [{"active_assets": 0}]


def assets_by_department():
    try:
        conn = get_connection()
        df = pd.read_sql("""
            SELECT department, COUNT(*) AS total
            FROM assets
            GROUP BY department
        """, conn)
        conn.close()
        return make_json_safe(df)
    except Exception as e:
        print(f"assets_by_department error: {e}")
        return []


def total_vulnerabilities():
    try:
        conn = get_connection()
        df = pd.read_sql("""
            SELECT COUNT(*) AS total_vulnerabilities
            FROM vulnerabilities
        """, conn)
        conn.close()
        return make_json_safe(df)
    except Exception as e:
        print(f"total_vulnerabilities error: {e}")
        return [{"total_vulnerabilities": 0}]


def vulnerabilities_by_severity():
    try:
        conn = get_connection()
        df = pd.read_sql("""
            SELECT severity, COUNT(*) AS total
            FROM vulnerabilities
            GROUP BY severity
        """, conn)
        conn.close()
        return make_json_safe(df)
    except Exception as e:
        print(f"vulnerabilities_by_severity error: {e}")
        return []


def average_risk_score():
    try:
        conn = get_connection()
        df = pd.read_sql("""
            SELECT ROUND(AVG(RISK_SCORE), 1) AS avg_risk
            FROM vulnerabilities
        """, conn)

        conn.close()
        return make_json_safe(df)
    except Exception as e:
        print(f"average_risk_score error: {e}")
        return [{"avg_risk": 0}]



def assets_by_month():
    try:
        conn = get_connection()
        df = pd.read_sql("""
            SELECT
                MONTH(purchase_date) AS month_number,
                TO_VARCHAR(purchase_date, 'Mon') AS month,
                COUNT(*) AS total_assets
            FROM assets
            GROUP BY 1, 2
            ORDER BY 1
        """, conn)
        conn.close()
        return make_json_safe(df)
    except Exception as e:
        print(f"assets_by_month error: {e}")
        return []


def assets_by_type_donut():
    try:
        conn = get_connection()
        df = pd.read_sql("""
            SELECT
                asset_type,
                COUNT(*) AS total_assets
            FROM assets
            GROUP BY asset_type
            ORDER BY total_assets DESC
        """, conn)
        conn.close()
        return make_json_safe(df)
    except Exception as e:
        print(f"assets_by_type_donut error: {e}")
        return []


def latest_vulnerabilities(limit: int = 50):
    try:
        conn = get_connection()
        df = pd.read_sql(f"""
            SELECT
                vulnerability_id,
                cve_id,
                detected_date,
                severity,
                status
            FROM vulnerabilities
            ORDER BY detected_date DESC
            LIMIT {10}
        """, conn)
        conn.close()
        return make_json_safe(df)
    except Exception as e:
        print(f"latest_vulnerabilities error: {e}")
        return []


def most_critical_asset():
    try:
        conn = get_connection()
        df = pd.read_sql("""
            SELECT 
                hostname,
                department,
                criticality,
                purchase_date
            FROM assets
            WHERE criticality = 'Critical'
            ORDER BY purchase_date DESC
            LIMIT 10
        """, conn)

        conn.close()
        return make_json_safe(df)

    except Exception as e:
        print(f"most_critical_asset error: {e}")
        return []





