import { makeAutoObservable } from "mobx";
import { VideoModel, NamModel, DoanhnghiepModel } from "../models/index";
// import { Themes } from "@utils/index";
import { orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

class DoanhnghiepStore {
  // images = [];
  // favoriteList = [];
  doanhnghiep = null;
  list = [];
  constructor() {
    makeAutoObservable(this);
  }

  async add(doanhnghiep) {
    const _doanhnghiep = await DoanhnghiepModel.add(doanhnghiep);
    if (_doanhnghiep) this.doanhnghiep = [_doanhnghiep, ...this.doanhnghiep];
    return _doanhnghiep;
  }

  async getdoanhnghiep(force = false, queries = [], orders) {
    // cache images
    if (!force && this.doanhnghiep.length > 0) {
      console.log("getlop:: cached doanhnghiep");
      return this.doanhnghiep;
    }
    const _doanhnghiep = await DoanhnghiepModel.getAll(queries, orders);
    console.log("getLop:: fetch doanhnghiep", _doanhnghiep);
    if (_doanhnghiep) this.doanhnghiep = _doanhnghiep;
    return this.doanhnghiep;
  }

  async getfavoriteList(force = false) {
    // cache favorite images
    if (!force && this.favoriteList.length > 0) {
      console.log("return cached favorite doanhnghiep", this.favoriteList);
      return this.favoriteList;
    }
    const _queries = [
      { key: "isFavorite", logic: "==", value: true },
      { key: "isActive", logic: "==", value: true },
    ];
    const _orders = [orderBy("updatedAt", "desc")];
    const _list = await DoanhnghiepModel.getAll(_queries, _orders);
    console.log("getfavoriteList", _list);
    if (_list) this.favoriteList = _list;
    return this.favoriteList;
  }

  async updatedoanhnghiep(doanhnghiep) {
    const _doanhnghiep = await DoanhnghiepModel.update(doanhnghiep);
    if (_doanhnghiep)
      this.doanhnghiep = this.doanhnghiep.map((v) => {
        if (v.id === _doanhnghiep.id) return _doanhnghiep;
        return v;
      });
    return _doanhnghiep;
  }

  async deletedoanhnghiep(id) {
    const _id = await DoanhnghiepModel.delete(id);
    if (_id) {
      this.doanhnghiep = this.doanhnghiep.filter((v) => v.id !== id);
    }
    return _id;
  }

  async addList(_item) {
    const _list = await DoanhnghiepModel.add(_item);
    if (_list) this.list = [_list, ...this.list];
    return _list;
  }

  async getList(force = false, queries = []) {
    // cache list
    if (!force && this.list.length > 0) {
      console.log("return cached list");
      return this.list;
    }
    const _list = await DoanhnghiepModel.getAll(queries);
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
    _list = await DoanhnghiepModel.get(id);
    return _list;
  }

  async updateList(list) {
    const _list = await DoanhnghiepModel.update(list);
    if (_list)
      this.list = this.list.map((v) => {
        if (v.id === _list.id) return _list;
        return v;
      });
    return _list;
  }

  async deleteList(id) {
    const _id = await DoanhnghiepModel.delete(id);
    if (_id) {
      this.list = this.list.filter((v) => v.id !== id);
    }
    return _id;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new DoanhnghiepStore();
