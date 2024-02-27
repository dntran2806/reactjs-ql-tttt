import { makeAutoObservable } from "mobx";
import { VideoModel, NamModel, DangkyModel } from "../models/index";
// import { Themes } from "@utils/index";
import { orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import SinhvienStore from "./SinhvienStore";
import CanboStore from "./CanboStore";

class DangkyStore {
  // images = [];
  // favoriteList = [];
  dangky = null;
  list = [];
  constructor() {
    makeAutoObservable(this);
  }

  async add(dangky) {
    const _dangky = await DangkyModel.add(dangky);
    if (_dangky) this.dangky = [_dangky, ...this.dangky];
    return _dangky;
  }

  async getdangky(force = false, queries = [], orders) {
    // cache images
    if (!force && this.dangky.length > 0) {
      console.log("getlop:: cached dangky");
      return this.dangky;
    }
    const _dangky = await DangkyModel.getAll(queries, orders);
    console.log("getLop:: fetch dangky", _dangky);
    if (_dangky) this.dangky = _dangky;
    return this.dangky;
  }

  async getfavoriteList(force = false) {
    // cache favorite images
    if (!force && this.favoriteList.length > 0) {
      console.log("return cached favorite dangky", this.favoriteList);
      return this.favoriteList;
    }
    const _queries = [
      { key: "isFavorite", logic: "==", value: true },
      { key: "isActive", logic: "==", value: true },
    ];
    const _orders = [orderBy("updatedAt", "desc")];
    const _list = await DangkyModel.getAll(_queries, _orders);
    console.log("getfavoriteList", _list);
    if (_list) this.favoriteList = _list;
    return this.favoriteList;
  }

  async updatedangky(dangky) {
    const _dangky = await DangkyModel.update(dangky);
    if (_dangky)
      this.dangky = this.dangky.map((v) => {
        if (v.id === _dangky.id) return _dangky;
        return v;
      });
    return _dangky;
  }

  async deletedangky(id) {
    const _id = await DangkyModel.delete(id);
    if (_id) {
      this.dangky = this.dangky.filter((v) => v.id !== id);
    }
    return _id;
  }

  async addList(_item) {
    const _list = await DangkyModel.add(_item);
    if (_list) this.list = [_list, ...this.list];
    return _list;
  }

  async getList(force = false, queries = []) {
    // cache list
    if (!force && this.list.length > 0) {
      console.log("return cached list");
      return this.list;
    }
    const _list = await DangkyModel.getAll(queries);
    console.log("kkkk getlist dk", _list);
    const rs = [];
    if (_list) {
      for (let index = 0; index < _list.length; index++) {
        const _item = _list[index];
        const sv = await SinhvienStore.getListById(_item.Sinhvien);
        const cb = await CanboStore.getListById(_item.Canbo);
        rs.push({
          ..._item,
          Massv: sv?.Massv,
          Hoten: sv?.Hoten,
          Tengvhd: cb?.Tencb,
        });
      }
    }
    if (_list && queries.length === 0) this.list = rs;
    return rs;
  }

  async getListById(id) {
    // cache list
    let _list = this.list.find((_) => _.id === id);
    if (_list) {
      console.log("getListById:: cached list");
      return _list;
    }
    _list = await DangkyModel.get(id);
    return _list;
  }

  async updateList(list) {
    const _list = await DangkyModel.update(list);
    if (_list)
      this.list = this.list.map((v) => {
        if (v.id === _list.id) return _list;
        return v;
      });
    return _list;
  }

  async deleteList(id) {
    const _id = await DangkyModel.delete(id);
    if (_id) {
      this.list = this.list.filter((v) => v.id !== id);
    }
    return _id;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new DangkyStore();
