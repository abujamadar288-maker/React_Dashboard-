# Backend (FastAPI + Snowflake)

## 1. Install dependencies

From project root:

```bash
pip install -r requirements.txt
```

Or from `backend` folder:

```bash
pip install -r ../requirements.txt
```

## 2. Configure Snowflake

Create a file `backend/.env` with:

```
SF_USER=your_snowflake_user
SF_PASSWORD=your_password
SF_ACCOUNT=your_account_id
SF_WAREHOUSE=your_warehouse
SF_DATABASE=your_database
SF_SCHEMA=your_schema
```

## 3. Run the backend

From the **backend** folder:

**Windows (Command Prompt or PowerShell):**
```bash
cd backend
run.bat
```

Or manually:
```bash
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Mac/Linux:**
```bash
cd backend
chmod +x run.sh
./run.sh
```

## 4. Check that it is running

- Open in browser: http://127.0.0.1:8000/health  
  You should see: `{"status":"ok","message":"Backend is running"}`

- Test an API: http://127.0.0.1:8000/total-assets  
  You should see JSON (e.g. `[{"total": 123}]` or `[{"TOTAL": 123}]`).

If the health URL works but data URLs return zeros or errors, check that your Snowflake tables `assets` and `vulnerabilities` exist and that `assets` has columns used by the queries (e.g. `purchase_date` for the bar chart, `asset_type`, `ASSET_STATUS`).
