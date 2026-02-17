import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';

export interface Vulnerability {
  vulnerability_id: string;
  cve_id: string | null;
  detected_date: string;
  severity: string;
  status: string;
}

export interface LatestVulnerabilitiesProps {
  items?: Vulnerability[];
  sx?: SxProps;
}

export function LatestVulnerabilities({
  items = [],
  sx,
}: LatestVulnerabilitiesProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="Latest vulnerabilities" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Vulnerability ID</TableCell>
              <TableCell>CVE ID</TableCell>
              <TableCell sortDirection="desc">Detected Date</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow hover key={item.vulnerability_id}>
                <TableCell>{item.vulnerability_id}</TableCell>
                <TableCell>{item.cve_id ?? '-'}</TableCell>
                <TableCell>
                  {item.detected_date
                    ? dayjs(item.detected_date).format('MMM D, YYYY')
                    : '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    color={
                      item.severity === 'High'
                        ? 'error'
                        : item.severity === 'Medium'
                        ? 'warning'
                        : item.severity === 'Low'
                        ? 'success'
                        : 'default'
                    }
                    label={item.severity}
                    size="small"
                  />
                </TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
      </CardActions>
    </Card>
  );
}

