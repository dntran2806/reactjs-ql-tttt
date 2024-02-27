import { makeAutoObservable } from "mobx";
import { VideoModel, NamModel, NhomModel } from "../models/index";
// import { Themes } from "@utils/index";
import { orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

class NhomStore {
  // images = [];
  // favoriteList = [];
  nhom = null;
  list = [];
  constructor() {
    makeAutoObservable(this);
  }

  async add(nhom) {
    const _nhom = await NhomModel.add(nhom);
    if (_nhom) this.nhom = [_nhom, ...this.nhom];
    return _nhom;
  }

  async getnhom(force = false, queries = [], orders) {
    // cache images
    if (!force && this.nhom.length > 0) {
      console.log("getnhom:: cached nhom");
      return this.nhom;
    }
    const _nhom = await NhomModel.getAll(queries, orders);
    console.log("getnhom:: fetch nhom", _nhom);
    if (_nhom) this.nhom = _nhom;
    return this.nhom;
  }

  async getfavoriteList(force = false) {
    // cache favorite images
    if (!force && this.favoriteList.length > 0) {
      console.log("return cached favorite nhom", this.favoriteList);
      return this.favoriteList;
    }
    const _queries = [
      { key: "isFavorite", logic: "==", value: true },
      { key: "isActive", logic: "==", value: true },
    ];
    const _orders = [orderBy("updatedAt", "desc")];
    const _list = await NhomModel.getAll(_queries, _orders);
    console.log("getfavoriteList", _list);
    if (_list) this.favoriteList = _list;
    return this.favoriteList;
  }

  async updateNhom(nhom) {
    const _nhom = await NhomModel.update(nhom);
    if (_nhom)
      this.nhom = this.nhom.map((v) => {
        if (v.id === _nhom.id) return _nhom;
        return v;
      });
    return _nhom;
  }

  async deleteNhom(id) {
    const _id = await NhomModel.delete(id);
    if (_id) {
      this.nhom = this.nhom.filter((v) => v.id !== id);
    }
    return _id;
  }

  async addList(_item) {
    const _list = await NhomModel.add(_item);
    if (_list) this.list = [_list, ...this.list];
    return _list;
  }

  async getList(force = false, queries = []) {
    // cache list
    if (!force && this.list.length > 0) {
      console.log("return cached list");
      return this.list;
    }
    const _list = await NhomModel.getAll(queries);
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
    _list = await NhomModel.get(id);
    return _list;
  }

  async updateList(list) {
    const _list = await NhomModel.update(list);
    if (_list)
      this.list = this.list.map((v) => {
        if (v.id === _list.id) return _list;
        return v;
      });
    return _list;
  }

  async deleteList(id) {
    const _id = await NhomModel.delete(id);
    if (_id) {
      this.list = this.list.filter((v) => v.id !== id);
    }
    return _id;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new NhomStore();
