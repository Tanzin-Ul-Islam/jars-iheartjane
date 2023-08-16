import axios from "axios";
import { server } from "../config/serverPoint";
// import api from '../config/api.json';

const BaseUrl = server + "api/v1/";

const fetchData = async (endPoint, token = "") => {
    let config = {
        headers: {},
    };
    if (token) {
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    let response = await axios.get(`${BaseUrl}${endPoint}`, config);
    return response ? response.data : {};
};

const postData = async (endPoint, data) => {
    let response = await axios.post(`${BaseUrl}${endPoint}`, data);
    return response;
};

const patchData = async (endPoint, data, token = "") => {
    let config;
    if (token) {
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        };
    }

    let response = await axios.patch(`${BaseUrl}${endPoint}`, data, config);
    return response;
};



export { fetchData, postData, patchData };
