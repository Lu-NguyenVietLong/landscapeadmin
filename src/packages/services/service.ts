import axios from "axios";

const instance = axios.create({
    baseURL: 'https://zenplant-backend.onrender.com/api/v1/',
    // baseURL: process.env.BASE_URL,
});

  // Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  let res: {data: string, status: number, header: string} = {data: '', status: 0, header: ''}
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    res.data = error.response.data
    res.status = error.response.status
    res.header = error.response.headers

  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser 
    // and an instance of http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
  // return Promise.reject(error);
  return res && res.data ? res.data : res
});

  export default instance