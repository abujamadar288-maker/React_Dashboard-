import os
import sys

from dotenv import load_dotenv

# Load .env from backend folder and from project root
_here = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(_here, ".env"))
load_dotenv(os.path.join(_here, "..", ".env"))

def get_connection():
    import snowflake.connector

    user = os.getenv("SF_USER")
    password = os.getenv("SF_PASSWORD")
    account = os.getenv("SF_ACCOUNT")
    warehouse = os.getenv("SF_WAREHOUSE")
    database = os.getenv("SF_DATABASE")
    schema = os.getenv("SF_SCHEMA")

    if not all([user, password, account]):
        print(
            "Snowflake env missing. Create backend/.env with: SF_USER, SF_PASSWORD, SF_ACCOUNT, SF_WAREHOUSE, SF_DATABASE, SF_SCHEMA",
            file=sys.stderr,
        )
        raise RuntimeError("Missing Snowflake env: SF_USER, SF_PASSWORD, SF_ACCOUNT (and optionally SF_WAREHOUSE, SF_DATABASE, SF_SCHEMA)")

    return snowflake.connector.connect(
        user=user,
        password=password,
        account=account,
        warehouse=warehouse or None,
        database=database or None,
        schema=schema or None,
    )
