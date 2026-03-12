import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000/api/cipher"

export const decrypt = async (data) => {
    const res = await axios.post(`${BASE_URL}/decrypt`, 
        data
    )
    return res.data
}