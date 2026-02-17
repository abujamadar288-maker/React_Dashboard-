'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';

import { Budget } from '@/components/dashboard/overview/budget';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { LatestVulnerabilities } from '@/components/dashboard/overview/latest-vulnerabilities';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { MostCriticalAssets } from '@/components/dashboard/overview/most-critical-assets';

const API_BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000'
    : 'http://127.0.0.1:8000';

function extractFirstNumericValue(row: Record<string, unknown> | null | undefined): number {
  if (!row || typeof row !== 'object') return 0;
  for (const key of Object.keys(row)) {
    const raw = row[key];
    const num = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isNaN(num)) return num;
  }
  return 0;
}

async function fetchFromApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export function DashboardOverviewClient(): React.JSX.Element {
  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState(false);
  const [totalAssets, setTotalAssets] = React.useState(0);
  const [activeAssets, setActiveAssets] = React.useState(0);
  const [averageRiskScore, setAverageRiskScore] = React.useState(0);
  const [totalVulnerabilities, setTotalVulnerabilities] = React.useState(0);
  const [assetsByMonth, setAssetsByMonth] = React.useState<{ month: string; total_assets: number }[]>([]);
  const [assetsByTypeDonut, setAssetsByTypeDonut] = React.useState<
    { asset_type: string; total_assets: number }[]
  >([]);
  const [latestVulnerabilities, setLatestVulnerabilities] = React.useState<
    { vulnerability_id: string; cve_id: string | null; detected_date: string; severity: string; status: string }[]
  >([]);

  // ✅ STEP 3 ADDED STATE
  const [mostCriticalAssets, setMostCriticalAssets] = React.useState<
    { hostname: string; department: string | null; criticality: string | null; purchase_date: string | null }[]
  >([]);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setApiError(false);
    try {
      const [
        totalAssetsRes,
        activeAssetsRes,
        avgRiskRes,
        totalVulnsRes,
        assetsByMonthRes,
        assetsByTypeRes,
        latestVulnsRes,
        mostCriticalRes, // ✅ STEP 3 ADDED
      ] = await Promise.all([
        fetchFromApi<unknown[]>('/total-assets'),
        fetchFromApi<unknown[]>('/active-assets'),
        fetchFromApi<unknown[]>('/average-risk'),
        fetchFromApi<unknown[]>('/total-vulnerabilities'),
        fetchFromApi<unknown[]>('/assets-monthly'),
        fetchFromApi<unknown[]>('/assets-type-donut'),
        fetchFromApi<unknown[]>('/latest-vulnerabilities'),
        fetchFromApi<unknown[]>('/most-critical-asset'), // ✅ STEP 3 ADDED
      ]);

      const totalAssetsRow = totalAssetsRes?.[0] as Record<string, unknown> | undefined;
      const activeAssetsRow = activeAssetsRes?.[0] as Record<string, unknown> | undefined;
      const avgRiskRow = avgRiskRes?.[0] as Record<string, unknown> | undefined;
      const totalVulnsRow = totalVulnsRes?.[0] as Record<string, unknown> | undefined;

      setTotalAssets(extractFirstNumericValue(totalAssetsRow));
      setActiveAssets(extractFirstNumericValue(activeAssetsRow));
      setAverageRiskScore(extractFirstNumericValue(avgRiskRow));
      setTotalVulnerabilities(extractFirstNumericValue(totalVulnsRow));

      const normalizedMonth = (assetsByMonthRes ?? []).map((item: unknown) => {
        const o = item as Record<string, unknown>;
        return {
          month: String(o?.month ?? o?.MONTH ?? ''),
          total_assets: Number(o?.total_assets ?? o?.TOTAL_ASSETS ?? o?.total ?? o?.TOTAL ?? 0),
        };
      });
      setAssetsByMonth(normalizedMonth);

      const normalizedType = (assetsByTypeRes ?? []).map((item: unknown) => {
        const o = item as Record<string, unknown>;
        return {
          asset_type: String(o?.asset_type ?? o?.ASSET_TYPE ?? ''),
          total_assets: Number(o?.total_assets ?? o?.TOTAL_ASSETS ?? o?.total ?? o?.TOTAL ?? 0),
        };
      });
      setAssetsByTypeDonut(normalizedType);

      const normalizedVulns = (latestVulnsRes ?? []).map((item: unknown) => {
        const o = item as Record<string, unknown>;
        return {
          vulnerability_id: String(o?.vulnerability_id ?? o?.VULNERABILITY_ID ?? ''),
          cve_id: (o?.cve_id ?? o?.CVE_ID ?? null) as string | null,
          detected_date: String(o?.detected_date ?? o?.DETECTED_DATE ?? ''),
          severity: String(o?.severity ?? o?.SEVERITY ?? ''),
          status: String(o?.status ?? o?.STATUS ?? ''),
        };
      });
      setLatestVulnerabilities(normalizedVulns);

      // ✅ STEP 3 ADDED NORMALIZATION
      const normalizedCritical = (mostCriticalRes ?? []).map((item: unknown) => {
        const o = item as Record<string, unknown>;
        return {
          hostname: String(o?.hostname ?? o?.HOSTNAME ?? ''),
          department: (o?.department ?? o?.DEPARTMENT ?? null) as string | null,
          criticality: (o?.criticality ?? o?.CRITICALITY ?? null) as string | null,
          purchase_date: (o?.purchase_date ?? o?.PURCHASE_DATE ?? null) as string | null,
        };
      });
      setMostCriticalAssets(normalizedCritical);

    } catch {
      setApiError(true);
      setTotalAssets(0);
      setActiveAssets(0);
      setAverageRiskScore(0);
      setTotalVulnerabilities(0);
      setAssetsByMonth([]);
      setAssetsByTypeDonut([]);
      setLatestVulnerabilities([]);
      setMostCriticalAssets([]); // ✅ STEP 3 RESET
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const monthLabels = assetsByMonth.map((item) => item.month);
  const monthData = assetsByMonth.map((item) => item.total_assets);
  const donutLabels = assetsByTypeDonut.map((item) => item.asset_type);
  const donutSeries = assetsByTypeDonut.map((item) => item.total_assets);

  return (
    <Grid container spacing={3}>
      {apiError ? (
        <Grid size={12}>
          <Alert
            severity="warning"
            action={
              <Button color="inherit" size="small" onClick={loadData}>
                Retry
              </Button>
            }
          >
            Backend API is not running. Start it in a separate terminal:{' '}
            <strong>cd backend && uvicorn main:app --reload --port 8000</strong>
          </Alert>
        </Grid>
      ) : null}

      {loading && !apiError ? (
        <Grid size={12}>
          <Alert severity="info">Loading dashboard data…</Alert>
        </Grid>
      ) : null}

      <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value={totalAssets.toLocaleString()} />
      </Grid>

      <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value={activeAssets.toLocaleString()} />
      </Grid>

      <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
        <TasksProgress sx={{ height: '100%' }} value={Number(averageRiskScore) || 0} />
      </Grid>

      <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
        <TotalProfit sx={{ height: '100%' }} value={totalVulnerabilities.toLocaleString()} />
      </Grid>

      <Grid size={{ lg: 8, xs: 12 }}>
        <Sales chartSeries={[{ name: 'Assets', data: monthData }]} categories={monthLabels} sx={{ height: '100%' }} />
      </Grid>

      <Grid size={{ lg: 4, md: 6, xs: 12 }}>
        <Traffic chartSeries={donutSeries} labels={donutLabels} sx={{ height: '100%' }} />
      </Grid>

      {/* ✅ REPLACED LatestProducts WITH MostCriticalAssets */}
      <Grid size={{ lg: 4, md: 6, xs: 12 }}>
        <MostCriticalAssets items={mostCriticalAssets} sx={{ height: '100%' }} />
      </Grid>

      <Grid size={{ lg: 8, md: 12, xs: 12 }}>
        <LatestVulnerabilities items={latestVulnerabilities} sx={{ height: '100%' }} />
      </Grid>
    </Grid>
  );
}
