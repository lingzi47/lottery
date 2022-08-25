import axios from "axios";

// 配置axios
const instance = axios.create(
    {
        baseURL:'https://yjwl.wjw3.com',
        timeout:5000
    }
)

export default instance