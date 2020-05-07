import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-burger-app-55a2f.firebaseio.com/'
});

export default instance;