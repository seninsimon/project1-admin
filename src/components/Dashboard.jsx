import React from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import "./Dashboard.css";

const Dashboard = () => {
  // Sample data for charts
  const barChartData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Sales (in USD)",
        data: [12000, 15000, 8000, 20000, 18000],
        backgroundColor: "#4CAF50",
      },
    ],
  };

  const lineChartData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    datasets: [
      {
        label: "User Signups",
        data: [50, 70, 100, 80, 120],
        borderColor: "#FF5733",
        fill: true,
        backgroundColor: "rgba(255, 87, 51, 0.2)",
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* Metrics Section */}
      <div className="metrics">
        <div className="metric-card">
          <h3>Total Sales</h3>
          <p>$120,000</p>
        </div>
        <div className="metric-card">
          <h3>New Users</h3>
          <p>1,200</p>
        </div>
        <div className="metric-card">
          <h3>Active Subscriptions</h3>
          <p>950</p>
        </div>
        <div className="metric-card">
          <h3>Support Tickets</h3>
          <p>25</p>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="charts">
        <div className="chart-card">
          <h3>Monthly Sales</h3>
          <Bar data={barChartData} />
        </div>
        <div className="chart-card">
          <h3>Weekly Signups</h3>
          <Line data={lineChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
