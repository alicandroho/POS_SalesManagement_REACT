import { useEffect, useState } from "react";
import axios from "axios";


export interface Account{
    userid: number,
    username: string,
    password: string,
    email: string,
    fname: string,
    mname: string,
    lname: string,
    business_name: string,
    address: string,
    contactnum: string,
    gender: string,
    bday: string
}


export const RestAccount = ():[ (userid:number)=> void,(userid:number)=>void,(account:Account)=>void,(account:Account)=>void, Account|any, string] => {
    const [account, setAccount] = useState<Account>();
    const [error, setError] = useState("");

    
    function addAccount(account:Account){
        axios.post("https://pos-sales-springboot-database.onrender.com/user/postUser",{
            username: account.username,
            password: account.password,
            email: account.email,
            fname: account.fname,
            mname: account.mname,
            lname: account.lname,
            business_name: account.business_name,
            address: account.address,
            contactnum: account.contactnum,
            gender: account.gender,
            bday: account.bday
        }).then((response) => {
            setAccount(response.data);
            console.log(response.data);
        })
        .catch((error) => {
            setError(error.message);
        })
  
    }

    function editAccount(account:Account){
        axios.put("https://pos-sales-springboot-database.onrender.com/product/getByProduct?productid=" + account.userid,{
            username: account.username,
            password: account.password,
            email: account.email,
            fname: account.fname,
            mname: account.mname,
            lname: account.lname,
            business_name: account.business_name,
            address: account.address,
            contactnum: account.contactnum,
            gender: account.gender,
            bday: account.bday
        }).then((response) => {
            setAccount(response.data);
            console.log(response.data);
        })
        .catch((error) => {
            setError(error.message);
        })
    }

    function getAccountbyId (userid:number|undefined){
        axios.get("https://pos-sales-springboot-database.onrender.com/user/getByUser?userid=" + userid,{
    }).then((response) => {
        setAccount(response.data);
        console.log(response.data);
    })
    .catch((error) => {
        setError(error.message);
    })
    }

function deleteByID (userid:number|undefined){
    axios.delete("https://pos-sales-springboot-database.onrender.com/user/deleteAccount/" + userid,{
    }).then((response) => {
    setAccount(response.data);
    console.log(response.data);    
    })
.catch((error) => {
    setError(error.message);
    })
}
    return[deleteByID,getAccountbyId,editAccount,addAccount,account,error]
}