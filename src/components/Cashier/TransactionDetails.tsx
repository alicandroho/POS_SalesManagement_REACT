import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import axios from 'axios';
import './CSS FIles/TransactionDetails.css'; 
import { Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AccountLoginValid/AuthContext';

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

const TransactionDetails = () => {
    const { isCashierLoggedIn } = useAuth();
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem('cashierToken');
  
      if (!token) {
        navigate('/logincashier');
      } else {
      }
    }, [isCashierLoggedIn, navigate]);

    const { id } = useParams();
    const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>();
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
        axios.get(`https://dilven-pos-sales-management-database-2.onrender.com/transaction/getByTransaction?transactionid=${id}`)
            .then((response) => {
                console.log(response.data);
                const responseData: TransactionDetails = response.data;
                setTransactionDetails(responseData);
            })
            .catch((error) => {
                console.error(error);
            });

        axios.get(`https://dilven-pos-sales-management-database-2.onrender.com/transaction/${id}/products`)
            .then((response) => {
                const responseData: Product[] = response.data;
                setProducts(responseData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);


    const handleLoginForRefund = () => {
        // Create a request object with the username and password
        const loginRequest = {
          username: username,
          password: password,
        };
    
        // Check if the username and password are not empty
        if (!loginRequest.username || !loginRequest.password) {
          window.alert('Please enter both your username and password');
        } else {
          // Send a POST request to the server
          axios.post('https://pos-sales-springboot-database.onrender.com/user/loginsales', loginRequest)
            .then((response) => {
              if (response.status === 200) {
                // Insert code for approval ^-^
                    const confirmed = window.confirm('Are you sure you want to refund?');
                    if (confirmed) {
                        setRefunded(true);
                        axios.put(`https://pos-sales-springboot-database.onrender.com/transaction/isRefunded?transactionid=${id}`, { refunded: true })
                          .then((response) => {
                              window.confirm(`Transaction ${id} has been refunded.`);
                              console.log('Refund successful:', response.data);
                              window.location.reload();
                          })
                          .catch((error) => {
                              console.error(error);
                              window.alert(`Failed to refund transaction ${id}.`);
                          });
                    }
              } else {
                window.alert('Please enter your username and password');
              }
            })
            .catch((error) => {
              console.error('Login failed:', error);
              window.alert('The username or password you’ve entered is incorrect. Please try again.');
            });
          }   
      };

      const handleLoginForReturn = () => {
        // Create a request object with the username and password
        const loginRequest = {
          username: username,
          password: password,
        };
    
        // Check if the username and password are not empty
        if (!loginRequest.username || !loginRequest.password) {
          window.alert('Please enter both your username and password');
        } else {
          // Send a POST request to the server
          axios.post('https://pos-sales-springboot-database.onrender.com/user/loginsales', loginRequest)
            .then((response) => {
              if (response.status === 200) {
                // Insert code for approval ^-^
                const confirmed = window.confirm('Are you sure you want to return item?');
                if (confirmed) {
                    setReturned(true);
                    axios.put(`https://pos-sales-springboot-database.onrender.com/transaction/isReturned?transactionid=${id}`, { returned: true })
                      .then((response) => {
                          window.confirm(`Transaction ${id} has been returned.`);
                          console.log('Return successful:', response.data);
                          window.location.reload();
                      })
                      .catch((error) => {
                          console.error(error);
                          window.alert(`Failed to return transaction ${id}.`);
                      });
                }
              } else {
                window.alert('Please enter your username and password');
              }
            })
            .catch((error) => {
              console.error('Login failed:', error);
              window.alert('The username or password you’ve entered is incorrect. Please try again.');
            });
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


    return (
        <div className='table-container'>
            <div className='table'>
            <h2 className='header-details'> Transaction Details</h2>
            {transactionDetails && (
                <table>
                    <tbody>
                        <tr>
                            <th>Transaction ID</th>
                            <td style={{fontWeight: 'bold', color: 'green'}}>{transactionDetails.transactionid}</td>
                        </tr>
                        <tr>
                            <th>Total Quantity</th>
                            <td>{transactionDetails.total_quantity}</td>
                        </tr>
                        <tr>
                            <th>Total Price</th>
                            <td>{transactionDetails.total_price.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th>Tendered Bill</th>
                            <td>{transactionDetails.tendered_bill.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th>Balance</th>
                            <td>{transactionDetails.balance.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th>Customer Name</th>
                            <td>{transactionDetails.customer_name}</td>
                        </tr>
                        <tr>
                            <th>Customer Number</th>
                            <td>{transactionDetails.customer_num}</td>
                        </tr>
                        <tr>
                            <th>Customer Email</th>
                            <td>{transactionDetails.customer_email}</td>
                        </tr>
                        <tr>
                            <th>Date & Time</th>
                            <td>{transactionDetails.date_time}</td>
                        </tr>
                        <tr>
                            <th>Refunded</th>
                            <td>{transactionDetails.refunded ? 'Yes' : 'No'}</td>
                        </tr>
                        <tr>
                            <th>Returned</th>
                            <td>{transactionDetails.returned ? 'Yes' : 'No'}</td>
                        </tr>
                    </tbody>
                </table>
            )}
            </div>
            <div className='table'>
            <h2 className='header-details'>Products Purchased</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.productid}>
                            <td style={{fontWeight: 'bold', color: 'red'}}>{product.productid}</td>
                            <td>{product.productname}</td>
                            <td>{product.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="buttons-container">
            <button className="refund-button" onClick={handleClickOpenRefund}>Refund</button>
            <button className="return-button" onClick={handleClickOpenReturn}>Return</button>
            </div>

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
        </div>
        </div>
    );
};

export default TransactionDetails;
