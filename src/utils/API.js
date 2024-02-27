import { SERVER_BASE_URL } from "./Constants";
import axios from "axios";

class API {
  constructor() {
    this.configs = {
      baseURL: `${SERVER_BASE_URL}/api/`,
      timeout: 70000,
    };
  }

  instance(cfgs = {}) {
    return axios.create({ ...this.configs, ...cfgs });
  }

  async get(url, data) {
    try {
      const rs = await this.instance().get(url, { body: data });
      return this.response(rs);
    } catch (error) {
      console.log("kkkk get api error", error);
      return null;
    }
  }

  async post(url, data, cfgs = {}) {
    try {
      const rs = await this.instance(cfgs).post(url, data);
      return this.response(rs);
    } catch (error) {
      console.log("kkkk post api error", error);
      return null;
    }
  }

  async put(url, data) {
    try {
      const rs = await this.instance().put(url, data);
      return this.response(rs);
    } catch (error) {
      console.log("kkkk put api error", error);
      return null;
    }
  }

  async delete(url) {
    try {
      const rs = await this.instance().delete(url);
      return this.response(rs);
    } catch (error) {
      console.log("kkkk delete api error", error);
      return null;
    }
  }

  response(rs) {
    return rs?.data;
  }
}
const ApiQlcv = new API();
export default ApiQlcv;
