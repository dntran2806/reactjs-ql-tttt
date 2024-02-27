import { makeAutoObservable } from "mobx";
import { TTTiepnhanModel } from "../models/index";
// import { Themes } from "@utils/index";
import { orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

class TTTiepnhanStore {
  // images = [];
  // favoriteList = [];
  tttiiepnhan = null;
  list = [];
  constructor() {
    makeAutoObservable(this);
  }

  async add(tttiiepnhan) {
    const _tttiiepnhan = await TTTiepnhanModel.add(tttiiepnhan);
    if (_tttiiepnhan) this.tttiiepnhan = [_tttiiepnhan, ...this.tttiiepnhan];
    return _tttiiepnhan;
  }

  async gettttiepnhan(force = false, queries = [], orders) {
    // cache images
    if (!force && this.tttiiepnhan.length > 0) {
      console.log("gettttiepnhan:: cached tttiiepnhan");
      return this.tttiiepnhan;
    }
    const _tttiiepnhan = await TTTiepnhanModel.getAll(queries, orders);
    console.log("gettttiepnhan:: fetch tttiiepnhan", _tttiiepnhan);
    if (_tttiiepnhan) this.tttiiepnhan = _tttiiepnhan;
    return this.tttiiepnhan;
  }

  async getfavoriteList(force = false) {
    // cache favorite images
    if (!force && this.favoriteList.length > 0) {
      console.log("return cached favorite tttiiepnhan", this.favoriteList);
      return this.favoriteList;
    }
    const _queries = [
      { key: "isFavorite", logic: "==", value: true },
      { key: "isActive", logic: "==", value: true },
    ];
    const _orders = [orderBy("updatedAt", "desc")];
    const _list = await TTTiepnhanModel.getAll(_queries, _orders);
    console.log("getfavoriteList", _list);
    if (_list) this.favoriteList = _list;
    return this.favoriteList;
  }

  async updateTTTiepnhan(tttiiepnhan) {
    const _tttiiepnhan = await TTTiepnhanModel.update(tttiiepnhan);
    if (_tttiiepnhan)
      this.tttiiepnhan = this.tttiiepnhan.map((v) => {
        if (v.id === _tttiiepnhan.id) return _tttiiepnhan;
        return v;
      });
    return _tttiiepnhan;
  }

  async deleteTTTiepnhan(id) {
    const _id = await TTTiepnhanModel.delete(id);
    if (_id) {
      this.tttiiepnhan = this.tttiiepnhan.filter((v) => v.id !== id);
    }
    return _id;
  }

  async addList(_item) {
    const _list = await TTTiepnhanModel.add(_item);
    if (_list) this.list = [_list, ...this.list];
    return _list;
  }

  async getList(force = false, queries = []) {
    // cache list
    if (!force && this.list.length > 0) {
      console.log("return cached list");
      return this.list;
    }
    const _list = await TTTiepnhanModel.getAll(queries);
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
    _list = await TTTiepnhanModel.get(id);
    return _list;
  }

  async updateList(list) {
    const _list = await TTTiepnhanModel.update(list);
    if (_list)
      this.list = this.list.map((v) => {
        if (v.id === _list.id) return _list;
        return v;
      });
    return _list;
  }

  async deleteList(id) {
    const _id = await TTTiepnhanModel.delete(id);
    if (_id) {
      this.list = this.list.filter((v) => v.id !== id);
    }
    return _id;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new TTTiepnhanStore();
