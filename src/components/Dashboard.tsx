import React from 'react';
import type { Transaction } from '../types';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface Props {
    transactions: Transaction[];
}

export const Dashboard: React.FC<Props> = ({ transactions }) => {
    // Monthly Summary
    const monthlyData = transactions.reduce((acc, t) => {
        const month = t.date.substring(0, 7); // YYYY-MM
        if (!acc[month]) acc[month] = { income: 0, expense: 0 };
        if (t.type === 'income') acc[month].income += t.amount;
        else acc[month].expense += t.amount;
        return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    const months = Object.keys(monthlyData).sort();
    const barData = {
        labels: months,
        datasets: [
            {
                label: '収入',
                data: months.map(m => monthlyData[m].income),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: '支出',
                data: months.map(m => monthlyData[m].expense),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            }
        ]
    };

    // Category Summary (Expenses only)
    const categoryData = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

    const doughnutData = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                data: Object.values(categoryData),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#E7E9ED', '#f39c12', '#2ecc71', '#e74c3c'
                ],
            }
        ]
    };

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="dashboard">
            <div className="summary-cards">
                <div className="card summary-card income">
                    <span className="label">合計収入</span>
                    <span className="value">¥{totalIncome.toLocaleString()}</span>
                </div>
                <div className="card summary-card expense">
                    <span className="label">合計支出</span>
                    <span className="value">¥{totalExpense.toLocaleString()}</span>
                </div>
                <div className="card summary-card balance">
                    <span className="label">残高</span>
                    <span className="value">¥{(totalIncome - totalExpense).toLocaleString()}</span>
                </div>
            </div>

            <div className="charts-grid">
                <div className="card chart-container">
                    <h3>月次推移</h3>
                    <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
                <div className="card chart-container">
                    <h3>カテゴリ別支出</h3>
                    <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
};
