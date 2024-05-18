import { Link, useNavigate } from 'react-router-dom';
// import LOGOS from '../../Global Configuration/LOGOS.png';
import LOGOS2 from './LOGOS2.png';
import { useEffect } from 'react';
import { useAuth } from '../../AccountLoginValid/AuthContext';
import axios from 'axios';
import { IconButton, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';

export default function NavbarCashier() {
  const { isCashierLoggedIn, setIsCashierLoggedIn, cashierUser } = useAuth();
  const navigate = useNavigate();

  // Token
  useEffect(() => {
   const token = localStorage.getItem('cashierLoggedIn');
   const storedFirstName = localStorage.getItem('cashierFirstName');
   const storedBusinessName = localStorage.getItem('cashierBusinessName');

  if (!token) {
    navigate('/logincashier');
  } else {
    setIsCashierLoggedIn(true);
    axios.get('http://localhost:8080/user/getAllUser')
    .then((response) => {
      console.log('Hello, ', storedFirstName);
      console.log('Business Name:', storedBusinessName);
    })
    .catch((error) => {
      console.error(error);
    });
  }}, [isCashierLoggedIn, navigate, cashierUser]);

    // Logout Function
    const [openLogout, setOpenLogout] = React.useState(false);
    const handleClickOpenLogout = () => { setOpenLogout(true); }
    const handleClickCloseLogout = () => { setOpenLogout(false); }
  
    const handleLogout = () => {
      localStorage.removeItem('cashierToken');
      localStorage.removeItem('cashierLoggedIn')
      localStorage.removeItem('cashierUsername');
      localStorage.removeItem('cashierBusinessName');
      navigate('/logincashier');
    }

return (
    <nav className="navbar navbar-custom">
    <div className="container-fluid">
     <Link 
        style={{ color: '#FFF', textDecoration: 'none', fontSize: 20 }} 
        to='/'>
          <img src={LOGOS2}  alt="Logo" className="navbar-logo" />
          <span className='navbar-title'>DILVEN POS</span>
      </Link>
      <Typography sx={{  fontFamily: 'sans-serif', color: '#FFF', textDecoration: 'none', fontSize: 20, textAlign: 'right', marginLeft: 190 }}>
        <IconButton color="inherit">
        <AccountCircleIcon sx={{fontSize: 30}}/>
        </IconButton>
        {localStorage.getItem('cashierUsername')}
      </Typography>
    </div>
  </nav>
);
}