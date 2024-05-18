import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../AccountLoginValid/AuthContext";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarCashier from "./NavBar Cashier/NavBar Cashier";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const TIMEOUT_DURATION = 60 * 60 * 1000;

export default function CashierMainPage() {
  const { isCashierLoggedIn, setIsCashierLoggedIn, cashierUser } = useAuth();
  const navigate = useNavigate();

  // Timeout handling
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); 

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(handleLogout, TIMEOUT_DURATION);
  };

  useEffect(() => {
    const handleUserActivity = () => {
      resetTimeout();
    };

    resetTimeout();

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keypress", handleUserActivity);
    }
  }, []);


  // Token
  useEffect(() => {
    const token = localStorage.getItem("cashierLoggedIn");
    const storedFirstName = localStorage.getItem("cashierFirstName");
    const storedBusinessName = localStorage.getItem("cashierBusinessName");

    if (!token) {
      navigate("/logincash");
    } else {
      setIsCashierLoggedIn(true);
      axios
        .get("https://pos-sales-springboot-database.onrender.com/user/getAllUser")
        .then((response) => {
          console.log("Hello, ", storedFirstName);
          console.log("Business Name:", storedBusinessName);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isCashierLoggedIn, navigate, cashierUser]);

  // Logout Function
  const [openLogout, setOpenLogout] = React.useState(false);
  const handleClickOpenLogout = () => {
    setOpenLogout(true);
  };
  const handleClickCloseLogout = () => {
    setOpenLogout(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("cashierToken");
    localStorage.removeItem("cashierLoggedIn");
    localStorage.removeItem("cashierUsername");
    localStorage.removeItem("cashierBusinessName");
    navigate("/logincash");
  };

  return (
    <div>
      <NavbarCashier />
      <div className="starting-screen">
        <div className="button-container">
          <Link to="/cashiering">
            <button className="btn-salesmanager">Perform Transaction</button>
          </Link>
          <br></br>
          <Link to="/transactionhistory">
            <button className="btn-salesmanager">Transaction History</button>
          </Link>
          <br></br>
          <button className="btn-salesmanager" onClick={handleClickOpenLogout}>
            Sign Out
          </button>
        </div>

        <Dialog open={openLogout} onClose={handleClickCloseLogout}>
          <DialogTitle
            sx={{ fontSize: "1.6rem", color: "red", fontWeight: "bold" }}
          >
            Warning!
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontSize: "1.6rem" }}>
              Are you sure you want to logout?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              sx={{ fontSize: "15px", fontWeight: "bold" }}
              onClick={handleClickCloseLogout}
            >
              Cancel
            </Button>
            <Button
              sx={{ fontSize: "15px", fontWeight: "bold" }}
              onClick={handleLogout}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Outlet />
      </div>
    </div>
  );
}
