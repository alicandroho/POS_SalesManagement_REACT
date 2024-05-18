import * as React from "react";
import {
  styled,
  createTheme,
  ThemeProvider,
  createMuiTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useAuth } from "../AccountLoginValid/AuthContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AddShoppingCart,
  ManageAccounts,
  Menu,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "./CSS FIles/TransactionHistory.css";
import MenuIcon from '@mui/icons-material/Menu';
import ViewTransactionLink from "./ViewTransactionLink";

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
  business: String;
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

export default function TransactionHistory() {
  const [open, setOpen] = React.useState(true);

  const { isCashierLoggedIn, setIsCashierLoggedIn, cashierUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  // Token
  useEffect(() => {
    const token = localStorage.getItem("cashierLoggedIn");
    if (!token) {
      navigate("/logincash");
    } else {
      setIsCashierLoggedIn(true);
      axios
        .get("https://pos-sales-springboot-database.onrender.com/transaction/getAllTransaction", {
          params: {
            business: localStorage.getItem("cashierBusinessName")
          }
        })
        .then((response) => {
          console.log(localStorage.getItem("cashierBusinessName"));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isCashierLoggedIn, navigate, cashierUser]);

  const themeDilven = createTheme({
    palette: {
      primary: {
        main: "#1D7D81",
      },
    },
  });

  // Fetch Transactions
  useEffect(() => {
    axios
      .get("https://pos-sales-springboot-database.onrender.com/transaction/getAllTransaction", {
        params: {
          business: localStorage.getItem("cashierBusinessName")
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
    // { field: 'actions', headerName: 'Actions', flex: 1, renderCell: (params) => <Transaction_Details {...params.row} /> },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "column-header",
      flex: 1,
      renderCell: (params) => (
        <ViewTransactionLink
          transactionid={params.row.transactionid.toString()}
        />
      ),
    },
  ];

  const getRowId = (row: Transaction) => row.transactionid;

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
              Transaction History
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
                {localStorage.getItem("cashierUsername")}
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
            {localStorage.getItem("cashierBusinessName")}{" "}
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

            <Link to="/cashier-main" className="side-nav">
              <IconButton color="inherit">
                <Menu sx={{ fontSize: 15 }} />
              </IconButton>
              <Button>Cashier Main</Button>
            </Link>

            <Link to="/cashiering" className="side-nav">
              <IconButton color="inherit">
                <AddShoppingCart sx={{ fontSize: 15 }} />
              </IconButton>
              <Button>Perform Transaction</Button>
            </Link>

            <Link
              to="/transactionhistory"
              style={{ backgroundColor: "#AFE1AF" }}
              className="side-nav"
            >
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
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    fontSize: 15,
                    fontFamily: "sans-serif",
                  }}
                  style={{ height: 800 }}
                >
                  <div style={{ height: 700, width: "100%" }}>
                    <DataGrid
                      sx={{ fontSize: 15 }}
                      rows={transactions}
                      columns={columns}
                      pageSizeOptions={[5, 10]}
                      getRowId={getRowId}
                    />
                    <p>
                      Click on the three dots on the right side of each column
                      on the table for additional options.{" "}
                    </p>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      <ToastContainer
        className="foo"
        style={{ width: "600px", fontSize: 15 }}
      />
    </ThemeProvider>
  );
}