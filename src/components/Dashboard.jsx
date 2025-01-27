import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
    Card,
    CardContent,
    Grid,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    TablePagination
} from '@mui/material';
import { format, parseISO } from 'date-fns';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [salesData, setSalesData] = useState(null);
    const [filterType, setFilterType] = useState('today');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchSalesReport = async () => {
        try {
            setLoading(true);
            setError(null);

            let params = { filterType };
            if (filterType === 'custom' && startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            }

            console.log('Fetching sales report with params:', params);
            const response = await axiosClient.get('/admin/sales-report', { params });
            console.log('Sales report response:', response.data);

            if (response.data.success) {
                setSalesData(response.data.data);
            } else {
                setError('Failed to fetch sales data');
            }
        } catch (error) {
            console.error('Error fetching sales report:', error);
            setError(error.response?.data?.message || 'Error fetching sales report');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesReport();
    }, [filterType, startDate, endDate]);

    const handleDownloadPDF = async () => {
        try {
            let params = { filterType };
            if (filterType === 'custom' && startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            }

            const response = await axiosClient.get('/admin/download-sales-report-pdf', {
                params,
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `sales-report-${new Date().toISOString().split('T')[0]}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };

    const handleDownloadExcel = async () => {
        try {
            let params = { filterType };
            if (filterType === 'custom' && startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            }

            const response = await axiosClient.get('/admin/download-sales-report-excel', {
                params,
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `sales-report-${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading Excel:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="p-4">
                <Typography>Loading...</Typography>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <Typography color="error">{error}</Typography>
            </div>
        );
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Daily Sales Trend',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const chartData = {
        labels: salesData?.chartData?.map(item => format(parseISO(item._id), 'MMM dd')) || [],
        datasets: [
            {
                label: 'Sales Amount',
                data: salesData?.chartData?.map(item => item.totalSales) || [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
            {
                label: 'Order Count',
                data: salesData?.chartData?.map(item => item.orderCount) || [],
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h4" gutterBottom>
                    Sales Report Dashboard
                </Typography>

                <div className="flex gap-2">
                    <button
                        onClick={handleDownloadPDF}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Download PDF
                    </button>
                    <button
                        onClick={handleDownloadExcel}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Download Excel
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-4 items-center">
                <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="min-w-[150px]"
                >
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="weekly">This Week</MenuItem>
                    <MenuItem value="monthly">This Month</MenuItem>
                    <MenuItem value="custom">Custom Range</MenuItem>
                </Select>

                {filterType === 'custom' && (
                    <div className="flex gap-4">
                        <TextField
                            type="date"
                            label="Start Date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            type="date"
                            label="End Date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </div>
                )}
            </div>

            {/* Summary Cards */}
            <Grid container spacing={3} className="mb-6">
                <Grid item xs={12} sm={6} md={2}>
                    <Paper className="p-4">
                        <Typography variant="subtitle2" color="textSecondary">Total Orders</Typography>
                        <Typography variant="h4">{salesData?.summary?.totalOrders || 0}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Paper className="p-4">
                        <Typography variant="subtitle2" color="textSecondary">Total Sales</Typography>
                        <Typography variant="h4">{formatCurrency(salesData?.summary?.totalSales || 0)}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Paper className="p-4">
                        <Typography variant="subtitle2" color="textSecondary">Total Discounts</Typography>
                        <Typography variant="h4">{formatCurrency(salesData?.summary?.totalDiscounts || 0)}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper className="p-4">
                        <Typography variant="subtitle2" color="textSecondary">Average Order Value</Typography>
                        <Typography variant="h4">{formatCurrency(salesData?.summary?.averageOrderValue || 0)}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper className="p-4">
                        <Typography variant="subtitle2" color="textSecondary">Total Products Sold</Typography>
                        <Typography variant="h4">{salesData?.summary?.totalProducts || 0}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Detailed Sales Table */}
            <Paper className="mb-6">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order Date</TableCell>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Products</TableCell>
                                <TableCell>Payment Method</TableCell>
                                <TableCell align="right">Items</TableCell>
                                <TableCell align="right">Subtotal</TableCell>
                                <TableCell align="right">Discount</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell align="right">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {salesData?.orderDetails
                                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((order) => (
                                    <TableRow key={order.orderId} hover>
                                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                                        <TableCell>{order.orderId.slice(-5)}</TableCell>
                                        <TableCell>
                                            <div className="max-h-20 overflow-y-auto">
                                                {order.products.map((product, idx) => (
                                                    <div key={idx} className="text-sm">
                                                        {product.name} x {product.quantity}
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>{order.paymentMethod}</TableCell>
                                        <TableCell align="right">
                                            {order.products.reduce((sum, p) => sum + p.quantity, 0)}
                                        </TableCell>
                                        <TableCell align="right">{formatCurrency(order.subtotal)}</TableCell>
                                        <TableCell align="right" className="text-red-500">
                                            -{formatCurrency(order.discount)}
                                        </TableCell>
                                        <TableCell align="right">{formatCurrency(order.totalAmount)}</TableCell>
                                        <TableCell align="right">
                                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                Delivered
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={salesData?.orderDetails?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Sales Chart */}
            <Card className="mb-4">
                <CardContent>
                    <Line options={chartOptions} data={chartData} />
                </CardContent>
            </Card>

            {/* Top Products Table */}
            {salesData && (
                <Card className="mb-4">
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Top Performing Products
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell align="right">Quantity Sold</TableCell>
                                        <TableCell align="right">Total Revenue</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {salesData.productPerformance.map((product) => (
                                        <TableRow key={product._id}>
                                            <TableCell>{product.productName}</TableCell>
                                            <TableCell align="right">{product.totalQuantity}</TableCell>
                                            <TableCell align="right">{formatCurrency(product.totalRevenue)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Dashboard;