'use client';

import * as React from 'react';
import {
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  type SxProps,
} from '@mui/material';
import dayjs from 'dayjs';

export interface CriticalAsset {
  hostname: string;
  department: string | null;
  criticality: string | null;
  purchase_date: string | null;
}

export interface MostCriticalAssetsProps {
  items?: CriticalAsset[];
  sx?: SxProps;
}

export function MostCriticalAssets({
  items = [],
  sx,
}: MostCriticalAssetsProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="Most Critical Assets" />
      <Divider />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Hostname</strong></TableCell>
              <TableCell><strong>Department</strong></TableCell>
              <TableCell><strong>Criticality</strong></TableCell>
              <TableCell><strong>Purchase Date</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No critical assets found
                </TableCell>
              </TableRow>
            ) : (
              items.map((asset, index) => (
                <TableRow key={`${asset.hostname}-${index}`} hover>
                  <TableCell>{asset.hostname}</TableCell>

                  <TableCell>
                    {asset.department ?? 'N/A'}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={asset.criticality ?? 'N/A'}
                      color="error"
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {asset.purchase_date
                      ? dayjs(asset.purchase_date).format('MMM D, YYYY')
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
