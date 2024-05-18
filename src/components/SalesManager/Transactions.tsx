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
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import { AddShoppingCart, ManageAccounts, Menu } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ViewTransactionLink from "../Cashier/ViewTransactionLink";

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

export default function TransactionsSales() {
  const [open, setOpen] = React.useState(true);

  const { isSalesManLoggedIn, setIsSalesManLoggedIn, salesUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  // Token
  useEffect(() => {
    const token = localStorage.getItem("salesmanLoggedIn");
    const storedUsername = localStorage.getItem("salesmanUsername");
    const storedBusinessName = localStorage.getItem("salesmanBusinessName");

    if (!token) {
      navigate("/loginsales");
    } else {
      setIsSalesManLoggedIn(true);
      axios
        .get("https://pos-sales-springboot-database.onrender.com/user/getAllUser")
        .then((response) => {
          console.log("Hello, ", storedUsername);
          console.log("Business Name:", storedBusinessName);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isSalesManLoggedIn, navigate, salesUser]);

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

  // Gross Sales
  const [total_price, setTotal_Price] = useState<number | null>(null);
  useEffect(() => {
    // Fetch the product with the highest purchase count from the API
    axios
      .get("https://pos-sales-springboot-database.onrender.com/transaction/gross-sales", {
        params: {
          business: localStorage.getItem("salesmanBusinessName")
        }
      })
      .then((response) => {
        setTotal_Price(response.data);
        console.log("Gross Sales: ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching gross sales:", error);
      });
  }, []);

  // Net Sales
  const [netSales, setNetSales] = useState<number | null>(null);
  useEffect(() => {
    // Fetch the product with the highest purchase count from the API
    axios
      .get("https://pos-sales-springboot-database.onrender.com/transaction/net-sales", {
        params: {
          business: localStorage.getItem("salesmanBusinessName")
        }
      })
      .then((response) => {
        setNetSales(response.data);
        console.log("Net Sales: ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching net sales:", error);
      });
  }, []);

  // Refunds
  const [refunds, setRefunds] = useState<number | null>(null);
  useEffect(() => {
    // Fetch the product with the highest purchase count from the API
    axios
      .get("https://pos-sales-springboot-database.onrender.com/transaction/refunded-prices", {
        params: {
          business: localStorage.getItem("salesmanBusinessName")
        }
      })
      .then((response) => {
        setRefunds(response.data);
        console.log("Refunds: ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching Refunds:", error);
      });
  }, []);

  // Returns
  const [returns, setReturns] = useState<number | null>(null);
  useEffect(() => {
    // Fetch the product with the highest purchase count from the API
    axios
      .get("https://pos-sales-springboot-database.onrender.com/transaction/returned-prices", {
        params: {
          business: localStorage.getItem("salesmanBusinessName")
        }
      })
      .then((response) => {
        setReturns(response.data);
        console.log("Returns: ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching Returns:", error);
      });
  }, []);

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

            <Link to="/salessummary" className="side-nav">
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

            <Link
              to="/transactions"
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
                  <div className="header_product">
                    <div className="row">
                      <Card
                        style={{
                          width: 200,
                          background:
                            "linear-gradient(to right, #249990, #3D5B9B)",
                          color: "Turquoise",
                          fontWeight: 700,
                          fontSize: 16,
                          marginRight: 10,
                          marginLeft: 10,
                          height: 90,
                        }}
                      >
                        <CardContent>
                          Gross Sales <br></br>
                          <Typography
                            style={{
                              color: "white",
                              fontSize: 20,
                              fontWeight: 600,
                            }}
                          >
                            ₱{total_price ? total_price.toFixed(2) : "0.00"}
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card
                        style={{
                          width: 200,
                          background:
                            "linear-gradient(to right,  #3D5B9B ,#249990)",
                          color: "Turquoise",
                          fontWeight: 700,
                          fontSize: 16,
                          marginRight: 10,
                          marginLeft: 10,
                        }}
                      >
                        <CardContent>
                          Net Sales <br></br>
                          <span style={{ color: "white", fontSize: 20 }}>
                            ₱{netSales ? netSales.toFixed(2) : "0.00"}
                          </span>
                        </CardContent>
                      </Card>

                      <Card
                        style={{
                          width: 200,
                          background:
                            "linear-gradient(to right,  #3D5B9B ,#249990)",
                          color: "Turquoise",
                          fontWeight: 700,
                          fontSize: 16,
                          marginRight: 10,
                          marginLeft: 10,
                        }}
                      >
                        <CardContent>
                          Returns <br></br>
                          <span style={{ color: "white", fontSize: 20 }}>
                            ₱{returns ? returns.toFixed(2) : "0.00"}
                          </span>
                        </CardContent>
                      </Card>

                      <Card
                        style={{
                          width: 200,
                          background:
                            "linear-gradient(to right,  #3D5B9B ,#249990)",
                          color: "Turquoise",
                          fontWeight: 700,
                          fontSize: 16,
                          marginRight: 10,
                          marginLeft: 10,
                        }}
                      >
                        <CardContent>
                          Refunds <br></br>
                          <span style={{ color: "white", fontSize: 20 }}>
                            ₱{refunds ? refunds.toFixed(2) : "0.00"}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div style={{ height: 550, width: "100%", marginTop: 20 }}>
                    <DataGrid
                      sx={{ fontSize: 15 }}
                      rows={transactions}
                      columns={columns}
                      pageSizeOptions={[5, 10]}
                      getRowId={getRowId}
                    />
                    <p style={{ marginTop: 10 }}>
                      Click on the three dots on the right side of each column
                      on the table for additional options.
                    </p>
                    <p>
                      Go to cashiering to view full details on transactions.
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
