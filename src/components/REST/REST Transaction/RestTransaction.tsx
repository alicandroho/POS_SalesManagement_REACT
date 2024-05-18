import { useEffect, useState } from "react";
import axios from "axios";


export interface Transaction{
    transactionid: number,
    total_quantity: number,
    total_price: number,
    tendered_bill: number,
    balance: number,
    customer_name: string,
    customer_num: string,
    customer_email: string,
    date_time: string,
    refunded: boolean,
    returned: boolean,
    productid: number
    userid: number,
    cashier: string,
}


export const RestTransaction = ():[ (transactionid:number)=> void,(transactionid:number)=>void,(transaction:Transaction)=>void,(transaction:Transaction)=>void, Transaction|undefined, string] => {
    const [transaction, setTransaction] = useState<Transaction>();
    const [error, setError] = useState("");

    
    function addTransaction(transaction:Transaction){
        axios.post("https://pos-sales-springboot-database.onrender.com/transaction/postTransaction",{
            total_quantity: transaction.total_quantity,
            total_price: transaction.total_price,
            tendered_bill: transaction.tendered_bill,
            balance: transaction.balance,
            customer_name: transaction.customer_name,
            customer_num: transaction.customer_num,
            customer_email: transaction.customer_email,
            date_time: transaction.date_time,
            refunded: transaction.refunded,
            returned: transaction.returned,
            productid: transaction.productid,
            userid: transaction.userid,
            cashier: transaction.cashier,
        }).then((response) => {
            setTransaction(response.data);
            console.log(response.data);
            alert('success')
        })
        .catch((error) => {
            setError(error.message);
        })
  
    }

    function editTransaction(transaction:Transaction){
        axios.put("https://pos-sales-springboot-database.onrender.com/transaction/putTransaction?transactionid=" + transaction.transactionid,{
            total_quantity: transaction.total_quantity,
            total_price: transaction.total_price,
            tendered_bill: transaction.tendered_bill,
            balance: transaction.balance,
            customer_name: transaction.customer_name,
            customer_num: transaction.customer_num,
            customer_email: transaction.customer_email,
            date_time: transaction.date_time,
            refunded: transaction.refunded,
            returned: transaction.returned,
            productid: transaction.productid,
            userid: transaction.userid,
            cashier: transaction.cashier,
        }).then((response) => {
            setTransaction(response.data);
            console.log(response.data);
        })
        .catch((error) => {
            setError(error.message);
        })
    }

//     function getByProductname (productname:string|undefined){
//         axios.get("http://localhost:8080/product/getByProduct?productname=" + productname,{
//     }).then((response) => {
//         setProduct(response.data);
//         console.log(response.data);
//     })
//     .catch((error) => {
//         setError(error.message);
//     })
// }


function getTransactionByid (transactionid:number|undefined){
    axios.get("https://pos-sales-springboot-database.onrender.com/transaction/getByTransactionid?transactionid=" + transactionid,{
}).then((response) => {
    setTransaction(response.data);
    console.log(response.data);
})
.catch((error) => {
    setError(error.message);
})
}

function deleteByIDTransaction (transactionid:number|undefined){
    axios.delete("https://pos-sales-springboot-database.onrender.com/transaction/deleteTransaction/" + transactionid,{
    }).then((response) => {
    setTransaction(response.data);
    console.log(response.data);    
    })
.catch((error) => {
    setError(error.message);
    })
}
    return[deleteByIDTransaction,getTransactionByid,editTransaction,addTransaction,transaction,error]
}