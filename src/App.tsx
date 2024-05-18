import React from 'react';
import './App.css';
import './components/Global Configuration/NavBar.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CashierMainPage from './components/Cashier/CashierMainPage';
import Cashiering from './components/Cashier/Cashiering';
import SalesSummary from './components/SalesManager/Dashboard';
import TransactionHistory from './components/Cashier/TransactionHistory';
import LoginCashier from './components/Cashier/LoginCashier';
import StartingScreen from './components/StartingScreen/StartingScreen';
import LoginSalesManager from './components/SalesManager/LoginSalesManager';
import LoginAdmin from './components/Administrator/LoginAdmin';
import CreateAccountAdmin from './components/Administrator/CreateAccountAdmin';
import ForgotPassword from './components/Administrator/ForgotPassword';
import ChangePassword from './components/Administrator/ChangePassword';
import AdminMainPage from './components/Administrator/AdminMainPage';
import ViewAccounts from './components/Administrator/ViewAccounts';
import { AuthProvider } from './components/AccountLoginValid/AuthContext';
import CreateAccountUsers from './components/Administrator/CreateAccountUsers';
import HomePage from './components/StartingScreen/HomePage';
import Transaction_Details from './components/Cashier/Transaction_Details';
import ItemPage from './components/SalesManager/ItemPage';
import TransactionsSales from './components/SalesManager/Transactions';

function App() {
  return (
    <div className="App">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet"></link>
      <BrowserRouter>
            <Routes>
              <Route path = "/" element = {<HomePage/>}/>
              <Route path = "/startingscreen" element = {<StartingScreen/>}/>
              <Route path = "/loginsales" element = {<LoginSalesManager/>}></Route>
              <Route path = "/salessummary"  element = {<SalesSummary/>}></Route>
              <Route path = "/itempage"  element = {<ItemPage/>}></Route>
              <Route path = "/logincash" element ={<LoginCashier/>}/>
              <Route path = "/cashier-main" element ={<CashierMainPage />}/>
              <Route path = "/cashiering"  element = {<Cashiering/>}></Route>
              <Route path = "/transactionhistory"  element = {<TransactionHistory/>}></Route>
              <Route path = "/transactions/:id" element ={<Transaction_Details />} />
              <Route path = "/loginadmin" element = {<LoginAdmin/>}/>
              <Route path = "/createaccountadmin" element = {<CreateAccountAdmin/>}/>
              <Route path = "/forgotpassword" element = {<ForgotPassword/>}/>
              <Route path = "/changepassword" element = {<ChangePassword/>}/>
              <Route path = "/adminmainpage" element = {<AdminMainPage/>}/>
              <Route path = "/viewaccounts" element = {<ViewAccounts/>}/>
              <Route path = "/createaccountusers" element = {<CreateAccountUsers/>}/>
              <Route path = "/transactions" element = {<TransactionsSales/>}/>

            </Routes>
        </BrowserRouter> 
    </div>
  );
}

export default function AppWithProvider() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
