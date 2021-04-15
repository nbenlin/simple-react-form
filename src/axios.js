import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:60001/",
});

export default instance;
