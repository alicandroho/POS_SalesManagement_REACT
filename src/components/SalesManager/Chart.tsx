import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import { ChartsTextStyle } from '@mui/x-charts/ChartsText';
import { Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './CSS Files/Chart.css';

interface Transaction {
  total_price: number;
  date_time: string;
}

export default function Chart() {
  const theme = useTheme();
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);

  useEffect(() => {
    axios
      .get("https://pos-sales-springboot-database.onrender.com/transaction/getAllTransaction", {
        params: {
          business: localStorage.getItem("salesmanBusinessName")
        }
      })
      .then((response) => {
        setTransactionData(response.data);
        console.log("Transaction Data: ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching transaction data:", error);
      });
  }, []);

  // Process transaction data and calculate total prices by hour each day
  const processData = () => {
    const hourlyTotals: { [key: string]: number } = {};

    transactionData.forEach((transaction) => {
      const date = new Date(transaction.date_time);
      const hourKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

      if (hourlyTotals[hourKey]) {
        hourlyTotals[hourKey] += transaction.total_price;
      } else {
        hourlyTotals[hourKey] = transaction.total_price;
      }
    });

    // Sort the data by date in ascending order
    const sortedData = Object.keys(hourlyTotals)
      .map((key) => ({
        time: key,
        amount: parseFloat(hourlyTotals[key].toFixed(2)),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.time).getTime(); // Get time in milliseconds
        const dateB = new Date(b.time).getTime(); // Get time in milliseconds
        return dateA - dateB;
      });

    return sortedData;
  };

  const dataWithGrossSales = processData();

  return (
    <React.Fragment>
      <Typography variant='h4'sx={{ fontWeight: 600, color: 'rgb(58, 110, 112)', marginBottom: 2}}>This Month</Typography>
      <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={dataWithGrossSales}
          margin={{
            top: 16,
            left: 70,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'time',
              tickNumber: 2,
              tickLabelStyle: {
                ...(theme.typography.body2 as ChartsTextStyle),
                fontSize: '14px', 
              },
            },
          ]}
          yAxis={[
            {
              label: 'Sales (₱)',
              labelStyle: {
                ...(theme.typography.body1 as ChartsTextStyle),
                fill: theme.palette.text.primary,
                fontSize: '14px', 
              },
              tickLabelStyle: {
                ...(theme.typography.body2 as ChartsTextStyle),
                fontSize: '14px', 
              },
              tickNumber: 3,
            },
          ]}
          series={[
            {
              dataKey: 'amount',
              showMark: false,
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
            [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translateX(-25px)',
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}
