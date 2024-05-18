import React, { useRef, useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { RestProduct } from "../REST/REST Product/RestProduct";
import { toast } from "react-toastify";

interface Product {
  productid: number;
  is_deleted: boolean;
  price: number;
  productname: String;
  purchaseCount: number;
  quantity: number;
}

export default function UpdateProduct(props: Product) {
  const [open, setOpen] = React.useState(false);
  const productnameRef = useRef<HTMLTextAreaElement>();
  const priceRef = useRef<HTMLTextAreaElement>();
  const quantityRef = useRef<HTMLTextAreaElement>();

  // Delete confirmation
  const [openConfirmDelete, setConfirmDelete] = React.useState(false);
  const handleOpenConfirmDelete = () => { setConfirmDelete(true); }
  const handleCloseConfirmDelete = () => { setConfirmDelete(false); }

  const handleUpdate = async () => {
    axios
      .put(
        `https://pos-sales-springboot-database.onrender.com/product/putProduct?productid=` + props.productid,
        {
          productname: productnameRef.current?.value,
          price: priceRef.current?.value,
          quantity: quantityRef.current?.value,
        }
      )
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  // Delete Function
  const handleDelete = async () => {
      axios
        .put(`https://pos-sales-springboot-database.onrender.com/product/deleteProduct/${props.productid}`, {
          is_deleted: true,
        })
        .then((response) => {
          window.location.reload();
        });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  const [openDelete, setOpenDelete] = React.useState(false);

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleClickCloseDelete = () => {
    setOpenDelete(false);
  };

  return (
    <div>
      <button
        className="btn btn-success btn-lg"
        style={{
          marginRight: 5,
          fontSize: 15,
          fontWeight: "medium",
        }}
        onClick={handleClickOpen}
      >
        Edit
      </button>

      <button
        className="btn btn-danger btn-lg"
        style={{
          marginRight: 5,
          fontSize: 15,
          fontWeight: "medium",
        }}
        onClick={handleClickOpenDelete}
      >
        {" "}
        Delete
      </button>

      {/* Dialog for Delete */}
      <Dialog
        open={openDelete}
        onClose={handleClickCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          sx={{ fontSize: "1.6rem", color: "red", fontWeight: "bold" }}
        >
          Warning
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ fontSize: "1.6rem" }}>
            Are you sure you want to delete
            <span style={{ fontWeight: "bold" }}> '{props.productname}'? </span>
            This action cannot be undone, and all your data will be permanently
            lost.
          </DialogContentText>
        </DialogContent>

        <Typography
          sx={{ fontWeight: "bold", fontSize: "1.6rem" }}
          align="center"
        ></Typography>

        <DialogActions>
          <Button
            sx={{ fontSize: "15px", fontWeight: "bold" }}
            onClick={handleClickCloseDelete}
          >
            Cancel
          </Button>
          <Button
            sx={{ fontSize: "15px", fontWeight: "bold" }}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG FOR Edit */}
      <Dialog open={open} onClose={handleClickClose}>
        <DialogContent>
          <Card
            sx={{
              maxWidth: 900,
              borderRadius: 5,
              backgroundColor: "#f7f5f5",
              maxHeight: 1000,
              color: "#213458",
            }}
          >
            <CardContent>
              <Typography
                gutterBottom
                variant="h2"
                component="div"
                sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
                align="center"
              >
                Do you want to edit this Product?
              </Typography>
            </CardContent>
            <CardActions>
              <TextField
                type="text"
                label="Product Name"
                variant="outlined"
                fullWidth
                inputRef={productnameRef}
                defaultValue={props.productname}
                inputProps={{
                  style: {
                    fontSize: 16,
                    fontFamily: "Poppins",
                    color: "#213458",
                  },
                }}
                InputLabelProps={{
                  style: { fontSize: 16, fontFamily: "Poppins" },
                }}
              />
            </CardActions>

            <CardActions>
              <TextField
                type="text"
                label="Price"
                variant="outlined"
                fullWidth
                inputRef={priceRef}
                defaultValue={props.price}
                inputProps={{
                  style: {
                    fontSize: 16,
                    fontFamily: "Poppins",
                    color: "#213458",
                  },
                }}
                InputLabelProps={{
                  style: { fontSize: 16, fontFamily: "Poppins" },
                }}
              />
            </CardActions>

            <CardActions>
              <TextField
                type="text"
                label="Quantity"
                variant="outlined"
                fullWidth
                inputRef={quantityRef}
                defaultValue={props.quantity}
                inputProps={{
                  style: {
                    fontSize: 16,
                    fontFamily: "Poppins",
                    color: "#213458",
                  },
                }}
                InputLabelProps={{
                  style: { fontSize: 16, fontFamily: "Poppins" },
                }}
              />
            </CardActions>
          </Card>
        </DialogContent>
        <DialogActions>
          <button className="btn-cancel" onClick={handleClickClose}>
            Cancel
          </button>
          <button className="btn-approve" autoFocus onClick={handleUpdate}>
            Save Changes
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
