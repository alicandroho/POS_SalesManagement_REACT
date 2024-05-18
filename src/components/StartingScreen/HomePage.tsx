import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 
import Navbar from '../Global Configuration/NavBar';

const HomePage = () => {
  return (
    <div className='body-home'>
      <Navbar/>
    <section className="home">
        <div className="home-content">
            <h1>Dilven POS</h1>
            <h3>Point-Of-Sales Sales Management</h3>
            <p>Empower Your Business with Seamless Point of Sale and Sales Management Solutions – Elevate Efficiency, 
                Boost Profits, and Streamline Operations with <b>Dilven</b>.</p>
            <div className="btn-box">
                <Link to={'/startingscreen'} className='link'>Home</Link>
                <Link to={'/createaccountusers'} className='link'>Sign Up</Link>
            </div>
        </div>
    </section>
    </div>
  );
};

export default HomePage;
