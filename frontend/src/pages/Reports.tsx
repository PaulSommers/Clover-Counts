import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';

// Mock data for reports
const mockInventoryData = [
  { date: '2025-05-01', totalValue: 24567.89, change: '+2.4%' },
  { date: '2025-04-15', totalValue: 23982.45, change: '-0.5%' },
  { date: '2025-04-01', totalValue: 24102.33, change: '+1.2%' },
  { date: '2025-03-15', totalValue: 23812.56, change: '+0.8%' },
  { date: '2025-03-01', totalValue: 23623.12, change: '-1.3%' },
  { date: '2025-02-15', totalValue: 23934.67, change: '+2.1%' },
];

const mockCategoryData = [
  { category: 'Dry Goods', value: 8234.56, percentage: '33.5%' },
  { category: 'Meat', value: 6789.12, percentage: '27.6%' },
  { category: 'Produce', value: 4567.89, percentage: '18.6%' },
  { category: 'Dairy', value: 3456.78, percentage: '14.1%' },
  { category: 'Oils', value: 1519.54, percentage: '6.2%' },
];

const mockRoomData = [
  { room: 'Dry Storage', value: 5678.90, percentage: '23.1%' },
  { room: 'Walk-in Cooler', value: 8234.56, percentage: '33.5%' },
  { room: 'Walk-in Freezer', value: 6789.12, percentage: '27.6%' },
  { room: 'Prep Area', value: 1234.56, percentage: '5.0%' },
  { room: 'Bar', value: 2630.75, percentage: '10.7%' },
];

const Reports = () => {
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState('last6');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="report-type-label">Report Type</InputLabel>
              <Select
                labelId="report-type-label"
                id="report-type"
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="inventory">Inventory Value Over Time</MenuItem>
                <MenuItem value="category">Value by Category</MenuItem>
                <MenuItem value="room">Value by Room</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="date-range-label">Date Range</InputLabel>
              <Select
                labelId="date-range-label"
                id="date-range"
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="last6">Last 6 Months</MenuItem>
                <MenuItem value="last12">Last 12 Months</MenuItem>
                <MenuItem value="ytd">Year to Date</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {dateRange === 'custom' && (
            <>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Start Date"
                  type="date"
                  defaultValue="2025-01-01"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="End Date"
                  type="date"
                  defaultValue="2025-05-15"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* Chart Placeholder */}
      <Paper sx={{ p: 3, mb: 4, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          {reportType === 'inventory' && <BarChartIcon sx={{ fontSize: 100, color: 'primary.main', opacity: 0.7 }} />}
          {reportType === 'category' && <PieChartIcon sx={{ fontSize: 100, color: 'primary.main', opacity: 0.7 }} />}
          {reportType === 'room' && <PieChartIcon sx={{ fontSize: 100, color: 'primary.main', opacity: 0.7 }} />}
          <Typography variant="body1" sx={{ mt: 2 }}>
            Chart visualization would appear here
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (In a real implementation, this would be a dynamic chart using a library like Chart.js or Recharts)
          </Typography>
        </Box>
      </Paper>

      {/* Data Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {reportType === 'inventory' && 'Inventory Value Over Time'}
            {reportType === 'category' && 'Value by Category'}
            {reportType === 'room' && 'Value by Room'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
          >
            Export CSV
          </Button>
        </Box>
        <TableContainer>
          <Table>
            {reportType === 'inventory' && (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Total Value</TableCell>
                    <TableCell align="right">Change</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockInventoryData.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell align="right">${row.totalValue.toFixed(2)}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: row.change.startsWith('+') ? 'success.main' : 'error.main' 
                        }}
                      >
                        {row.change}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}

            {reportType === 'category' && (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockCategoryData.map((row) => (
                    <TableRow key={row.category}>
                      <TableCell>{row.category}</TableCell>
                      <TableCell align="right">${row.value.toFixed(2)}</TableCell>
                      <TableCell align="right">{row.percentage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}

            {reportType === 'room' && (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>Room</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockRoomData.map((row) => (
                    <TableRow key={row.room}>
                      <TableCell>{row.room}</TableCell>
                      <TableCell align="right">${row.value.toFixed(2)}</TableCell>
                      <TableCell align="right">{row.percentage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Reports;