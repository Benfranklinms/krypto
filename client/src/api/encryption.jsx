import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000/api/cipher"

export const encrypt = async (data) => {
    const res = await axios.post(`${BASE_URL}/encrypt`, 
        data
    )
    return res.data
}
