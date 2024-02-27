import { makeAutoObservable } from "mobx";
import { QuytrinhttModel } from "../models/index";
// import { Themes } from "@utils/index";
import { orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

class Quytrinhtt {
  // images = [];
  // favoriteList = [];
  quytrinh = null;
  list = [];
  constructor() {
    makeAutoObservable(this);
  }

  async addList(_item) {
    const _list = await QuytrinhttModel.add(_item);
    if (_list) this.list = [_list, ...this.list];
    return _list;
  }

  async getList(force = false, queries = []) {
    // cache list
    if (!force && this.list.length > 0) {
      console.log("return cached list");
      return this.list;
    }
    const _list = await QuytrinhttModel.getAll(queries);
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
    _list = await QuytrinhttModel.get(id);
    return _list;
  }

  async updateList(list) {
    const _list = await QuytrinhttModel.update(list);
    if (_list)
      this.list = this.list.map((v) => {
        if (v.id === _list.id) return _list;
        return v;
      });
    return _list;
  }

  async deleteList(id) {
    const _id = await QuytrinhttModel.delete(id);
    if (_id) {
      this.list = this.list.filter((v) => v.id !== id);
    }
    return _id;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Quytrinhtt();
