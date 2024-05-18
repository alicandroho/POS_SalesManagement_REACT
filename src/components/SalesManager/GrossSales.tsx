import * as React from "react";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function GrossSales() {
  const [total_price, setTotal_Price] = useState<number | null>(null);
  const [todayDate, setTodayDate] = useState<string>('');

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

    // Set today's date
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    setTodayDate(formattedDate);
  }, []);

  return (
    <React.Fragment>
      <Typography
        sx={{
          fontSize: 22,
          color: "rgb(58, 110, 112)",
          fontFamily: "sans-serif",
          fontWeight: 600
        }}
      >
        Gross Sales
      </Typography>
      <Typography component="p" variant="h2">
        ₱{total_price ? total_price.toFixed(2) : '0.00'}
      </Typography>

      <Typography color="text.secondary" sx={{ flex: 1, fontSize: 16 }}>
        {`on ${todayDate}`}
      </Typography>
      <div>
        <Link
          to="/transactions"
          style={{ textDecoration: "none", color: 'green' }}
        >
          View Transactions
        </Link>
      </div>
    </React.Fragment>
  );
}
