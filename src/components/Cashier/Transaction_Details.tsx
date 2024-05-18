import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useAuth } from '../AccountLoginValid/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, IconButton,  TextField, setRef } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import './CSS FIles/TransactionDetails.css';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const drawerWidth: number = 300;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface Product {
    productid: number;
    productname: string;
    quantity: number;
    price: number;
}

interface TransactionDetails {
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
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

const Transaction_Details = () => {
    const { isCashierLoggedIn } = useAuth();
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem('cashierToken');
  
      if (!token) {
        navigate('/logincash');
      } else {
      }
    }, [isCashierLoggedIn, navigate]);

    const { id } = useParams();
    const [transactionDetails, setTransactionDetails] = useState<TransactionDetails[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [refunded, setRefunded] = useState(false);
    const [returned, setReturned] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [openRefund, setOpenRefund] = React.useState(false);
    const [openReturn, setOpenReturn] = React.useState(false);
    const [initialUsername] = useState('');
    const [initialPassword] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('cashierToken');
    
        if (!token) {
          navigate('/logincash');
        } else {
        }
      }, [isCashierLoggedIn, navigate]);

    const handleLoginForRefund = () => {
        const loginRequest = {
        username: username,
        password: password,
    };
    
    // Check if the username and password are not empty
      if (!loginRequest.username || !loginRequest.password) {
        toast.warning('Please enter both your username and password.', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        // Send a POST request to the server
        axios.post('https://pos-sales-springboot-database.onrender.com/user/loginsales', loginRequest)
        .then((response) => {
        if(response.status === 200) {
        setRefunded(true);
        axios.put(`https://pos-sales-springboot-database.onrender.com/transaction/isRefunded?transactionid=${id}`, { refunded: true })
        .then((response) => {
          toast.success(`Transaction ${id} has been refunded successfully.`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        })
        } 
        else {
          toast.error('Please enter your username and password.', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        }).catch((error) => {
            console.error('Login failed', error);
            toast.error('The username or password you’ve entered is incorrect. Please try again.', {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          })
        }
      };
    
    const handleLoginForReturn = () => {
      const loginRequest = {
        username: username,
        password: password,
    };
    
    // Check if the username and password are not empty
      if (!loginRequest.username || !loginRequest.password) {
        toast.warning('Please enter both your username and password.', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        // Send a POST request to the server
        axios.post('https://pos-sales-springboot-database.onrender.com/user/loginsales', loginRequest)
        .then((response) => {
        if(response.status === 200) {
        setRefunded(true);
        axios.put(`https://pos-sales-springboot-database.onrender.com/transaction/isReturned?transactionid=${id}`, { returned: true })
        .then((response) => {
          toast.success(`Transaction ${id} has been returned successfully.`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        })
        } 
        else {
          toast.error('Please enter your username and password.', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        }).catch((error) => {
            console.error('Login failed', error);
            toast.error('The username or password you’ve entered is incorrect. Please try again.', {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          })
        }
      };

    const handleClickOpenRefund = () => {
        setOpenRefund(true);
        console.log(transactionDetails);
    }

    const handleClickCloseRefund = () => {
        setOpenRefund(false);
        console.log(transactionDetails);
        setUsername(initialUsername); // Reset the username
        setPassword(initialPassword); // Reset the password
    }

    const handleClickOpenReturn= () => {
        setOpenReturn(true);
        console.log(transactionDetails);
    }

    const handleClickCloseReturn = () => {
        setOpenReturn(false);
        console.log(transactionDetails);
        setUsername(initialUsername); // Reset the username
        setPassword(initialPassword); // Reset the password
    }

    // handle open for view
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClickClose = () => {
        setOpen(false);
    }

    // View function
    useEffect(() => {
        if (id) {
            axios.get(`https://pos-sales-springboot-database.onrender.com/transaction/getByTransaction?transactionid=${id}`)
                .then((response) => {
                    console.log(response.data);
                    const responseData: TransactionDetails = response.data;
                    setTransactionDetails([responseData]);
                })
                .catch((error) => {
                    console.error(error);
                });
    
            axios.get(`https://pos-sales-springboot-database.onrender.com/transaction/${id}/products`)
                .then((response) => {
                    console.log('Products response:', response.data);
                    const responseData: Product[] = response.data;
                    setProducts(responseData);
                })
                .catch((error) => {
                    console.error('Error fetching products:', error);
                });
        }
    }, [id]);
    

    // Product Table for Grid
    const columns: GridColDef[] = [
        { field: 'productid', headerName: 'Product ID', flex: 1, headerClassName: 'green-column-header' },
        { field: 'productname', headerName: 'Product Name',  flex: 1, headerClassName: 'green-column-header'},
        { field: 'price', headerName: 'Price',  flex: 1, headerClassName: 'green-column-header' },
    ];
    
    const getRowId = (row: Product) => row.productid;

    // Transaction Table for Grid
    const columns_transaction: GridColDef[] = [
      { field: 'transactionid', headerName: 'Transaction ID', flex: 1, headerClassName: 'green-column-header' },
      { field: 'date_time', headerName: 'Date/Time', flex: 1.5, headerClassName: 'green-column-header'},
      { field: 'total_quantity', headerName: 'Total Quantity', flex: 1, headerClassName: 'green-column-header' },
      { field: 'total_price', headerName: 'Total Price', flex: 1, headerClassName: 'green-column-header' },
      { field: 'customer_name', headerName: 'Customer Name', flex: 1, headerClassName: 'green-column-header' },
      { field: 'customer_email', headerName: 'Customer Name', flex: 1, headerClassName: 'green-column-header' },
      { field: 'customer_num', headerName: 'Customer Name', flex: 1, headerClassName: 'green-column-header'},
      { field: 'refunded', headerName: 'Refunded', flex: 1, headerClassName: 'green-column-header'},
      { field: 'returned', headerName: 'Returned', flex: 1, headerClassName: 'green-column-header'},
    ];
    
    const getRowId_Transaction = (row: TransactionDetails) => row.transactionid;

    const themeDilven = createTheme({
        palette: {
          primary: {
            main: '#1D7D81',
          },
        },
      });

    // Logout Function
    const [openLogout, setOpenLogout] = React.useState(false);
    const handleClickOpenLogout = () => { setOpenLogout(true); }
    const handleClickCloseLogout = () => { setOpenLogout(false); }
  
    const handleLogout = () => {
        localStorage.removeItem('cashierToken');
        localStorage.removeItem('cashierLoggedIn')
        localStorage.removeItem('cashierUsername');
        localStorage.removeItem('cashierBusinessName');
        navigate('/logincash');
    }

    return (
           <ThemeProvider theme={themeDilven}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                <Toolbar
                    sx={{
                    pr: '24px',
                    }}
                >
                    <Typography
                      component="h1"
                      variant="h4"
                      color="inherit"
                      noWrap
                      sx={{ flexGrow: 1 }}
                    >
                      Transaction Details
                    </Typography>

                    <Typography
                    component="h1"
                    variant="h4"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}>
                    <span className='nav-user' style={{ float: 'right', marginRight: 10}}>
                        <IconButton color="inherit">
                        <AccountCircleIcon sx={{fontSize: 30}}/>
                        </IconButton>
                        {localStorage.getItem('cashierUsername')}
                    </span>
                    </Typography>
                </Toolbar>
                </AppBar>
                
                <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
                >
                <Toolbar />
                <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', fontSize: 15, fontFamily: 'sans-serif'}} style={{height: '85vh'}}>  
                            {/* Displays Transaction Details */}
                            <div style={{ height: 500, width: '100%', marginBottom: '50px' }}>
                              <Typography 
                                component="h1"
                                variant="h4"
                                color="inherit"
                                noWrap
                                sx={{ flexGrow: 1, fontWeight: 'bold'}}>
                                  Transaction Details
                              </Typography>
                              <DataGrid
                                  sx={{ fontSize: 15,   
                                    backgroundColor: (theme) =>
                                    theme.palette.mode === 'light'
                                      ? theme.palette.grey[100]
                                      : theme.palette.grey[900],}}
                                  rows={transactionDetails}
                                  columns={columns_transaction}
                                  pageSizeOptions={[5, 10]}
                                  getRowId={getRowId_Transaction}
                              />
                            </div>

                            {/* Displays Products Purchased */}
                            <div style={{ height: 500, width: '100%', marginBottom: 50 }}>
                             <Typography 
                                component="h1"
                                variant="h4"
                                color="inherit"
                                noWrap
                                sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                                  Products Purchased
                              </Typography>
                              <DataGrid
                                  sx={{ fontSize: 15,   
                                    backgroundColor: (theme) =>
                                    theme.palette.mode === 'light'
                                      ? theme.palette.grey[100]
                                      : theme.palette.grey[900],}}
                                  rows={products}
                                  columns={columns}
                                  pageSizeOptions={[5, 10]}
                                  getRowId={getRowId}
                              />
                            </div>

                            {/* Button for Refund and Return */}
                            <div style={{textAlign: 'right'}}>
                              <button className="btn btn-success btn-xl"
                                  style={{
                                      marginRight: 5,
                                      fontSize: 15,
                                      fontWeight: 'medium'
                                  }} autoFocus onClick={handleClickOpenRefund}> Refund
                              </button>
                              <button className="btn btn-success btn-xl"
                                  style={{
                                      marginRight: 5,
                                      fontSize: 15,
                                      fontWeight: 'medium'
                                  }} autoFocus onClick={handleClickOpenReturn}> Return
                              </button>
                            </div>
                        </Paper>
                    </Grid>
                    </Grid>
                </Container>
                </Box>
            </Box>
            {/* DIALOG FOR REFUND */}
            <Dialog open={openRefund} onClose={handleClickCloseRefund}>
              <DialogContent>
                  <Card sx={{maxWidth: 900, borderRadius: 5, backgroundColor: '#f7f5f5', maxHeight: 1000, color: '#213458'}}>
                      <CardContent>
                          <Typography gutterBottom variant='h2' component="div" sx={{fontFamily: "Poppins", fontWeight: 'bold'}} align='center'>
                              Want to Refund Transaction?
                          </Typography>
                          <Card sx={{maxWidth: 500, borderRadius: 5, backgroundColor: '#d3d3db', marginTop: 5, color: '#213458'}}>
                              <Typography gutterBottom variant='h5' component="div" sx={{fontFamily: "Poppins", backgroundColor: '#d3d3db', borderRadius: 2, padding: 1, fontStyle: 'italic', fontWeight: 'medium'}} align='center'>
                                  Request for Manager To Approve Refund Request
                              </Typography>
                          </Card>
                      </CardContent>
                          <CardActions sx={{marginTop: 3}}>
                                  <TextField
                                      type="text"
                                      label="Username"
                                      variant="outlined"
                                      fullWidth
                                      value={username}
                                      onChange={(e) => setUsername(e.target.value)}
                                      inputProps={{style: {fontSize: 24, fontFamily: 'Poppins', color: '#213458'}}}
                                      InputLabelProps={{ style: { fontSize: 24, fontFamily: 'Poppins' } }}
                                  />
                          </CardActions>
                          <CardActions sx={{marginBottom: 5}}>
                                  <TextField
                                      type='password'
                                      fullWidth
                                      label="Password"
                                      value={password}
                                      variant='outlined'
                                      onChange={(e) => setPassword(e.target.value)}
                                      inputProps={{style: {fontSize: 24, fontFamily: 'Poppins', color: '#213458'}}}
                                      InputLabelProps={{ style: { fontSize: 24, fontFamily: 'Poppins' } }}
                                  />
                          </CardActions>
                  </Card>
              </DialogContent>
              <DialogActions>
                  <button className="btn-cancel" onClick={handleClickCloseRefund}>Cancel</button>
                  <button className="btn-approve" onClick={handleLoginForRefund}>Approve</button>
              </DialogActions>
            </Dialog>
            

            {/* DIALOG FOR RETURN */}
            <Dialog open={openReturn} onClose={handleClickCloseReturn}>
              <DialogContent>
                  <Card sx={{maxWidth: 900, borderRadius: 5, backgroundColor: '#f7f5f5', maxHeight: 1000, color: '#213458'}}>
                      <CardContent>
                          <Typography gutterBottom variant='h2' component="div" sx={{fontFamily: "Poppins", fontWeight: 'bold'}} align='center'>
                              Want to Return Transaction?
                          </Typography>
                          <Card sx={{maxWidth: 500, borderRadius: 5, backgroundColor: '#d3d3db', marginTop: 5, color: '#213458'}}>
                              <Typography gutterBottom variant='h5' component="div" sx={{fontFamily: "Poppins", backgroundColor: '#d3d3db', borderRadius: 2, padding: 1, fontStyle: 'italic', fontWeight: 'medium'}} align='center'>
                                  Request for Manager To Approve Refund Request
                              </Typography>
                          </Card>
                      </CardContent>
                          <CardActions sx={{marginTop: 3}}>
                                  <TextField
                                      type="text"
                                      label="Username"
                                      variant="outlined"
                                      fullWidth
                                      value={username}
                                      onChange={(e) => setUsername(e.target.value)}
                                      inputProps={{style: {fontSize: 24, fontFamily: 'Poppins', color: '#213458'}}}
                                  InputLabelProps={{ style: { fontSize: 24, fontFamily: 'Poppins' } }}
                                  />
                          </CardActions>
                          <CardActions sx={{marginBottom: 5}}>
                                  <TextField
                                      type='password'
                                      fullWidth
                                      label="Password"
                                      value={password}
                                      variant='outlined'
                                      onChange={(e) => setPassword(e.target.value)}
                                      inputProps={{style: {fontSize: 24, fontFamily: 'Poppins', color: '#213458'}}}
                                      InputLabelProps={{ style: { fontSize: 24, fontFamily: 'Poppins' } }}
                                  />
                          </CardActions>
                  </Card>
              </DialogContent>
              <DialogActions>
                  <button className="btn-cancel" onClick={handleClickCloseReturn}>Cancel</button>
                  
                  <button className="btn-approve" onClick={handleLoginForReturn}>Approve</button>
              </DialogActions>
            </Dialog>
            <ToastContainer className="foo" style={{ width: "600px", fontSize: 15 }} />
            </ThemeProvider>
    );
};

export default Transaction_Details;
