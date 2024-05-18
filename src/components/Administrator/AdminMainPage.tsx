import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../AccountLoginValid/AuthContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import NavbarAdmin from "./NavBar Administrator/NavBar Admin";

const TIMEOUT_DURATION = 60 * 60 * 1000;

const AdminMainPage = () => {
  const { isAdminLoggedIn, setIsAdminLoggedIn, adminUser } = useAuth();
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
    const token = localStorage.getItem("adminLoggedIn");
    const storedFirstName = localStorage.getItem("adminFirstName");
    const storedBusinessName = localStorage.getItem("adminBusinessName");

    if (!token) {
      navigate("/loginadmin");
    } else {
      setIsAdminLoggedIn(true);
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
  }, [isAdminLoggedIn, navigate, adminUser]);

  // Logout Function
  const [openLogout, setOpenLogout] = React.useState(false);

  const handleClickOpenLogout = () => {
    setOpenLogout(true);
  };
  const handleClickCloseLogout = () => {
    setOpenLogout(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminUsername");
    localStorage.removeItem("adminBusinessName");
    navigate("/loginadmin");
  };

  return (
    <div>
      <NavbarAdmin />
      <div className="starting-screen">
        <div className="button-container">
          <Link to="/createaccountadmin">
            <button className="btn-salesmanager">Create New Account</button>
          </Link>
          <br></br>
          <Link to="/viewaccounts">
            <button className="btn-salesmanager">View Accounts</button>
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
};

export default AdminMainPage;
