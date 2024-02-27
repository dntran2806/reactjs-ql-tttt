import { makeAutoObservable } from "mobx";
import { VideoModel, NamModel, LoginModel } from "../models/index";
// import { Themes } from "@utils/index";
import { orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

class LoginStore {
  // images = [];
  // favoriteList = [];
  login = null;
  list = [];
  constructor() {
    makeAutoObservable(this);
  }

  async add(login) {
    const _login = await LoginModel.add(login);
    if (_login) this.login = [_login, ...this.login];
    return _login;
  }

  async getlop(force = false, queries = [], orders) {
    // cache images
    if (!force && this.login.length > 0) {
      console.log("getlop:: cached login");
      return this.login;
    }
    const _login = await LoginModel.getAll(queries, orders);
    console.log("getLop:: fetch login", _login);
    if (_login) this.login = _login;
    return this.login;
  }

  async getfavoriteList(force = false) {
    // cache favorite images
    if (!force && this.favoriteList.length > 0) {
      console.log("return cached favorite login", this.favoriteList);
      return this.favoriteList;
    }
    const _queries = [
      { key: "isFavorite", logic: "==", value: true },
      { key: "isActive", logic: "==", value: true },
    ];
    const _orders = [orderBy("updatedAt", "desc")];
    const _list = await LoginModel.getAll(_queries, _orders);
    console.log("getfavoriteList", _list);
    if (_list) this.favoriteList = _list;
    return this.favoriteList;
  }

  async updateLop(login) {
    const _login = await LoginModel.update(login);
    if (_login)
      this.login = this.login.map((v) => {
        if (v.id === _login.id) return _login;
        return v;
      });
    return _login;
  }

  async deleteLop(id) {
    const _id = await LoginModel.delete(id);
    if (_id) {
      this.login = this.login.filter((v) => v.id !== id);
    }
    return _id;
  }

  async addList(_item) {
    const _list = await LoginModel.add(_item);
    if (_list) this.list = [_list, ...this.list];
    return _list;
  }

  async getList(force = false, queries = []) {
    // cache list
    if (!force && this.list.length > 0) {
      console.log("return cached list");
      return this.list;
    }
    const _list = await LoginModel.getAll(queries);
    if (_list && queries.length === 0) this.list = _list;
    return _list;
  }

  async getListById(id) {
    // cache list
    let _list = this.list.find((_) => _.id === id);
    if (_list) {
      console.log("getListById:: cached list");
      return _list;
    }
    _list = await LoginModel.get(id);
    return _list;
  }

  async updateList(list) {
    const _list = await LoginModel.update(list);
    if (_list)
      this.list = this.list.map((v) => {
        if (v.id === _list.id) return _list;
        return v;
      });
    return _list;
  }

  async deleteList(id) {
    const _id = await LoginModel.delete(id);
    if (_id) {
      this.list = this.list.filter((v) => v.id !== id);
    }
    return _id;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new LoginStore();
