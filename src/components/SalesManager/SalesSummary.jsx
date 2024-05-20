import React, { useState, useEffect } from 'react';
import { IconButton, Drawer, List, ListItem, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AccountLoginValid/AuthContext';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import item_page from './Images/item_page.png';
import sales_summry from './Images/sales_summary.png';
import logout from './Images/logout.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function SalesSummary() {
  const { isSalesmanLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [setRefunds] = useState(0);
  const [setReturns] = useState(0);
  const [setGrossSales] = useState(0);
  const [setNetSales] = useState(0);
  

  useEffect(() => {
    axios.get('https://pos-sales-springboot-database.onrender.com/transaction/getAllTransaction')
      .then((response) => {
        const allTransactions = response.data;
        setTransactions(allTransactions);
  
        // ... rest of the code
  
        const grossSales = allTransactions.reduce((total, transaction) => {
          if (!transaction.refunded && !transaction.returned) {
            return total + transaction.total_price;
          }
          return total;
        }, 0);
  
        const refunds = allTransactions.reduce((total, transaction) => {
          if (transaction.refunded) {
            return total + transaction.total_price;
          }
          return total;
        }, 0);
  
        const returns = allTransactions.reduce((total, transaction) => {
          if (transaction.returned) {
            return total + transaction.total_price;
          }
          return total;
        }, 0);

        const netSales = grossSales - (refunds + returns);
  
        setRefunds(refunds);
        setReturns(returns);
        setGrossSales(grossSales);
        setNetSales(netSales);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });
  }, [setRefunds, setReturns, setGrossSales, setNetSales]);
  
  // Fetch all transactions when the component mounts
  useEffect(() => {
    axios.get('http://localhost:8080/transaction/getAllTransaction')
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });
  }, []);

  const handleLogout = () => {
    const confirm = window.confirm('Are you sure you want to logout?')
    if (confirm) {
      localStorage.removeItem('salesmanToken');
      localStorage.removeItem('salesmanLoggedIn');
      navigate('/loginsales');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('salesmanToken');
    if (!token) {
      navigate('/loginsales');
    } else {
    }
  }, [isSalesmanLoggedIn, navigate]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const location = useLocation();

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const grossSales = transactions.reduce((total, transaction) => {
    if (!transaction.refunded && !transaction.returned) {
      return total + transaction.total_price;
    }
    return total;
  }, 0);
  
  const refunds = transactions.reduce((total, transaction) => {
    if (transaction.refunded) {
      return total + transaction.total_price;
    }
    return total;
  }, 0);
  
  const returns = transactions.reduce((total, transaction) => {
    if (transaction.returned) {
      return total + transaction.total_price;
    }
    return total;
  }, 0);
  
  const netSales = grossSales - (refunds + returns);
  
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Filter transactions for the current month
  const monthlyTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date_time);
    return (
      transactionDate >= startDate && transactionDate <= endDate
    );
  });
  
  // Prepare data for the Line Chart
  const chartData = monthlyTransactions.map((transaction) => ({
    name: transaction.date_time,
    grossSales: transaction.total_price,
    refunds: transaction.refunded ? transaction.total_price : 0,
    returns: transaction.returned ? transaction.total_price : 0,
    netSales:
      transaction.total_price -
      (transaction.refunded ? transaction.total_price : 0) -
      (transaction.returned ? transaction.total_price : 0),
  }));

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeGranularity, setTimeGranularity] = useState('day'); // day, week, or month
  const [showOverallSummary, setShowOverallSummary] = useState(true);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [overallSelectedDate, setOverallSelectedDate] = useState(new Date());
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowOverallSummary(false);

    // Filter transactions based on the selected time granularity
    let filteredData = [];
    switch (timeGranularity) {
      case 'day':
        filteredData = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date_time);
          return (
            transactionDate.getFullYear() === date.getFullYear() &&
            transactionDate.getMonth() === date.getMonth() &&
            transactionDate.getDate() === date.getDate()
          );
        });
        break;
      case 'week':
        // Implement week filtering logic
        break;
      case 'month':
        filteredData = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date_time);
          return (
            transactionDate.getFullYear() === date.getFullYear() &&
            transactionDate.getMonth() === date.getMonth()
          );
        });
        break;
      default:
        break;
    }

    setFilteredTransactions(filteredData);
  };

  const handleOverallDateChange = (date) => {
    setOverallSelectedDate(date);
    //... any other logic needed for the overall summary
  };
  

  // Add a new function to handle granularity change
  const handleGranularityChange = (granularity) => {
    setTimeGranularity(granularity);
  };

  
  const renderOverallSummary = () => {
    return (
      <div>
        {/* Overall Summary components */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
          <Typography variant="h2" style={{ fontWeight: 'bold', marginLeft: '29rem' }}>Gross Sales</Typography>
          <Typography variant="h2" style={{ fontWeight: 'bold', marginRight: '38rem' }}>
            {grossSales.toFixed(2)}
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <Typography variant="h2" style={{ fontWeight: 'bold', marginLeft: '29rem' }}>Refunds</Typography>
          <Typography variant="h2" style={{ fontWeight: 'bold', marginRight: '38rem' }}>{refunds.toFixed(2)}</Typography>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <Typography variant="h2" style={{ fontWeight: 'bold', marginLeft: '29rem' }}>Returns</Typography>
          <Typography variant="h2" style={{ fontWeight: 'bold', marginRight: '38rem' }}>{returns.toFixed(2)}</Typography>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5rem', backgroundColor: '#90B7B8', padding: '0.5rem', borderRadius: '5px', marginLeft: '20rem', marginRight: '25rem' }}>
          <Typography variant="h2" style={{ fontWeight: 'bold', marginLeft: '8.6rem' }}>Net Sales</Typography>
          <Typography variant="h2" style={{ fontWeight: 'bold', marginRight: '12.6rem' }}>{netSales.toFixed(2)}</Typography>
        </div>
      </div>
    );
  };
  
  
  const renderDateSpecificSummary = () => {
    return (
      <div>
         <div style={{ textAlign: 'center', margin: '2rem' }}>
         <DatePicker selected={overallSelectedDate} onChange={handleOverallDateChange} dateFormat="MM/dd/yyyy" />
        <button style={{ marginLeft: 10, fontSize: 17, color: 'green' }} onClick={() => setShowOverallSummary(true)}>
          Overall
        </button>
        {/* Add buttons or dropdown for selecting time granularity */}
        <button onClick={() => handleGranularityChange('day')}>Day</button>
        <button onClick={() => handleGranularityChange('week')}>Week</button>
        <button onClick={() => handleGranularityChange('month')}>Month</button>
      </div>

  
              {/* Display Refunds */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <Typography variant="h2" style={{ fontWeight: 'bold', marginLeft: '29rem' }}>Refunds</Typography>
        <Typography variant="h2" style={{ fontWeight: 'bold', marginRight: '38rem' }}>
        {filteredTransactions
          .filter((transaction) => transaction.refunded === true)
          .reduce((total, transaction) => {
            console.log("Reducing Transaction: ", transaction);
            return total + transaction.total_price;
          }, 0)
          .toFixed(2)}
                </Typography>
              </div>

      {/* Display Returns */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <Typography variant="h2" style={{ fontWeight: 'bold', marginLeft: '29rem' }}>Returns</Typography>
        <Typography variant="h2" style={{ fontWeight: 'bold', marginRight: '38rem' }}>
          {filteredTransactions
            .filter((transaction) => transaction.returned === true)
            .reduce((total, transaction) => total + transaction.total_price, 0)
            .toFixed(2)}
        </Typography>
      </div>

      {/* Calculate Net Sales */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5rem', backgroundColor: '#90B7B8', padding: '0.5rem', borderRadius: '5px', marginLeft: '20rem', marginRight: '25rem' }}>
        <Typography variant="h2" style={{ fontWeight: 'bold', marginLeft: '8.6rem' }}>Net Sales</Typography>
        <Typography variant="h2" style={{ fontWeight: 'bold', marginRight: '12.6rem' }}>
          {(
            filteredTransactions.reduce((total, transaction) => total + transaction.total_price, 0) -
            filteredTransactions
              .filter((transaction) => transaction.refunded === 'refunded')
              .reduce((total, transaction) => total + transaction.total_price, 0) -
            filteredTransactions
              .filter((transaction) => transaction.returned === 'returned')
              .reduce((total, transaction) => total + transaction.total_price, 0)
          ).toFixed(2)}
        </Typography>
      </div>
      </div>
    );
  };
  


  return (
    <div>
      {/* Hamburger icon to open the Drawer */}
      <IconButton
        edge="end"
        color="inherit"
        aria-label="open drawer"
        onClick={openDrawer}
        sx={{
          position: 'fixed',
          top: '.5rem',
          right: '2rem',
          fontSize: '6rem',
          zIndex: 999,
        }}
      >
        <MenuIcon sx={{ fontSize: '3rem' }} /> {/* Place the MenuIcon component here */}
      </IconButton>

      {/* Drawer component */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer} sx={{ width: '5rem' }}>
        <List>
          <ListItem button component={Link} to="/salessummary">
            <h2 style={{ fontFamily: 'Poppins' }}>Sales Summary</h2>
          </ListItem>
          <ListItem button component={Link} to="/itempage">
            <h2 style={{ fontFamily: 'Poppins' }}>Item Page</h2>
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <h2 style={{ fontFamily: 'Poppins' }}>Log Out</h2>
          </ListItem>
        </List>
      </Drawer>

      <div className="center">
        {/* Hamburger icon to open the Drawer */}
        <IconButton
          edge="end"
          aria-label="open drawer"
          onClick={openDrawer}
          sx={{
            position: 'fixed',
            top: '.5rem',
            right: '2rem',
            fontSize: '6rem',
            zIndex: 999,
          }}
        >
          <MenuIcon sx={{ fontSize: '3rem' }} /> {/* Place the MenuIcon component here */}
        </IconButton>
        {/* Drawer component */}
        <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer} sx={{ width: '5rem' }}>
          <div className="drawer-account">
            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'bold', color: 'white', fontSize: 25, textAlign: 'center' }}>
              Sales Manager
            </Typography>
          </div>
          <List>

            <ListItem button component={Link} to="/salessummary" className={location.pathname === '/salessummary' ? 'active-link' : ''}>
              <h2 style={{ fontFamily: 'Poppins', fontSize: 25, fontWeight: 'bold', color: '#213458', padding: 2, margin: 'auto', marginLeft: 5, marginRight: 90 }}>Sales Summary</h2>
              <img src={sales_summry} className="img_cashiering" alt='sales_summary' />
            </ListItem>

            <ListItem button component={Link} to="/itempage" className={location.pathname === '/itempage' ? 'active-link' : ''}>
              <h2 style={{ fontFamily: 'Poppins', fontSize: 25, fontWeight: 'bold', padding: 2, margin: '#213458', marginRight: 160, marginLeft: 5 }}>Item Page</h2>
              <img src={item_page} className="img_cashiering" alt='item_page' />
            </ListItem>

            <ListItem button onClick={handleLogout} className={location.pathname === '/logout' ? 'active-link' : ''}>
              <h2 style={{ fontFamily: 'Poppins', fontSize: 25, fontWeight: 'bold', color: '#213458', padding: 2, marginRight: 200, marginLeft: 5 }} >Log Out</h2>
              <img src={logout} className='img_cashiering' alt='logout' />
            </ListItem>
          </List>
        </Drawer>

        <Typography variant="h2" style={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'Poppins' }}>
          SALES SUMMARY
        </Typography>
        <div style={{ textAlign: 'center', margin: '2rem' }}>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="MM/dd/yyyy"
        />
        <DatePicker selected={overallSelectedDate} onChange={handleOverallDateChange} dateFormat="MM/dd/yyyy" />
         <button style={{marginLeft: 10, fontSize: 17, color: 'green'}} onClick={() => setShowOverallSummary(true)}>Overall</button>
      </div>          
      {showOverallSummary ? renderOverallSummary() : renderDateSpecificSummary()}
        <br></br>
        <br></br>
        <br></br>
        <ResponsiveContainer width="100%" height={300}>
  <LineChart
    data={chartData}
    margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5,
    }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name">
            </XAxis>
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="grossSales" name="Gross Sales" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="refunds" name="Refunds" stroke="#ff7300" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="returns" name="Returns" stroke="#413ea0" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="netSales" name="Net Sales" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* <ToastContainer className="foo" style={{ width: "500px", fontSize: 16 }} /> */}

    </div>
  );
}
