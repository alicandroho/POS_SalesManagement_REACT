import React, { useState } from "react";
import axios from "axios";

function ImageUploadAccount() {
    const [image, setImage] = useState();

    function handleImage(event) {
        console.log(event.target.files[0]);
        setImage(URL.createObjectURL(event.target.files[0]));
    }

    function handleApi() {
        const formData = new FormData()
        formData.append('image', image)
        axios.post('url', formData.then((res) => {
            console.log(res)
        }))
    }

    return (
        <div>
            <input type="file" name='file' onChange={handleImage} />

            <img src={image}/>
        </div>
    )
}

export default ImageUploadAccount;
