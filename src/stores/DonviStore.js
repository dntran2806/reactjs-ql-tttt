import { makeAutoObservable } from "mobx";
import { DonviModel } from "../models/index";
// import { Themes } from "@utils/index";
import { orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

class DonviStore {
  // images = [];
  // favoriteList = [];
  donvi = null;
  list = [];
  constructor() {
    makeAutoObservable(this);
  }

  async add(donvi) {
    const _donvi = await DonviModel.add(donvi);
    if (_donvi) this.donvi = [_donvi, ...this.donvi];
    return _donvi;
  }

  async getdonvi(force = false, queries = [], orders) {
    // cache images
    if (!force && this.donvi.length > 0) {
      console.log("getdonvi:: cached donvi");
      return this.donvi;
    }
    const _donvi = await DonviModel.getAll(queries, orders);
    console.log("getdonvi:: fetch donvi", _donvi);
    if (_donvi) this.donvi = _donvi;
    return this.donvi;
  }

  async getfavoriteList(force = false) {
    // cache favorite images
    if (!force && this.favoriteList.length > 0) {
      console.log("return cached favorite donvi", this.favoriteList);
      return this.favoriteList;
    }
    const _queries = [
      { key: "isFavorite", logic: "==", value: true },
      { key: "isActive", logic: "==", value: true },
    ];
    const _orders = [orderBy("updatedAt", "desc")];
    const _list = await DonviModel.getAll(_queries, _orders);
    console.log("getfavoriteList", _list);
    if (_list) this.favoriteList = _list;
    return this.favoriteList;
  }

  async updateDonvi(donvi) {
    const _donvi = await DonviModel.update(donvi);
    if (_donvi)
      this.donvi = this.donvi.map((v) => {
        if (v.id === _donvi.id) return _donvi;
        return v;
      });
    return _donvi;
  }

  async deleteDonvi(id) {
    const _id = await DonviModel.delete(id);
    if (_id) {
      this.donvi = this.donvi.filter((v) => v.id !== id);
    }
    return _id;
  }

  async addList(_item) {
    const _list = await DonviModel.add(_item);
    if (_list) this.list = [_list, ...this.list];
    return _list;
  }

  async getList(force = false, queries = []) {
    // cache list
    if (!force && this.list.length > 0) {
      console.log("return cached list");
      return this.list;
    }
    const _list = await DonviModel.getAll(queries);
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
    _list = await DonviModel.get(id);
    return _list;
  }

  async updateList(list) {
    const _list = await DonviModel.update(list);
    if (_list)
      this.list = this.list.map((v) => {
        if (v.id === _list.id) return _list;
        return v;
      });
    return _list;
  }

  async deleteList(id) {
    const _id = await DonviModel.delete(id);
    if (_id) {
      this.list = this.list.filter((v) => v.id !== id);
    }
    return _id;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new DonviStore();
