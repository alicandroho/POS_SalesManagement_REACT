import { useEffect, useState } from "react";
import axios from "axios";


export interface Product{
    productid: number,
    productname: string,
    quantity: number,
    price: number,
}


export const RestProduct = ():[ (productid:number)=> void,(productid:number)=>void,(product:Product)=>void,(product:Product)=>void, Product|any, string] => {
    const [product, setProduct] = useState<Product>();
    const [error, setError] = useState("");

    
    function addProduct(product:Product){
        axios.post("https://pos-sales-springboot-database.onrender.com/product/postProduct",{
            productname: product.productname,
            price: product.price,
            quantity: product.quantity,
        }).then((response) => {
            setProduct(response.data);
            console.log(response.data);
        })
        .catch((error) => {
            setError(error.message);
        })
  
    }

    function editProduct(product:Product){
        axios.put("https://pos-sales-springboot-database.onrender.com/product/getByProduct?productid=" + product.productid,{
            productname: product.productname,
            price: product.price,
            quantity: product.quantity,
        }).then((response) => {
            setProduct(response.data);
            console.log(response.data);
        })
        .catch((error) => {
            setError(error.message);
        })
    }

function getProductByid (productid:number|undefined){
    axios.get("https://pos-sales-springboot-database.onrender.com/product/getByProduct?productID=" + productid,{
}).then((response) => {
    setProduct(response.data);
    console.log(response.data);
})
.catch((error) => {
    setError(error.message);
})
}

function deleteByID (productid:number|undefined){
    axios.delete("https://pos-sales-springboot-database.onrender.com/product/deleteProduct/" + productid,{
    }).then((response) => {
    setProduct(response.data);
    console.log(response.data);    
    })
.catch((error) => {
    setError(error.message);
    })
}
    return[deleteByID,getProductByid,editProduct,addProduct,product,error]
}