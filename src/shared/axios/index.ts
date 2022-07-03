import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://nodetools-back.herokuapp.com/api/v1/third-party',
});
