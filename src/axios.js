import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    // baseURL: 'http://delivery-automation-stg.us-east-1.elasticbeanstalk.com/api/v1/',
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) =>
        Promise.reject(
            (error.response && error.response.data) || 'Something went wrong!'
        )
)

export default axiosInstance
