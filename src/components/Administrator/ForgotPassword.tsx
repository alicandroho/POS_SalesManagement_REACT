import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import  { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Global Configuration/NavBar';

const defaultTheme = createTheme();

export default function ChangePassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { 
      toast.error('Please enter your email address.', {
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
        try {
          // Send a POST request to the backend to initiate the password reset process
          const response = await axios.post('https://pos-sales-springboot-database.onrender.com/user/forgotpassword', { email: email });
          console.log(response.data);
          toast.success('Email verification sent successfully.', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        } catch (error) {
          toast.warn('Email not found.', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
          console.error('Error sending reset email:', error);
        }
      }
  };

  return (
    <div>
      <Navbar/>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" style={{fontSize: 30}}>
              Reset your Password
            </Typography>

            <Box component="form"noValidate sx={{ mt: 2, width: 450}}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="Email"
                label="Email"
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="current-password"
                inputProps={{style: {fontSize: 16}}}
                InputLabelProps={{ style: { fontSize: 16, fontFamily: 'Poppins' } }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={handleSubmit} 
                sx={{ mt: 3, mb: 2 }}
                style={{fontSize: 15}}
              >
                Send Link
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href="/loginadmin" variant="body2" style={{fontSize: 14}}>
                    Remember your password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/createaccountusers" variant="body2" style={{fontSize: 14}}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>

      <ToastContainer className="foo" style={{ width: "500px", fontSize: 16 }} />
    </div>
  );
}
