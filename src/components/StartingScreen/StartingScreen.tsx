import React from 'react';
import { Link } from 'react-router-dom';
import './StartingScreen.css'; // You should create a CSS file for styling
import Navbar from '../Global Configuration/NavBar';

const StartingScreen = () => {
  return (
    <div>
      <Navbar/>
      <div className="starting-screen">
        <h1 className='h1-startingscreen-dilven'>Dilven</h1>
        <h1 className='h1-startingscreen'>POS Sales</h1>
        <div className="button-container">
                  <Link to="/loginsales">
                    <button className='btn-salesmanager'>Sales Manager</button>
                  </Link>
                  <br></br>
                  <Link to="/logincash">
                    <button className='btn-cashier'>Cashier</button>
                  </Link>
                  <br></br>
                  <Link to="/loginadmin">
                    <button className='btn-admin'>Administrator</button>
                  </Link>
              </div>
      </div>
    </div>
  );
};

export default StartingScreen;
