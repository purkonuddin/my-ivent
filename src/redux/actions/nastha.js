import axios from 'axios';
// import 'dotenv/config';
require('dotenv').config();
const react_app_url = process.env.REACT_APP_URL; //'http://localhost:8001/api/v1';

export const postEvent = (formData) => {
    return {
      type: 'POST_EVENT',
      payload: axios({
        method: 'POST',
        url: `${react_app_url}/event/`, 
        data: formData
      })
    }
}

export const fetchEvent = (formData) => {
    return {
      type: 'GET_EVENT',
      payload: axios({
        method: 'GET',
        url: `${react_app_url}/event`, 
        data: formData
      })
    }
}