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
import { RestAccount } from "../REST/REST Account/RestAccount";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';

const defaultTheme = createTheme();

export default function ChangePassword() {
  const [deleteByID, getAccountbyId, editAccount, addAccount, account] = RestAccount();
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resetToken = new URLSearchParams(window.location.search).get('token');
  
    if (password !== reEnterPassword) {
      toast.error('Passwords do not match. Please re-enter your password', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    }

  try {
      const response = await axios.put(
        `https://pos-sales-springboot-database.onrender.com/user/changepassword?resetToken=${resetToken}`,
        {
          password: password,
        }
      );
      console.log(response.data);
      toast.success('Changed password successfully.', {
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
      console.error(error);
    }
  };

  return (
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
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{style: {fontSize: 16}}}
              InputLabelProps={{ style: { fontSize: 16, fontFamily: 'Poppins' } }}
              id="password"
              autoComplete="current-password"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type="password"
              value={reEnterPassword}
              onChange={(e) => setReEnterPassword(e.target.value)}
              id="confirm_password"
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
              Reset Password
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
      <ToastContainer className="foo" style={{ width: "500px", fontSize: 16 }} />
    </ThemeProvider>
  );
}
