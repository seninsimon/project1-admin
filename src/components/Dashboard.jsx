import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Registering chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]; // Get tomorrow's date

  const [totalSalesData, setTotalSalesData] = useState(null);
  const [totalDiscountsData, setTotalDiscountsData] = useState(null);
  const [orderAmountData, setOrderAmountData] = useState(null);
  const [dateRange, setDateRange] = useState('daily'); // Default to daily
  const [startDate, setStartDate] = useState(today); // Default start date
  const [endDate, setEndDate] = useState(tomorrow); // Default end date

  useEffect(() => {
    fetchSalesData();
  }, [dateRange, startDate, endDate]);

  const getDateRange = () => {
    let start = '';
    let end = '';
    const today = new Date();
    const year = today.getFullYear();
    switch (dateRange) {
      case 'daily':
        start = today.toISOString().split('T')[0]; // Current date
        end = start;
        break;
      case 'weekly':
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(today.getDate() + 6));
        start = startOfWeek.toISOString().split('T')[0];
        end = endOfWeek.toISOString().split('T')[0];
        break;
      case 'yearly':
        start = new Date(year, 0, 1).toISOString().split('T')[0]; // Start of the year
        end = new Date(year, 11, 31).toISOString().split('T')[0]; // End of the year
        break;
      case 'custom':
        start = startDate;
        end = endDate;
        break;
      default:
        break;
    }
    return { startDate: start, endDate: end };
  };

  const fetchSalesData = async () => {
    try {
      const { startDate, endDate } = getDateRange();
      const params = dateRange === 'custom' ? { dateRange, startDate, endDate } : { dateRange };

      const salesResponse = await axiosClient.post('/totalsales', params);
      const totalSales = salesResponse.data?.totalSales || 0;
      setTotalSalesData({ totalSales });

      let totalDiscounts = 0;
      let discountPercentage = 0;

      if (totalSales > 0) {
        const discountsResponse = await axiosClient.post('/totaldiscounts', params);
        totalDiscounts = discountsResponse.data?.totalDiscounts || 0;
        discountPercentage = (totalDiscounts / totalSales) * 100;
      }

      setTotalDiscountsData({ totalDiscounts, discountPercentage });

      const orderAmountResponse = await axiosClient.post('/orderamount', params);
      setOrderAmountData(orderAmountResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
    
  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Sales Report Overview', 20, 20);

    const ranges = ['daily', 'weekly', 'yearly'];
    const reports = [];

    try {
      for (const range of ranges) {
        const { startDate, endDate } = getDateRange(range);
        const params = { dateRange: range };

        const salesResponse = await axiosClient.post('/totalsales', params);
        const discountsResponse = await axiosClient.post('/totaldiscounts', params);
        const orderAmountResponse = await axiosClient.post('/orderamount', params);

        reports.push({
          range,
          startDate,
          endDate,
          totalSales: salesResponse.data?.totalSales || 0,
          totalDiscounts: discountsResponse.data?.totalDiscounts || 0,
          totalOrderAmount: orderAmountResponse.data?.totalOrderAmount || 0,
        });
      }

      reports.forEach((report, index) => {
        const yOffset = 30 + index * 40;
        doc.setFontSize(14);
        doc.text(`${report.range.charAt(0).toUpperCase() + report.range.slice(1)}: ${report.startDate} to ${report.endDate}`, 20, yOffset);
        doc.setFontSize(12);
        doc.text(`Total Sales: ₹${report.totalSales.toFixed(2)}`, 20, yOffset + 10);
        doc.text(`Total Discounts: ₹${report.totalDiscounts.toFixed(2)}`, 20, yOffset + 20);
        doc.text(`Total Order Amount: ₹${report.totalOrderAmount.toFixed(2)}`, 20, yOffset + 30);
      });

      doc.save('sales-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };


  const generateExcel = async () => {
    const ranges = ['daily', 'weekly', 'yearly'];
    const data = [['Sales Report'], ['Metric', 'Amount', 'Date Range']];

    try {
      for (const range of ranges) {
        const { startDate, endDate } = getDateRange(range);
        const params = { dateRange: range };

        const salesResponse = await axiosClient.post('/totalsales', params);
        const discountsResponse = await axiosClient.post('/totaldiscounts', params);
        const orderAmountResponse = await axiosClient.post('/orderamount', params);

        data.push(
          [`${range.charAt(0).toUpperCase() + range.slice(1)}: Total Sales`, salesResponse.data?.totalSales || 0, `${startDate} - ${endDate}`],
          [`${range.charAt(0).toUpperCase() + range.slice(1)}: Total Discounts`, discountsResponse.data?.totalDiscounts || 0, `${startDate} - ${endDate}`],
          [`${range.charAt(0).toUpperCase() + range.slice(1)}: Total Order Amount`, orderAmountResponse.data?.totalOrderAmount || 0, `${startDate} - ${endDate}`]
        );
      }

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

      const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([excelFile]), 'sales-report.xlsx');
    } catch (error) {
      console.error('Error generating Excel:', error);
    }
  };


  const chartData = {
    labels: ['Total Sales', 'Total Discounts', 'Total Order Amount'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [
          totalSalesData ? totalSalesData.totalSales : 0,
          totalDiscountsData ? totalDiscountsData.totalDiscounts : 0,
          orderAmountData ? orderAmountData.totalOrderAmount : 0,
        ],
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Report Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Sales Report</h1>

      <div className="flex items-center justify-between mb-6">
        <select
          onChange={(e) => setDateRange(e.target.value)}
          value={dateRange}
          className="px-4 py-2 border rounded-md bg-white shadow-sm"
        >
          <option value="daily">today</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
          <option value="custom">Custom Date Range</option>
        </select>
        {dateRange === 'custom' && (
          <div className="flex space-x-4">
            <input
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
              className="px-4 py-2 border rounded-md bg-white shadow-sm"
            />
            <input
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
              className="px-4 py-2 border rounded-md bg-white shadow-sm"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Total Sales</h3>
          <p className="text-2xl font-bold">{totalSalesData ? `₹${totalSalesData.totalSales}` : 'Loading...'}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Total Discounts</h3>
          <p className="text-2xl font-bold">{totalDiscountsData ? `₹${totalSalesData.totalSales == 0 ?  0 : totalDiscountsData.totalDiscounts}` : 'Loading...'}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Total Order Amount</h3>
          <p className="text-2xl font-bold">{orderAmountData ? `₹${orderAmountData?.totalOrderAmount || 0}` : 'Loading...'}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="flex space-x-4 justify-center">
        <button
          onClick={generatePDF}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
        >
          Download PDF
        </button>
        <button
          onClick={generateExcel}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
        >
          Download Excel
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
