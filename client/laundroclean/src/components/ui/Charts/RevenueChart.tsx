"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
} from "recharts";
import styles from "./RevenueChart.module.css";
import { useState } from "react";
import { salesData } from "src/services/adminAnalysisService/mock";

interface FinancialData {
    date: string;
    grossRevenue: number;
    expenses: number;
    netRevenue: number;
    netIncome: number;
}

/*interface TooltipItem {
    dataKey?: React.ReactNode;
}*/

type TimeUnit = 'days' | 'months' | 'years';

export default function RevenueChart() {
    const [timeUnit, setTimeUnit] = useState<TimeUnit>('months');
    const computedChartData: FinancialData[] = salesData.map((item) => ({
        date: item.date,
        grossRevenue: item.bookingServicePrice,
        netRevenue: item.bookingfinalEarned,
        expenses: item.expenses,
        netIncome: item.bookingfinalEarned - item.expenses
    }))

    const totals = computedChartData.reduce((acc, item) => {
        acc.gross += item.grossRevenue;
        acc.sales += item.netRevenue;
        acc.income += item.netIncome;
        acc.expenses += item.expenses;
        return acc;
    }, { gross: 0, income: 0, expenses: 0, sales: 0 })

    const pieChartData = [
        { name: 'Gross Paid', value: totals.gross, fill: '#4CAF50' },
        { name: 'Net Revenue', value: totals.sales, fill: '#a3af4c' },
        { name: 'Net Income', value: totals.income, fill: '#9C27B0' },
        { name: 'Expenses', value: totals.expenses, fill: '#F44336' },
    ]

    const formatTimeAxis = (tickItem: string): string => {
        const date = new Date(tickItem);

        if (isNaN(date.getTime())) {
            return tickItem;
        }

        if (timeUnit === 'days') {
            return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        }

        if (timeUnit === 'months') {
            return date.toLocaleDateString('en-GB', { month: 'short' });
        }

        if (timeUnit === 'years') {
            return date.getFullYear().toString();
        }
        return tickItem;
    };

    const formatTooltipLabel = (labelValue: React.ReactNode): React.ReactNode => {
        const labelStr = String(labelValue as unknown)
        const date = new Date(labelStr);
        return isNaN(date.getTime()) ? labelStr : date.toLocaleString('en-GB');
    }

    const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setTimeUnit(event.target.value as TimeUnit)
    }
    return (
        <section className={styles.revenueChartContainer}>
            <section className={styles.salesGraph}>
                <div className={styles.controls}>
                    <span className={styles.timeoptions}>
                        <h4>Sales Analytics</h4>
                        <select
                            value={timeUnit}
                            onChange={handleUnitChange}

                        >
                            <option value="days">Day View</option>
                            <option value="months">Month View</option>
                            <option value="years">Year View</option>
                        </select>
                    </span>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={computedChartData}>
                            <XAxis dataKey="date" tickFormatter={formatTimeAxis} />
                            <YAxis />
                            <Tooltip labelFormatter={formatTooltipLabel} />
                            <Legend verticalAlign="top" height={36} />
                            <Line type="monotone" dataKey="grossRevenue" stroke="#8884d4d8" />
                            <Line type="monotone" dataKey="netRevenue" stroke="#d3a21ad8" />
                            <Line type="monotone" dataKey="netIncome" stroke="#3cd31ad8" />
                            <Line type="monotone" dataKey="expenses" stroke="#d3361ad8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <section className={styles.salesBarchart}>
                <h4>Cumulative Volume Overview</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="40%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={3}
                        />

                        <Tooltip
                            formatter={(value) => [
                                value ?? 0,
                                "Total Amount",
                            ]}
                        />

                        <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                            wrapperStyle={{
                                fontSize: "10px"
                            }}
                            formatter={(value, entry) => {
                                const item = pieChartData.find(
                                    (data) => data.name === value
                                );

                                return `${value}: ${item?.value ?? 0}`;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </section>

        </section>
    )
}