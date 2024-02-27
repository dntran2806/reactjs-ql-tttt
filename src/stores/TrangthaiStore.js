import { makeAutoObservable } from "mobx";
import { TrangthaiModel } from "../models/index";
// import { Themes } from "@utils/index";
import { orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

class TrangthaiStore {
  // images = [];
  // favoriteList = [];
  trangthai = null;
  list = [];
  constructor() {
    makeAutoObservable(this);
  }

  async add(trangthai) {
    const _trangthai = await TrangthaiModel.add(trangthai);
    if (_trangthai) this.trangthai = [_trangthai, ...this.trangthai];
    return _trangthai;
  }

  async gettrangthai(force = false, queries = [], orders) {
    // cache images
    if (!force && this.trangthai.length > 0) {
      console.log("gettrangthai:: cached trangthai");
      return this.trangthai;
    }
    const _trangthai = await TrangthaiModel.getAll(queries, orders);
    console.log("gettrangthai:: fetch trangthai", _trangthai);
    if (_trangthai) this.trangthai = _trangthai;
    return this.trangthai;
  }

  async getfavoriteList(force = false) {
    // cache favorite images
    if (!force && this.favoriteList.length > 0) {
      console.log("return cached favorite trangthai", this.favoriteList);
      return this.favoriteList;
    }
    const _queries = [
      { key: "isFavorite", logic: "==", value: true },
      { key: "isActive", logic: "==", value: true },
    ];
    const _orders = [orderBy("updatedAt", "desc")];
    const _list = await TrangthaiModel.getAll(_queries, _orders);
    console.log("getfavoriteList", _list);
    if (_list) this.favoriteList = _list;
    return this.favoriteList;
  }

  async updateTrangthai(trangthai) {
    const _trangthai = await TrangthaiModel.update(trangthai);
    if (_trangthai)
      this.trangthai = this.trangthai.map((v) => {
        if (v.id === _trangthai.id) return _trangthai;
        return v;
      });
    return _trangthai;
  }

  async deleteTrangthai(id) {
    const _id = await TrangthaiModel.delete(id);
    if (_id) {
      this.trangthai = this.trangthai.filter((v) => v.id !== id);
    }
    return _id;
  }

  async addList(_item) {
    const _list = await TrangthaiModel.add(_item);
    if (_list) this.list = [_list, ...this.list];
    return _list;
  }

  async getList(force = false, queries = []) {
    // cache list
    if (!force && this.list.length > 0) {
      console.log("return cached list");
      return this.list;
    }
    const _list = await TrangthaiModel.getAll(queries);
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
    _list = await TrangthaiModel.get(id);
    return _list;
  }

  async updateList(list) {
    const _list = await TrangthaiModel.update(list);
    if (_list)
      this.list = this.list.map((v) => {
        if (v.id === _list.id) return _list;
        return v;
      });
    return _list;
  }

  async deleteList(id) {
    const _id = await TrangthaiModel.delete(id);
    if (_id) {
      this.list = this.list.filter((v) => v.id !== id);
    }
    return _id;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new TrangthaiStore();
