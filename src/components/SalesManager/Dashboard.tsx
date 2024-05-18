import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Divider,
  IconButton,
  List,
  Button,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ShieldIcon from "@mui/icons-material/Shield";
import {
  AddShoppingCart,
  ManageAccounts,
  Menu,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import MuiDrawer from "@mui/material/Drawer";
import { useEffect, useRef, useState } from "react";
import GrossSales from "./GrossSales";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Chart from "./Chart";

const drawerWidth: number = 300;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface Transaction {
  transactionid: number;
  total_quantity: number;
  total_price: number;
  tendered_bill: number;
  balance: number;
  customer_name: string;
  customer_num: string;
  customer_email: string;
  date_time: string;
  refunded: boolean;
  returned: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const themeDilven = createTheme({
  palette: {
    primary: {
      main: "#1D7D81",
    },
  },
});
const TIMEOUT_DURATION = 60 * 60 * 1000;

export default function SalesSummary() {
  const [open, setOpen] = React.useState(true);
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
    };
  }, []);

  // Logout Function
  const [openLogout, setOpenLogout] = React.useState(false);
  const handleClickOpenLogout = () => {
    setOpenLogout(true);
  };
  const handleClickCloseLogout = () => {
    setOpenLogout(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("salesmanToken");
    localStorage.removeItem("salesmanLoggedIn");
    localStorage.removeItem("salesmanUsername");
    localStorage.removeItem("salesmanBusinessName");
    navigate("/loginsales");
  };

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch Transactions
  useEffect(() => {
    axios
      .get("https://pos-sales-springboot-database.onrender.com/transaction/getAllTransaction", {
        params: {
          business: localStorage.getItem("salesmanBusinessName")
        }
      })
      .then((response) => {
        setTransactions(response.data);
        console.log("response:", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const columns: GridColDef[] = [
    {
      field: "transactionid",
      headerName: "ID",
      width: 70,
      headerClassName: "column-header",
    },
    {
      field: "date_time",
      headerName: "Date/Time",
      width: 200,
      headerClassName: "column-header",
    },
    {
      field: "cashier",
      headerName: "Cashier",
      flex: 1,
      headerClassName: "column-header",
    },
    {
      field: "total_quantity",
      headerName: "Total Quantity",
      flex: 1,
      headerClassName: "column-header",
    },
    {
      field: "total_price",
      headerName: "Total Price",
      flex: 1,
      headerClassName: "column-header",
    },
    {
      field: "customer_name",
      headerName: "Customer Name",
      flex: 1,
      headerClassName: "column-header",
    },
    {
      field: "refunded",
      headerName: "Refunded",
      flex: 1,
      headerClassName: "column-header",
    },
    {
      field: "returned",
      headerName: "Returned",
      flex: 1,
      headerClassName: "column-header",
    },
  ];

  const getRowId = (row: Transaction) => row.transactionid;

  return (
    <ThemeProvider theme={themeDilven}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <Typography
              component="h1"
              variant="h4"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              <span
                className="nav-user"
                style={{ float: "right", marginRight: 10 }}
              >
                <IconButton color="inherit">
                  <AccountCircleIcon sx={{ fontSize: 30 }} />
                </IconButton>
                {localStorage.getItem("salesmanUsername")}
              </span>
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: "20px",
              fontWeight: "bold",
              justifyContent: "center",
              color: "#4BB543",
              px: [1],
            }}
          >
            {localStorage.getItem("salesmanBusinessName")}{" "}
            {/* Display Business Name */}
          </Toolbar>
          <Divider />
          <List component="nav">
            <Link to="/#" className="side-nav">
              <IconButton color="inherit">
                <HomeIcon sx={{ fontSize: 15 }} />
              </IconButton>
              <Button>Home</Button>
            </Link>

            <Link
              to="/salessummary"
              className="side-nav"
              style={{ backgroundColor: "#AFE1AF" }}
            >
              <IconButton color="inherit">
                <Menu sx={{ fontSize: 15 }} />
              </IconButton>
              <Button>Dashboard</Button>
            </Link>

            <Link to="/itempage" className="side-nav">
              <IconButton color="inherit">
                <AddShoppingCart sx={{ fontSize: 15 }} />
              </IconButton>
              <Button>Products</Button>
            </Link>

            <Link to="/transactions" className="side-nav">
              <IconButton color="inherit">
                <ManageAccounts sx={{ fontSize: 15 }} />
              </IconButton>
              <Button>Transactions</Button>
            </Link>

            <Link onClick={handleClickOpenLogout} to="" className="side-nav">
              <IconButton color="inherit">
                <LogoutIcon sx={{ fontSize: 15 }} />
              </IconButton>
              <Button>Logout</Button>
            </Link>

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
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <Chart />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                    fontSize: 16,
                  }}
                >
                  <GrossSales />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 600,  color: '#3A6E70', fontFamily: "Poppins", marginBottom: 2 }}>Recent Orders</Typography>
                  <div style={{ height: 500, width: "100%" }}>
                    <DataGrid
                      sx={{ fontSize: 15 }}
                      rows={transactions}
                      columns={columns}
                      pageSizeOptions={[5, 10]}
                      getRowId={getRowId}
                    />
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
