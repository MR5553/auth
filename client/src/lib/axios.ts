import axios from "axios";

axios.defaults.withCredentials = true;

axios.interceptors.response.use((res) => res, (error) => {
    if (error.response.status === 401) {
        window.location.href = "/sign-in";
    }
    return Promise.reject(error);
})