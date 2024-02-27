import { makeAutoObservable } from "mobx";
import { VideoModel, NamModel, CanboModel } from "../models/index";
// import { Themes } from "@utils/index";
import { orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

class CanboStore {
  // images = [];
  // favoriteList = [];
  canbo = null;
  list = [];
  constructor() {
    makeAutoObservable(this);
  }

  async add(canbo) {
    const _canbo = await CanboModel.add(canbo);
    if (_canbo) this.canbo = [_canbo, ...this.canbo];
    return _canbo;
  }

  async getcanbo(force = false, queries = [], orders) {
    // cache images
    if (!force && this.canbo.length > 0) {
      console.log("getcanbo:: cached canbo");
      return this.canbo;
    }
    const _canbo = await CanboModel.getAll(queries, orders);
    console.log("getLop:: fetch canbo", _canbo);
    if (_canbo) this.canbo = _canbo;
    return this.canbo;
  }

  async getfavoriteList(force = false) {
    // cache favorite images
    if (!force && this.favoriteList.length > 0) {
      console.log("return cached favorite canbo", this.favoriteList);
      return this.favoriteList;
    }
    const _queries = [
      { key: "isFavorite", logic: "==", value: true },
      { key: "isActive", logic: "==", value: true },
    ];
    const _orders = [orderBy("updatedAt", "desc")];
    const _list = await CanboModel.getAll(_queries, _orders);
    console.log("getfavoriteList", _list);
    if (_list) this.favoriteList = _list;
    return this.favoriteList;
  }

  async updatecanbo(canbo) {
    const _canbo = await CanboModel.update(canbo);
    if (_canbo)
      this.canbo = this.canbo.map((v) => {
        if (v.id === _canbo.id) return _canbo;
        return v;
      });
    return _canbo;
  }

  async deletecanbo(id) {
    const _id = await CanboModel.delete(id);
    if (_id) {
      this.canbo = this.canbo.filter((v) => v.id !== id);
    }
    return _id;
  }

  async addList(_item) {
    const _list = await CanboModel.add(_item);
    if (_list) this.list = [_list, ...this.list];
    return _list;
  }

  async getByEmail(email) {
    const _queries = [{ key: "Email", logic: "==", value: email }];
    console.log("kkk CanboStore getbyemail", email);
    const _list = await CanboModel.getAll(_queries);
    console.log("kkkk CanboStore getByEmail cb", _list);
    if (_list?.length > 0) return _list[0];
    return;
  }

  async getByMa(ma) {
    const _queries = [{ key: "Macb", logic: "==", value: ma }];
    console.log("kkkgetbyma", ma);
    const _list = await CanboModel.getAll(_queries);
    console.log("kkkk getByMa cb", _list);
    if (_list?.length > 0) return _list[0];
    return;
  }

  async getList(force = false, queries = []) {
    // cache list
    if (!force && this.list.length > 0) {
      console.log("return cached list");
      return this.list;
    }
    const _list = await CanboModel.getAll(queries);
    console.log("kkkk getlist Canbo", _list);
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
    _list = await CanboModel.get(id);
    return _list;
  }

  async updateList(list) {
    const _list = await CanboModel.update(list);
    if (_list)
      this.list = this.list.map((v) => {
        if (v.id === _list.id) return _list;
        return v;
      });
    return _list;
  }

  async deleteList(id) {
    const _id = await CanboModel.delete(id);
    if (_id) {
      this.list = this.list.filter((v) => v.id !== id);
    }
    return _id;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new CanboStore();
