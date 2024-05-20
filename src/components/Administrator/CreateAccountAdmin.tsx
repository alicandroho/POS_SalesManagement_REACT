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
import { ChangeEvent, useEffect, useState } from "react";
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
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import "./CSS Files/CreateAccountAdmin.css";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import { ManageAccounts, Menu, Visibility, VisibilityOff } from "@mui/icons-material";
import ShieldIcon from "@mui/icons-material/Shield";
import { ToastContainer, toast } from "react-toastify";
import { previousDay } from "date-fns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuIcon from '@mui/icons-material/Menu';


const drawerWidth: number = 300;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface Account {
  userid: number;
  username: string;
  account_type: string;
  password: string;
  email: string;
  fname: string;
  lname: string;
  business_name: string;
  address: string;
  contactnum: string;
  gender: string;
  bday: string;
}

const post_account = "https://pos-sales-springboot-database.onrender.com/user/postUser";
const Account_Type = [
  {
    value: "Cashier",
    label: "Cashier",
  },
  {
    value: "Sales Manager",
    label: "Sales Manager",
  },
];

const Gender = [
  {
    value: "Female",
    label: "Female",
  },
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Prefer not to say.",
    label: "Prefer not to say.",
  },
];

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

export default function CreateAccountAdmin() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { isAdminLoggedIn, setIsAdminLoggedIn, adminUser } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  // Token
  useEffect(() => {
    const token = localStorage.getItem("adminLoggedIn");
    if (!token) {
      navigate("/loginadmin");
    } else {
      setIsAdminLoggedIn(true);
      // Fetch user data from API
      axios
        .get("https://dilven-springboot.onrender.com/user/getAllUser")
        .then((response) => {
          // Filter users based on business_name
          const filteredUsers = response.data.filter(
            (username: Account) =>
              username.business_name ===
              localStorage.getItem("adminBusinessName")
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
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminUsername");
    localStorage.removeItem("adminBusinessName");
    navigate("/loginadmin");
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [business_name, setBusiness_name] = useState("");
  const [address, setAddress] = useState("");
  const [contactnum, setContactnum] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFormValid, setFormValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  //Function to check if all required fields are all filled
  const isFormComplete = () => {
    return (
      username.trim() !== "" &&
      password.trim() !== "" &&
      selectedAccountType.trim() !== "" &&
      fname.trim() !== "" &&
      lname.trim() !== "" &&
      selectedDate !== null &&
      contactnum.trim() !== "" &&
      address.trim() !== "" &&
      selectedGender.trim() !== "" &&
      email.trim() !== ""
    );
  };

  const handleSubmit = () => {
    if (isFormComplete()) {
      if (selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        axios
          .post(post_account, {
            username: username,
            password: password,
            account_type: selectedAccountType,
            email: email,
            fname: fname,
            lname: lname,
            business_name: localStorage.getItem("adminBusinessName"),
            address: address,
            contactnum: contactnum,
            gender: selectedGender,
            bday: formattedDate,
          })
          .then((res) => {
            toast.success("Account created successfully.", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            console.log(res.data);
          })
          .catch((err) => {
            if (err.response && err.response.status === 500) {
              toast.error(
                "Username has already been used. Please try again with a different username.",
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
            } else {
              // Handle other errors here
              console.log(err);
            }
          });
      } else {
        alert("Please select a birth date");
      }
    } else {
      setFormValid(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handlePasswordChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const passwordsMatch = password === confirmPassword;

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
              Create an Account
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
                {localStorage.getItem("adminUsername")}
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
            {localStorage.getItem("adminBusinessName")}
          </Toolbar>
          <Divider />
          <List component="nav">
            <Link to="/#" className="side-nav">
              <IconButton color="inherit">
                <HomeIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <Button>Home</Button>
            </Link>

            <Link to="/adminmainpage" className="side-nav">
              <IconButton color="inherit">
                <Menu sx={{ fontSize: 20 }} />
              </IconButton>
              <Button>Admin Main</Button>
            </Link>

            <Link
              to="/createaccountadmin"
              style={{ backgroundColor: "#AFE1AF" }}
              className="side-nav"
            >
              <IconButton color="inherit">
                <PersonAddIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <Button>Create an Account</Button>
            </Link>

            <Link to="/viewaccounts" className="side-nav">
              <IconButton color="inherit">
                <ManageAccounts sx={{ fontSize: 20 }} />
              </IconButton>
              <Button>View Accounts</Button>
            </Link>

            <Link onClick={handleClickOpenLogout} to="" className="side-nav">
              <IconButton color="inherit">
                <LogoutIcon sx={{ fontSize: 20 }} />
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
              {/* Input Details to create account */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    fontSize: 15,
                    fontFamily: "sans-serif",
                  }}
                >
                  {/* Check if fields are empty */}
                  {!isFormValid && (
                    <p style={{ color: "red" }}>
                      Please fill in all required fields.
                    </p>
                  )}

                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "row",
                      fontSize: 15,
                      boxShadow: "none",
                    }}
                  >
                    <TextField
                      type="text"
                      variant="outlined"
                      fullWidth
                      label="Username"
                      value={username}
                      style={{ marginRight: 10 }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setUsername(e.target.value)
                      }
                      inputProps={{
                        style: { fontSize: 16 },
                      }}
                      InputLabelProps={{
                        style: { fontSize: 16 },
                      }}
                    />

                    <TextField
                      select
                      fullWidth
                      label="Account Type"
                      variant="outlined"
                      value={selectedAccountType}
                      style={{ marginBottom: "-30px" }}
                      onChange={(e: ChangeEvent<{ value: unknown }>) =>
                        setSelectedAccountType(e.target.value as string)
                      }
                      InputProps={{
                        style: {
                          fontSize: 16,
                          height: "auto",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        },
                      }}
                      InputLabelProps={{
                        style: { fontSize: 16 },
                      }}
                      FormHelperTextProps={{
                        style: {
                          fontSize: 12,
                        },
                      }}
                      helperText="Please select your account type."
                    >
                      {Account_Type.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Typography sx={{ fontSize: 16 }}>
                            {option.label}
                          </Typography>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Paper>

                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "row",
                      fontSize: 15,
                      boxShadow: "none",
                    }}
                  >
                    <TextField
                      type={showPassword ? "text" : "password"} // Toggle password visibility
                      label="Password"
                      variant="outlined"
                      value={password}
                      fullWidth
                      onChange={handlePasswordChange}
                      inputProps={{ style: { fontSize: 16 } }}
                      InputLabelProps={{
                        style: { fontSize: 16 },
                      }}
                      style={{ marginRight: "10px" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility}>
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      type={showPassword ? "text" : "password"} // Toggle password visibility
                      label="Confirm Password"
                      variant="outlined"
                      value={confirmPassword}
                      fullWidth
                      onChange={handleConfirmPasswordChange}
                      inputProps={{ style: { fontSize: 16 } }}
                      InputLabelProps={{
                        style: { fontSize: 16 },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility}>
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Paper>
                  {/* Validate if password match */}
                  {!passwordsMatch && (
                    <p
                      style={{
                        color: "red",
                        fontSize: 12,
                        marginBottom: 20,
                        marginLeft: 30,
                      }}
                    >
                      Passwords do not match.
                    </p>
                  )}

                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "row",
                      fontSize: 15,
                      boxShadow: "none",
                      marginTop: "-20px",
                    }}
                  >
                    <TextField
                      type="text"
                      label="First Name"
                      variant="outlined"
                      value={fname}
                      fullWidth
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFname(e.target.value)
                      }
                      inputProps={{ style: { fontSize: 16 } }}
                      InputLabelProps={{
                        style: { fontSize: 16 },
                      }}
                      style={{ marginRight: "10px" }}
                    />

                    <TextField
                      type="text"
                      label="Last Name"
                      variant="outlined"
                      value={lname}
                      fullWidth
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setLname(e.target.value)
                      }
                      inputProps={{ style: { fontSize: 16 } }}
                      InputLabelProps={{
                        style: { fontSize: 16 },
                      }}
                    />
                  </Paper>

                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "row",
                      fontSize: 15,
                      boxShadow: "none",
                      marginTop: "-20px",
                    }}
                  >

                    <TextField
                      type="text"
                      label="Address"
                      variant="outlined"
                      value={address}
                      fullWidth
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setAddress(e.target.value)
                      }
                      inputProps={{ style: { fontSize: 16 } }}
                      InputLabelProps={{
                        style: { fontSize: 16 },
                      }}
                    />
                  </Paper>

                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "row",
                      fontSize: 15,
                      boxShadow: "none",
                      marginTop: "-20px",
                    }}
                  >
                    <TextField
                      type="text"
                      label="Email"
                      variant="outlined"
                      value={email}
                      fullWidth
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      inputProps={{ style: { fontSize: 16 } }}
                      InputLabelProps={{
                        style: { fontSize: 16 },
                      }}
                      style={{ marginRight: "10px" }}
                    />

                    <TextField
                      type="text"
                      label="Contact Number"
                      variant="outlined"
                      value={contactnum}
                      fullWidth
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setContactnum(e.target.value)
                      }
                      inputProps={{ style: { fontSize: 16 } }}
                      InputLabelProps={{
                        style: { fontSize: 16 },
                      }}
                    />
                  </Paper>

                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "row",
                      fontSize: 15,
                      boxShadow: "none",
                      marginTop: "-20px",
                    }}
                  >
                    <TextField
                      select
                      label="Gender"
                      variant="outlined"
                      fullWidth
                      value={selectedGender}
                      onChange={(e: ChangeEvent<{ value: unknown }>) =>
                        setSelectedGender(e.target.value as string)
                      }
                      InputProps={{
                        style: {
                          fontSize: 16,
                          minHeight: "2.5em",
                          height: "auto",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        },
                      }}
                      style={{
                        marginBottom: "10px",
                        width: 709,
                        marginRight: 9,
                      }}
                      InputLabelProps={{
                        style: { fontSize: 16 },
                      }}
                      FormHelperTextProps={{
                        style: {
                          fontSize: 12,
                        },
                      }}
                      helperText="Please select your gender."
                    >
                      {Gender.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Typography sx={{ fontSize: 16 }}>
                            {option.label}
                          </Typography>
                        </MenuItem>
                      ))}
                    </TextField>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        sx={{
                          marginBottom: "10px",
                          width: 709,
                          "& .MuiInputBase-input": {
                            fontSize: "16px", // Adjust the input font size
                          },
                          "& .MuiPickersDay-day": {
                            fontSize: "16px", // Adjust the day font size
                          },
                          "& .MuiPickersYear-root, .MuiPickersYear-yearButton":
                            {
                              fontSize: "16px", // Adjust the year font size
                            },
                        }}
                      />
                    </LocalizationProvider>
                  </Paper>

                  <Button
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    type="submit"
                    onClick={handleSubmit}
                    style={{
                      display: "flex",
                      margin: "auto",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      width: 500,
                      padding: 10,
                      backgroundColor: "#4BB543",
                    }}
                  >
                    Create Account
                  </Button>
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
