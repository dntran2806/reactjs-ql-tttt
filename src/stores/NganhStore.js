import { makeAutoObservable } from "mobx";
import { VideoModel, NamModel, NganhModel } from "../models/index";
// import { Themes } from "@utils/index";
import { orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

class NganhStore {
  // images = [];
  // favoriteList = [];
  nganh = null;
  list = [];
  constructor() {
    makeAutoObservable(this);
  }

  async add(nganh) {
    const _nganh = await NganhModel.add(nganh);
    if (_nganh) this.nganh = [_nganh, ...this.nganh];
    return _nganh;
  }

  async getnganh(force = false, queries = [], orders) {
    // cache images
    if (!force && this.nganh.length > 0) {
      console.log("getnganh:: cached nganh");
      return this.nganh;
    }
    const _nganh = await NganhModel.getAll(queries, orders);
    console.log("getnganh:: fetch nganh", _nganh);
    if (_nganh) this.nganh = _nganh;
    return this.nganh;
  }

  async getfavoriteList(force = false) {
    // cache favorite images
    if (!force && this.favoriteList.length > 0) {
      console.log("return cached favorite nganh", this.favoriteList);
      return this.favoriteList;
    }
    const _queries = [
      { key: "isFavorite", logic: "==", value: true },
      { key: "isActive", logic: "==", value: true },
    ];
    const _orders = [orderBy("updatedAt", "desc")];
    const _list = await NganhModel.getAll(_queries, _orders);
    console.log("getfavoriteList", _list);
    if (_list) this.favoriteList = _list;
    return this.favoriteList;
  }

  async updateNganh(nganh) {
    const _nganh = await NganhModel.update(nganh);
    if (_nganh)
      this.nganh = this.nganh.map((v) => {
        if (v.id === _nganh.id) return _nganh;
        return v;
      });
    return _nganh;
  }

  async deleteNganh(id) {
    const _id = await NganhModel.delete(id);
    if (_id) {
      this.nganh = this.nganh.filter((v) => v.id !== id);
    }
    return _id;
  }

  async addList(_item) {
    const _list = await NganhModel.add(_item);
    if (_list) this.list = [_list, ...this.list];
    return _list;
  }

  async getList(force = false, queries = []) {
    // cache list
    if (!force && this.list.length > 0) {
      console.log("return cached list");
      return this.list;
    }
    const _list = await NganhModel.getAll(queries);
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
    _list = await NganhModel.get(id);
    return _list;
  }

  async updateList(list) {
    const _list = await NganhModel.update(list);
    if (_list)
      this.list = this.list.map((v) => {
        if (v.id === _list.id) return _list;
        return v;
      });
    return _list;
  }

  async deleteList(id) {
    const _id = await NganhModel.delete(id);
    if (_id) {
      this.list = this.list.filter((v) => v.id !== id);
    }
    return _id;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new NganhStore();
