import * as React from 'react';
import { styled, createTheme, ThemeProvider, createMuiTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useAuth } from '../AccountLoginValid/AuthContext';
import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, MenuItem, TextField } from '@mui/material';
import './CSS Files/CreateAccountAdmin.css';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import { ManageAccounts, Menu, Visibility, VisibilityOff } from '@mui/icons-material';
import ShieldIcon from '@mui/icons-material/Shield';
import { ToastContainer, toast } from 'react-toastify';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import UpdateAccount from './UpdateAccount';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth: number = 300;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface Account {
  userid: number,
  username: string,
  account_type: string,
  password: string,
  email: string,
  fname: string,
  lname: string,
  business_name: string,
  address: string,
  contactnum: string,
  gender: string,
  bday: string
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

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export default function ViewAccounts() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { isAdminLoggedIn, setIsAdminLoggedIn, adminUser } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  // Token
  useEffect(() => {
    const token = localStorage.getItem('adminLoggedIn');
    if (!token) {
      navigate('/loginadmin');
    } else {
      setIsAdminLoggedIn(true);
    axios.get('https://pos-sales-springboot-database.onrender.com/user/getAllUser')
      .then((response) => {
        // Filter users based on business_name
        const filteredUsers = response.data.filter((username: Account) =>
          username.business_name === localStorage.getItem('adminBusinessName')
        );
        setAccounts(filteredUsers);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  }, [isAdminLoggedIn, navigate, adminUser]);

  const themeDilven = createTheme({
    palette: {
      primary: {
        main: '#1D7D81',
      },
    },
  });

  const handleSearch = (searchValue: string) => {
    setSearchInput(searchValue);
    const filtered = accounts.filter((account) =>
      String(account.username).includes(searchValue)
    );
    setFilteredAccounts(filtered);
  };

    // Fetch Account data
    useEffect(() => {
        axios.get('https://pos-sales-springboot-database.onrender.com/user/getAllUser')
            .then((response) => {
                setAccounts(response.data);
                console.log("response:", response.data)
              })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const columns: GridColDef[] = [
      { field: 'userid', headerName: 'ID', width: 70, headerClassName: 'column-header' },
      { field: 'username', headerName: 'Username', width: 130, headerClassName: 'column-header' },
      { field: 'account_type', headerName: 'Account Type', width: 130, headerClassName: 'column-header' },
      { field: 'business_name', headerName: 'Business Name', width: 150, headerClassName: 'column-header' },
      { field: 'fname', headerName: 'First Name', width: 130, headerClassName: 'column-header' },
      { field: 'lname', headerName: 'Last Name', width: 130, headerClassName: 'column-header' },
      { field: 'gender', headerName: 'Gender', width: 130, headerClassName: 'column-header' },
      { field: 'address', headerName: 'Address', width: 150, headerClassName: 'column-header' },
      { field: 'contactnum', headerName: 'Phone', width: 130, headerClassName: 'column-header' },
      { field: 'email', headerName: 'Email', width: 130, headerClassName: 'column-header' },
      { field: 'actions', headerName: 'Actions', flex: 1, headerClassName: 'column-header', renderCell: (params) => <UpdateAccount {...params.row} /> }
    ];
    
    // Logout Function
    const [openLogout, setOpenLogout] = React.useState(false);
    const handleClickOpenLogout = () => { setOpenLogout(true); }
    const handleClickCloseLogout = () => { setOpenLogout(false); }

    const handleLogout = () => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminLoggedIn')
      localStorage.removeItem('adminUsername');
      localStorage.removeItem('adminBusinessName');
      navigate('/loginadmin');
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
              Account Details 
              
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
                  {localStorage.getItem('adminUsername')}
              </span>
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              justifyContent: 'center',
              color: '#4BB543',
              px: [1],
            }}
          >
            {localStorage.getItem('adminBusinessName')} {/* Display Business Name */}
          </Toolbar>
          <Divider />
          <List component="nav">
            <Link to="/#" className='side-nav'>
              <IconButton color="inherit">
                <HomeIcon sx={{fontSize: 20}}/>
              </IconButton>
              <Button>Home</Button>
            </Link>

            <Link to="/adminmainpage" className='side-nav'>
              <IconButton color="inherit">
                <Menu sx={{fontSize: 20}}/>
              </IconButton>
              <Button>Admin Main</Button>
            </Link>

            <Link to="/createaccountadmin" className='side-nav'>
              <IconButton color="inherit">
                <PersonAddIcon sx={{fontSize: 20}}/>
              </IconButton>
              <Button>Create an Account</Button>
            </Link>

            <Link to="/viewaccounts" style={{backgroundColor: '#AFE1AF'}} className='side-nav'>
              <IconButton color="inherit">
                <ManageAccounts sx={{fontSize: 20}}/>
              </IconButton>
              <Button>View Accounts</Button>
            </Link>

            <Link onClick={handleClickOpenLogout} to="" className='side-nav'>
              <IconButton color="inherit">
                <LogoutIcon sx={{fontSize: 20}}/>
              </IconButton>
              <Button>Logout</Button>
            </Link>

            <Dialog open = {openLogout} onClose={handleClickCloseLogout}>
              <DialogTitle sx={{fontSize: '1.6rem', color: 'red', fontWeight: 'bold'}}>
                Warning!
              </DialogTitle>
              <DialogContent>
                <DialogContentText sx={{fontSize: '1.6rem'}}>
                  Are you sure you want to logout?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button sx={{fontSize: '15px', fontWeight: 'bold'}} onClick={handleClickCloseLogout}>Cancel</Button>
                <Button  sx={{fontSize: '15px', fontWeight: 'bold'}} onClick={handleLogout}>Confirm</Button>
              </DialogActions>
            </Dialog>
          </List>
        </Drawer>
        
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
              {/* Input Details to create account */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', fontSize: 15, fontFamily: 'sans-serif'}} style={{height: 800}}>

                  <input 
                    type="text" 
                    className="form__field"
                    placeholder='Search username'
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{
                      width: '50%',
                      fontSize: 16,
                      padding: 10,
                      marginBottom: 10,
                      borderRadius: 5,
                    }}
                  />

                  <div style={{ height: 700, width: '100%' }}>
                    {searchInput && filteredAccounts.length === 0 ? (
                      <p style={{ marginTop: '100px', textAlign: 'center', fontSize: '30px', fontWeight: 'bolder' }}>Account not found.</p>
                    ) : (
                      <DataGrid
                        sx={{ fontSize: 15 }}
                        rows={searchInput ? filteredAccounts.map((account) => ({ id: account.userid, ...account })) : accounts.filter((account) =>
                          account.business_name === localStorage.getItem('adminBusinessName') && String(account.username).includes(searchInput)).map((account) => ({ id: account.userid, ...account }))}
                        columns={columns}
                        pageSizeOptions={[5, 10]}
                      />
                    )}
                     <p>Click on the three dots on the right side of each column on the table for additional options. </p>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      <ToastContainer className="foo" style={{ width: "600px", fontSize: 15 }} />
    </ThemeProvider>
  );
}