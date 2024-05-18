import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AccountBox,
  AccountCircle,
  AddShoppingCart,
  ManageAccounts,
  Menu,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useAuth } from "../AccountLoginValid/AuthContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  styled,
  createTheme,
  ThemeProvider,
  createMuiTheme,
} from "@mui/material/styles";
import UpdateProduct from "./UpdateProducts";

const initialSelectedAccounts: any[] | (() => any[]) = [];

interface Product {
  productid: number;
  is_deleted: boolean;
  price: number;
  productname: String;
  purchaseCount: number;
  quantity: number;
  business: String;
}

const drawerWidth: number = 300;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
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

export default function ItemPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { isSalesManLoggedIn, setIsSalesManLoggedIn, salesUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);

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

  // Logout Function
  const [openLogout, setOpenLogout] = React.useState(false);
  const handleClickOpenLogout = () => {
    setOpenLogout(true);
  };
  const handleClickCloseLogout = () => {
    setOpenLogout(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("salesToken");
    localStorage.removeItem("salesLoggedIn");
    localStorage.removeItem("salesUsername");
    localStorage.removeItem("salesBusinessName");
    navigate("/loginsales");
  };

  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newQuantity, setNewQuantity] = useState(0);
  const [selectedAccounts, setSelectedAccounts] = useState(
    initialSelectedAccounts
  );

  const handleAddProduct = () => {
    if (newProductName && newPrice >= 0 && newQuantity >= 0) {
      // Create the data for the new product
      const newProductData = {
        productname: newProductName,
        price: newPrice,
        quantity: newQuantity,
        isDeleted: false,
        account: selectedAccounts.map((userid) => ({ userid: userid })),
        business: localStorage.getItem("salesmanBusinessName"),
      };
      axios
        .post("https://pos-sales-springboot-database.onrender.com/product/postProduct", newProductData)
        .then((response) => {
          toast.success("Product added successfully.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          const addedProduct = response.data;
          setProducts([...products, addedProduct]);

          // Close the add product dialog
          setIsAddProductDialogOpen(false);

          // Reset input fields
          setNewProductName("");
          setNewPrice(0);
          setNewQuantity(0);
        })
        .catch((error) => {
          toast.error(
            "Encountered a problem. Try again.",
            {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
          console.error("Error adding product:", error);
        });
    }
  };

  // Most purchased product display on table
  const [mostPurchasedProduct, setMostPurchasedProduct] =
    useState<Product | null>(null);

  useEffect(() => {
    // Fetch the product with the highest purchase count from the API
    axios
      .get("https://pos-sales-springboot-database.onrender.com/product/most-purchased", {
        params: {
          business: localStorage.getItem("salesmanBusinessName")
        }
      })
      .then((response) => {
        // Set the most purchased product in the state
        setMostPurchasedProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching most purchased product:", error);
      });
  }, []);

  // Fetch Products
  useEffect(() => {
    axios
      .get("https://pos-sales-springboot-database.onrender.com/product/getAllProduct", {
        params: {
          business: localStorage.getItem("salesmanBusinessName")
        }
      })
      .then((response) => {
        setProducts(response.data);
        console.log("response:", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const columns: GridColDef[] = [
    {
      field: "productid",
      headerName: "ID",
      flex: 1,
      headerClassName: "column-header",
    },
    {
      field: "productname",
      headerName: "Product Name",
      flex: 1,
      headerClassName: "column-header",
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      headerClassName: "column-header",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      headerClassName: "column-header",
    },
    
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "column-header",
      flex: 1,
      renderCell: (params) => <UpdateProduct {...params.row} />
    },
  ];

  const getRowId = (row: Product) => row.productid;

  // Dialog for Add product
  const openAddProductDialog = () => {
    setIsAddProductDialogOpen(true);
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
              Products
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
                  <AccountCircle sx={{ fontSize: 30 }} />
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

            <Link
              to="/itempage"
              className="side-nav"
              style={{ backgroundColor: "#AFE1AF" }}
            >
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
                    <Typography
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#3A6E70",
                        marginBottom: 20,
                        fontFamily: 'Poppins'
                      }}
                    >
                      Most Purchased Product
                    </Typography>
                    <div className="row">
                      <Card
                        style={{
                          width: 300,
                          background:
                            "linear-gradient(to right, #249990, #3D5B9B)",
                          color: "Turquoise",
                          fontWeight: 700,
                          fontSize: 16,
                          marginRight: 10,
                          marginLeft: 10,
                        }}
                      >
                        <CardContent>
                          Product Purchased <br></br>
                          <span style={{ color: "white", fontSize: 20 }}>
                            {mostPurchasedProduct?.productname}
                          </span>
                        </CardContent>
                      </Card>
                      <Card
                        style={{
                          width: 300,
                          background:
                            "linear-gradient(to right,  #3D5B9B ,#249990)",
                          color: "Turquoise",
                          fontWeight: 700,
                          fontSize: 16,
                        }}
                      >
                        <CardContent>
                          Purchased Count <br></br>
                          <span style={{ color: "white", fontSize: 20 }}>
                            {mostPurchasedProduct?.purchaseCount}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div style={{ height: 530, width: "100%", marginTop: 20 }}>
                    <DataGrid
                      sx={{ fontSize: 15 }}
                      rows={products}
                      columns={columns}
                      pageSizeOptions={[5, 10]}
                      getRowId={getRowId}
                    />
                    <p>
                      Click on the three dots on the right side of each column
                      on the table for additional options.{" "}
                    </p>

                    {/* Button for Add product */}
                    <div style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-success btn-xl"
                        style={{
                          marginRight: 5,
                          fontSize: 15,
                          fontWeight: "medium",
                        }}
                        onClick={() => openAddProductDialog()}
                        autoFocus
                      >
                        Add Product
                      </button>
                    </div>
                  </div>
                  <Dialog
                    open={isAddProductDialogOpen}
                    onClose={() => setIsAddProductDialogOpen(false)}
                  >
                    <DialogTitle
                      sx={{ fontSize: 24, color: "#3A6E70", fontWeight: "bold" }}
                    >
                      Add Product
                    </DialogTitle>
                    <DialogContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "500px",
                      }}
                    >
                      <TextField
                        label="Product Name"
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        sx={{ mb: 2, fontSize: 16 }}
                        InputProps={{ style: { fontSize: 16 } }}
                        InputLabelProps={{ style: {fontSize: 16} }}
                      />
                      <TextField
                        label="Quantity"
                        type="number"
                        value={newQuantity}
                        sx={{ mb: 2, fontSize: 16 }}
                        onChange={(e) =>
                          setNewQuantity(parseInt(e.target.value, 10))
                        }
                        InputProps={{ style: { fontSize: 16 } }}
                        InputLabelProps={{ style: {fontSize: 16} }}
                      />
                      <TextField
                        label="Price"
                        type="number"
                        value={newPrice}
                        onChange={(e) =>
                          setNewPrice(parseFloat(e.target.value))
                        }
                        sx={{ mb: 2, fontSize: 16 }}
                        InputProps={{ style: { fontSize: 16 } }}
                        InputLabelProps={{ style: {fontSize: 16} }}
                      />
                    </DialogContent>
                    <DialogActions>
                    <button 
                        className="btn btn-success btn-xl" 
                        onClick={() => setIsAddProductDialogOpen(false)}
                        style={{
                          marginRight: 5,
                          fontSize: 15,
                          fontWeight: "medium",
                          width: '30%'
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn btn-success btn-xl" 
                        onClick={handleAddProduct} 
                        style={{
                          marginRight: 5,
                          fontSize: 15,
                          fontWeight: "medium",
                          width: '30%'
                        }}
                      >
                        Add
                      </button>
                    </DialogActions>
                  </Dialog>
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
