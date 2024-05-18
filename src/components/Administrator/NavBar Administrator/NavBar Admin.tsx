import { Link, useNavigate } from 'react-router-dom';
// import LOGOS from '../../Global Configuration/LOGOS.png';
import LOGOS2 from './LOGOS2.png';
import { useEffect } from 'react';
import { useAuth } from '../../AccountLoginValid/AuthContext';
import axios from 'axios';
import { IconButton, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function NavbarAdmin() {
  const { isAdminLoggedIn, setIsAdminLoggedIn, adminUser } = useAuth();
  const navigate = useNavigate();


  // Token
  useEffect(() => {
    const token = localStorage.getItem('adminLoggedIn');
    const storedFirstName = localStorage.getItem('adminFirstName');
    const storedBusinessName = localStorage.getItem('adminBusinessName');
    
    if (!token) {
      navigate('/loginadmin');
    } else {
      setIsAdminLoggedIn(true);
    axios.get('http://localhost:8080/user/getAllUser')
      .then((response) => {
        console.log('Hello, ', storedFirstName);
        console.log('Business Name:', storedBusinessName);
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }, [isAdminLoggedIn, navigate, adminUser]);

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
        {localStorage.getItem('adminUsername')}
      </Typography>
    </div>
  </nav>
);
}