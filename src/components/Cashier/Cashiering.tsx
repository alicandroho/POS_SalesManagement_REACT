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
import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { AddShoppingCart, ManageAccounts, Menu } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

//CASHIER IMPORTS
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  tableCellClasses,
  ListItem,
} from "@mui/material";
import { RestProduct } from "../REST/REST Product/RestProduct";
import "bootstrap/dist/css/bootstrap.min.css";
import { useReactToPrint } from "react-to-print";
import { ComponentToPrint } from "./ComponentToPrint";
import "./CSS FIles/Cashiering.css";
import "react-toastify/dist/ReactToastify.css";

const initialSelectedProducts: any[] | (() => any[]) = [];
const post_transaction =
  "https://pos-sales-springboot-database.onrender.com/transaction/postTransaction";

//CASHIERING ADDED

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

export default function Cashiering() {
  const [open, setOpen] = React.useState(true);
  const { isCashierLoggedIn, setIsCashierLoggedIn, cashierUser } = useAuth();
  const navigate = useNavigate();

  // Token
  useEffect(() => {
    const token = localStorage.getItem("cashierLoggedIn");
    if (!token) {
      navigate("/logincash");
    } else {
      setIsCashierLoggedIn(true);
      axios
        .get(
          "https://pos-sales-springboot-database.onrender.com/transaction/getAllTransaction", {
            params: {
              business: localStorage.getItem("cashierBusinessName")
            }
          }
        )
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

  //CASHIERING ADDED
  useEffect(() => {
    const token = localStorage.getItem("cashierToken");
    if (!token) {
      navigate("/logincash");
    } else {
    }
  }, [isCashierLoggedIn, navigate]);

  const [deleteByID, getProductByID, editProduct, addProduct, product] =
    RestProduct();
  const [products, setProduct] = useState([product]);
  const [cart, setCart] = useState([product]);
  const [selectedProducts, setSelectedProducts] = useState(
    initialSelectedProducts
  );
  //const [initialProductQuantities, setInitialProductQuantities] = useState({});
  const [initialProductQuantities, setInitialProductQuantities] =
    React.useState<{ [key: string]: number }>({});

  //TRANSACTION VARIABLES
  const [total_quantity, setTotal_quantity] = useState(0);
  const [tendered_bill, setTendered_bill] = useState("");
  const [balance, setBalance] = useState(0);
  const [total_price, setTotal_Price] = useState(0);
  const [customer_name, setCustomer_name] = useState("");
  const [customer_num, setCustomer_num] = useState("");
  const [customer_email, setCustomer_email] = useState("");
  const [date_time, setDate_time] = useState("");
  const [cashier, setCashier] = useState("");
  const [ business, setBusiness ] = useState("");

  //Fetch Product Table from Database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://pos-sales-springboot-database.onrender.com/product/getAllProduct", {
          params: {
            business: localStorage.getItem("cashierBusinessName")
          }
        });
        const data = response.data;
        setProduct(data);

        // Initialize the cart state
        setCart([]);

        // Initialize the selected products state
        setSelectedProducts([]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const decreaseProductQuantityInDatabase = async (
    productid: any,
    quantityToDecrease: any
  ) => {
    if (quantityToDecrease === undefined) {
      console.error("Quantity to decrease is undefined.");
      return;
    }

    try {
      // Make an HTTP request to update the product quantity in the database
      await axios.put(
        `https://pos-sales-springboot-database.onrender.com/product/decreaseQuantity/${productid}?quantityToDecrease=${quantityToDecrease}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const incrementPurchaseCount = async (
    productid: any,
    quantityPurchased: any
  ) => {
    try {
      // Make an HTTP request to increment the purchase count in the database for the specified product
      await axios.put(
        `https://pos-sales-springboot-database.onrender.com/product/incrementPurchaseCount/${productid}?quantityPurchased=${quantityPurchased}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Record Transaction
  const [openTransact, setOpenTransact] = useState(false);
  const handleClickOpenTransact = () => {
    setOpenTransact(true);
  };
  const handleClickCloseTransact = () => {
    setOpenTransact(false);
  };

  const record_transaction = async () => {
    if (!tendered_bill) {
      toast.error(
        "Tendered bill cannot be empty. Please enter a valid amount.",
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
      return;
    }

    if (parseFloat(tendered_bill) < total_price) {
      toast.error(
        "Insufficient amount. Please enter an amount equal to or greater than the total price.",
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
      return;
    }

    for (const productid of selectedProducts) {
      const productInCart = cart.find((item) => item.productid === productid);
      if (productInCart) {
        const quantityPurchased = productInCart.quantity;

        // Decrease the product quantity in the database by the exact quantity purchased
        await decreaseProductQuantityInDatabase(productid, quantityPurchased);

        // Increment the purchase count for the product
        await incrementPurchaseCount(productid, quantityPurchased);
      }
    }

    // Axios post to create record transaction
    axios
      .post(post_transaction, {
        total_quantity: total_quantity,
        total_price: total_price,
        tendered_bill: tendered_bill,
        balance: balance,
        customer_name: customer_name,
        customer_num: customer_num,
        customer_email: customer_email,
        date_time: date_time,
        cashier: localStorage.getItem("cashierFirstName"),
        product: selectedProducts.map((productid) => ({
          productid: productid,
        })),
        business: localStorage.getItem("cashierBusinessName")
      })
      .then((res) => {
        console.log(res.data);
        toast.success("Transaction Complete", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        handlePrint();
      })
      .catch((err) => console.log(err));
  };

  // Styling the Product Table
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#3a6e70",
      fontSize: 15,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 15,
    },
  }));

  // Fetch product quantities from the database during the initial product fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://pos-sales-springboot-database.onrender.com/product/getAllProduct", {
          params: {
            business: localStorage.getItem("cashierBusinessName")
          }
        });
        const data = response.data;
        setProduct(data);

        // Store the initial product quantities
        const initialQuantities: { [key: string]: number } = {};
        data.forEach((product: any) => {
          initialQuantities[product.productid] = product.quantity;
        });
        setInitialProductQuantities(initialQuantities);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Function to add a selected product ID to the state
  const addProductToSelection = (productid: any) => {
    if (!selectedProducts.includes(productid)) {
      setSelectedProducts([...selectedProducts, productid]);
      // Check if the quantity of the selected product is not zero
      if (initialProductQuantities[productid] === 0) {
        toast.error("Cannot add to the cart. Please quantity restock.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        // Remove the product from selectedProducts
        setSelectedProducts(selectedProducts.filter((id) => id !== productid));
      }
    }
  };

  // Add to cart table
  const addProductToCart = async (product: any) => {
    const productExist = cart.find(
      (item) => item?.productid === product?.productid
    );

    if (productExist) {
      const updatedProduct = {
        ...productExist,
        quantity: productExist.quantity + 1,
        subtotal: (productExist.quantity + 1) * productExist.price,
      };
      // Check if the product quantity is not zero before updating the cart
      if (initialProductQuantities[productExist.productid] > 0) {
        setCart(
          cart.map((item) =>
            item?.productid === product?.productid ? updatedProduct : item
          )
        );
      }
    } else {
      const newProduct = {
        ...product,
        quantity: 1,
        subtotal: product.price,
      };
      // Check if the product quantity is not zero before adding it to the cart
      if (initialProductQuantities[newProduct.productid] > 0) {
        setCart([...cart, newProduct]);
      }
    }
  };

  // Removes the item from the cart
  const removeProduct = async (product: any) => {
    const newCart = cart.filter(
      (cart) => cart?.productid !== product.productid
    );
    setCart(newCart);
    setSelectedProducts(
      selectedProducts.filter((id) => id !== product.productid)
    );
  };

  const decreaseQuantity = async (product: any) => {
    const productExist = cart.find(
      (item) => item?.productid === product?.productid
    );
    if (productExist) {
      // If the product quantity is greater than 1, decrease it by 1
      if (productExist.quantity > 1) {
        setCart(
          cart.map((item) =>
            item?.productid === product?.productid
              ? {
                  ...productExist,
                  quantity: productExist.quantity - 1,
                  total_amount:
                    productExist.price * (productExist.quantity - 1),
                }
              : item
          )
        );
      } else {
        // If the product quantity is 1, remove the product from the cart
        setCart(cart.filter((item) => item?.productid !== product?.productid));
      }
    }
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    for (const item of cart) {
      const quantity = parseFloat(item?.quantity);
      const price = parseFloat(item?.price);
      if (!isNaN(quantity) && !isNaN(price)) {
        totalPrice += quantity * price;
      }
    }
    return totalPrice;
  };
  useEffect(() => {
    const total_price = calculateTotalPrice();
    setTotal_Price(total_price);
  }, [cart]);

  const calculateChange = () => {
    const totalPrice = total_price;
    const tenderedBill = parseFloat(tendered_bill);
    // Check if both values are valid numbers
    if (!isNaN(totalPrice) && !isNaN(tenderedBill)) {
      return tenderedBill - totalPrice;
    }
    // Return 0 if any of the values is not a valid number
    return 0;
  };
  useEffect(() => {
    const balance = calculateChange();
    setBalance(balance);
  });

  const calculateTotalQuantity = () => {
    let total_quantity = 0;
    for (const item of cart) {
      if (item?.quantity) {
        total_quantity += item.quantity;
      }
    }
    return total_quantity;
  };
  useEffect(() => {
    const total_quantity = calculateTotalQuantity();
    setTotal_quantity(total_quantity);
  });

  // Function to get the current date and time in the current time zone
  const getCurrentDateTime = () => {
    const now = new Date();
    // Format the date and time as desired
    const formattedDateTime = now.toLocaleString(); // You can customize the format using options
    return formattedDateTime;
  };

  // Update the date_time value with the current date and time at regular intervals
  useEffect(() => {
    const updateDateTime = () => {
      const currentDateTime = getCurrentDateTime();
      setDate_time(currentDateTime);
    };

    // Update the date_time initially
    updateDateTime();
    // Set up an interval to update the date_time every second (or as desired)
    const intervalId = setInterval(updateDateTime, 1000); // Update every 1 second

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const componentRef = React.useRef<any>();

  const handleReactToPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    handleReactToPrint();
  };

  //SEARCH BAR FILTERING
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProducts = products.filter((product) =>
    product?.productname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //UNTIL HERE

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
              Perform Transaction
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
            {localStorage.getItem("cashierBusinessName")}
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

            <Link
              to="/cashiering"
              style={{ backgroundColor: "#AFE1AF" }}
              className="side-nav"
            >
              <IconButton color="inherit">
                <AddShoppingCart sx={{ fontSize: 15 }} />
              </IconButton>
              <Button>Perform Transaction</Button>
            </Link>

            <Link to="/transactionhistory" className="side-nav">
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
                  Cancels
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
                  <div>
                    <div className="row">
                      {/*Search Bar */}
                      <TextField
                        type="text"
                        placeholder="Search products"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: "56.5%",
                          height: "40px",
                          margin: "10px 0",
                          marginBottom: "40px",
                          marginLeft: 15,
                          padding: "5px",
                          fontSize: "16px",
                        }}
                        inputProps={{ style: { fontSize: 16 } }}
                        InputLabelProps={{
                          style: { fontSize: 16 },
                        }}
                      />

                      {/* Display Cashier */}
                      <TextField
                        label="Cashier"
                        value={localStorage.getItem("cashierFirstName")}
                        onChange={(e) => setCashier(e.target.value)}
                        style={{
                          width: "40%",
                          height: "40px",
                          margin: "10px 0",
                          marginLeft: 20,
                          padding: "5px",
                          fontSize: "16px",
                          display: "flex",
                        }}
                        inputProps={{ style: { fontSize: 16, color: "green" } }}
                        InputLabelProps={{
                          style: { fontSize: 16, color: "green" },
                        }}
                      />
                    </div>

                    {/* DISPLAYS PRODUCT TABLE */}
                    <div className="container-product">
                      <div className="col-lg-7">
                        {filteredProducts.length > 0 ? (
                          <TableContainer sx={{ maxHeight: 600 }}>
                            <Table
                              sx={{ maxWidth: 1000 }}
                              aria-label="customized table"
                            >
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>Product ID</StyledTableCell>
                                  <StyledTableCell align="right">
                                    Product Name
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    Quantity
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    Price
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    {" "}
                                    Actions{" "}
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {filteredProducts.map((product) => (
                                  <TableRow key={product?.productid}>
                                    <StyledTableCell component="th" scope="row">
                                      {product?.productid}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                      {product?.productname}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                      {product?.quantity}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                      ₱{product?.price.toFixed(2)}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                      <label className="btn btn-success btn-lg">
                                        Add to cart
                                        <input
                                          type="checkbox"
                                          id="checkbox"
                                          onChange={() =>
                                            addProductToSelection(
                                              product?.productid
                                            )
                                          }
                                          onClick={() => {
                                            if (product) {
                                              addProductToCart(product);
                                            }
                                          }}
                                          checked={selectedProducts.includes(
                                            product?.productid
                                          )}
                                          style={{ display: "none" }}
                                        ></input>
                                      </label>
                                    </StyledTableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <div
                            className="no-products-found"
                            style={{
                              background: "white",
                              padding: "100px",
                              margin: "1px",
                              textAlign: "center",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            No products found
                          </div>
                        )}
                        <hr></hr>
                      </div>

                      {/* Display Cashiering */}
                      <div className="col-lg-5">
                        <TableContainer
                          component={Paper}
                          sx={{ maxHeight: 300 }}
                        >
                          <div style={{ display: "none" }}>
                            <ComponentToPrint
                              ref={componentRef}
                              cart={cart}
                              cashier={cashier}
                              customer_name={customer_name}
                              customer_num={customer_num}
                              customer_email={customer_email}
                              date_time={date_time}
                              total_price={total_price}
                              total_quantity={total_quantity}
                              balance={balance}
                            />
                          </div>
                          <Table
                            className="table table-responsive table-dark table-hover"
                            sx={{ minWidth: "auto" }}
                          >
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>ID</StyledTableCell>
                                <StyledTableCell align="right">
                                  Product Name
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  Quantity
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  Price
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  Total Price
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  Actions{" "}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {" "}
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {cart.map((item) => (
                                <TableRow key={item?.productid}>
                                  <StyledTableCell component="th" scope="row">
                                    {item?.productid}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    {item?.productname}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    {item?.quantity}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    ₱{item?.price.toFixed(2)}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    ₱{item?.subtotal.toFixed(2)}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    <button
                                      className="btn btn-success"
                                      onClick={() => {
                                        if (item) {
                                          decreaseQuantity(item);
                                        }
                                      }}
                                    >
                                      {" "}
                                      -{" "}
                                    </button>
                                    <button
                                      style={{ marginLeft: 2 }}
                                      className="btn btn-success"
                                      onClick={() => {
                                        if (item) {
                                          addProductToCart(item);
                                        }
                                      }}
                                    >
                                      {" "}
                                      +{" "}
                                    </button>
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    <button
                                      className="btn btn-danger btn-lg"
                                      onClick={() => {
                                        if (item) {
                                          removeProduct(item);
                                        }
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </StyledTableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    </div>
                    <div className="row content">
                      {/* Customer Details */}
                      <div className="col-lg-8">
                        <div
                          className="customer-details"
                          style={{ marginLeft: 8 }}
                        >
                          <TextField
                            fullWidth
                            value={customer_name}
                            onChange={(e) => setCustomer_name(e.target.value)}
                            id="filled-required"
                            variant="outlined"
                            label="Customer Name"
                            size="small"
                            inputProps={{
                              style: {
                                fontSize: 20,
                                backgroundColor: "#f7f5f5",
                              },
                            }}
                            InputLabelProps={{
                              style: { fontSize: 16 },
                            }}
                            style={{ marginBottom: 10, marginTop: 20 }}
                          />

                          <TextField
                            fullWidth
                            value={customer_num}
                            onChange={(e) => setCustomer_num(e.target.value)}
                            id="filled-required"
                            size="small"
                            variant="outlined"
                            label="Customer Number"
                            inputProps={{
                              style: {
                                fontSize: 20,
                                backgroundColor: "#f7f5f5",
                              },
                            }}
                            InputLabelProps={{
                              style: { fontSize: 16 },
                            }}
                            style={{ marginBottom: 10 }}
                          />
                          <TextField
                            value={customer_email}
                            onChange={(e) => setCustomer_email(e.target.value)}
                            id="filled-required"
                            fullWidth
                            size="small"
                            label="Customer Email"
                            variant="outlined"
                            inputProps={{
                              style: {
                                fontSize: 20,
                                backgroundColor: "#f7f5f5",
                              },
                            }}
                            InputLabelProps={{
                              style: { fontSize: 16 },
                            }}
                            style={{ marginBottom: 10 }}
                          />
                          <TextField
                            required
                            id="filled-required"
                            fullWidth
                            value={date_time}
                            size="small"
                            variant="outlined"
                            inputProps={{
                              style: {
                                fontSize: 20,
                                backgroundColor: "#f7f5f5",
                              },
                            }}
                            style={{ marginBottom: 20 }}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div style={{ marginRight: 8 }}>
                          <TextField
                            value={total_price.toFixed(2)}
                            required
                            size="small"
                            id="filled-required"
                            fullWidth
                            variant="outlined"
                            label="Total Amount"
                            inputProps={{
                              style: {
                                fontSize: 20,
                                backgroundColor: "#f7f5f5",
                                color: "red",
                              },
                            }}
                            InputLabelProps={{
                              style: { fontSize: 16 },
                            }}
                            style={{ marginBottom: 10, marginTop: 20 }}
                          />

                          <TextField
                            value={total_quantity}
                            required
                            id="filled-required"
                            fullWidth
                            size="small"
                            variant="outlined"
                            inputProps={{
                              style: {
                                fontSize: 20,
                                backgroundColor: "#f7f5f5",
                              },
                            }}
                            InputLabelProps={{
                              style: { fontSize: 16 },
                            }}
                            label="Total Quantity"
                            style={{ marginBottom: 10 }}
                          />

                          <TextField
                            value={tendered_bill}
                            onChange={(e) => setTendered_bill(e.target.value)}
                            required
                            type="number"
                            id="filled-required"
                            label="Tender"
                            fullWidth
                            size="small"
                            variant="outlined"
                            inputProps={{
                              style: {
                                fontSize: 20,
                                backgroundColor: "#f7f5f5",
                                color: "red",
                              },
                            }}
                            InputLabelProps={{
                              style: { fontSize: 16 },
                            }}
                            style={{ marginBottom: 10 }}
                          />
                          <TextField
                            value={balance.toFixed(2)}
                            required
                            id="filled-required"
                            label="Change"
                            fullWidth
                            size="small"
                            variant="outlined"
                            inputProps={{
                              style: {
                                fontSize: 20,
                                backgroundColor: "#f7f5f5",
                                color: "green",
                              },
                            }}
                            InputLabelProps={{
                              style: { fontSize: 16 },
                            }}
                          />
                        </div>
                      </div>
                      {/* If the Total Amount is equal to zero, show a message */}
                      {total_price !== 0 ? (
                        <button
                          className="btn btn-success btn-lg"
                          style={{ fontSize: 24 }}
                          onClick={handleClickOpenTransact}
                        >
                          Pay Now
                        </button>
                      ) : (
                        <h1>Please add a product to the cart</h1>
                      )}

                      <Dialog
                        open={openTransact}
                        onClose={handleClickCloseTransact}
                      >
                        <DialogTitle
                          sx={{
                            fontSize: "1.6rem",
                            color: "red",
                            fontWeight: "bold",
                          }}
                        >
                          Perform Transaction
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText sx={{ fontSize: "1.6rem" }}>
                            Are you sure you want to perform transaction?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            sx={{ fontSize: "15px", fontWeight: "bold" }}
                            onClick={handleClickCloseTransact}
                          >
                            Cancel
                          </Button>
                          <Button
                            sx={{ fontSize: "15px", fontWeight: "bold" }}
                            onClick={record_transaction}
                          >
                            Confirm
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                    <div className="footer"></div>
                    <ToastContainer style={{ width: "500px", fontSize: 15 }} />
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

function handlePrint() {
  throw new Error("Function not implemented.");
}
