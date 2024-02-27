import { makeAutoObservable } from "mobx";
import { VideoModel, NamModel, LopModel } from "../models/index";
// import { Themes } from "@utils/index";
import { orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

class LopStore {
  // images = [];
  // favoriteList = [];
  lop = null;
  list = [];
  constructor() {
    makeAutoObservable(this);
  }

  async add(lop) {
    const _lop = await LopModel.add(lop);
    if (_lop) this.lop = [_lop, ...this.lop];
    return _lop;
  }

  async getlop(force = false, queries = [], orders) {
    // cache images
    if (!force && this.lop.length > 0) {
      console.log("getlop:: cached lop");
      return this.lop;
    }
    const _lop = await LopModel.getAll(queries, orders);
    console.log("getLop:: fetch lop", _lop);
    if (_lop) this.lop = _lop;
    return this.lop;
  }

  async getfavoriteList(force = false) {
    // cache favorite images
    if (!force && this.favoriteList.length > 0) {
      console.log("return cached favorite lop", this.favoriteList);
      return this.favoriteList;
    }
    const _queries = [
      { key: "isFavorite", logic: "==", value: true },
      { key: "isActive", logic: "==", value: true },
    ];
    const _orders = [orderBy("updatedAt", "desc")];
    const _list = await LopModel.getAll(_queries, _orders);
    console.log("getfavoriteList", _list);
    if (_list) this.favoriteList = _list;
    return this.favoriteList;
  }

  async updateLop(lop) {
    const _lop = await LopModel.update(lop);
    if (_lop)
      this.lop = this.lop.map((v) => {
        if (v.id === _lop.id) return _lop;
        return v;
      });
    return _lop;
  }

  async deleteLop(id) {
    const _id = await LopModel.delete(id);
    if (_id) {
      this.lop = this.lop.filter((v) => v.id !== id);
    }
    return _id;
  }

  async addList(_item) {
    const _list = await LopModel.add(_item);
    if (_list) this.list = [_list, ...this.list];
    return _list;
  }

  async getList(force = false, queries = []) {
    // cache list
    if (!force && this.list.length > 0) {
      console.log("return cached list");
      return this.list;
    }
    const _list = await LopModel.getAll(queries);
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
    _list = await LopModel.get(id);
    return _list;
  }

  async getByCanbo(cbId) {
    if (!cbId) return;
    const _queries = [{ key: "Canbo", logic: "==", value: cbId }];
    const _list = await LopModel.getAll(_queries);
    console.log("kkkk LopStore getByCanbo ", cbId, _list);
    if (_list?.length > 0) return _list[0];
    return;
  }

  async updateList(list) {
    const _list = await LopModel.update(list);
    if (_list)
      this.list = this.list.map((v) => {
        if (v.id === _list.id) return _list;
        return v;
      });
    return _list;
  }

  async deleteList(id) {
    const _id = await LopModel.delete(id);
    if (_id) {
      this.list = this.list.filter((v) => v.id !== id);
    }
    return _id;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new LopStore();
