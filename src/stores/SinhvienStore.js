import { makeAutoObservable } from "mobx";
import { VideoModel, NamModel, SinhvienModel } from "../models/index";
// import { Themes } from "@utils/index";
import { orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

class SinhvienStore {
  // images = [];
  // favoriteList = [];
  sinhvien = null;
  list = [];
  constructor() {
    makeAutoObservable(this);
  }

  async add(sinhvien) {
    const _sinhvien = await SinhvienModel.add(sinhvien);
    if (_sinhvien) this.sinhvien = [_sinhvien, ...this.sinhvien];
    return _sinhvien;
  }

  async getsinhvien(force = false, queries = [], orders) {
    // cache images
    if (!force && this.sinhvien.length > 0) {
      console.log("getsinhvien:: cached sinhvien");
      return this.sinhvien;
    }
    const _sinhvien = await SinhvienModel.getAll(queries, orders);
    console.log("getLop:: fetch sinhvien", _sinhvien);
    if (_sinhvien) this.sinhvien = _sinhvien;
    return this.sinhvien;
  }

  async getfavoriteList(force = false) {
    // cache favorite images
    if (!force && this.favoriteList.length > 0) {
      console.log("return cached favorite sinhvien", this.favoriteList);
      return this.favoriteList;
    }
    const _queries = [
      { key: "isFavorite", logic: "==", value: true },
      { key: "isActive", logic: "==", value: true },
    ];
    const _orders = [orderBy("updatedAt", "desc")];
    const _list = await SinhvienModel.getAll(_queries, _orders);
    console.log("getfavoriteList", _list);
    if (_list) this.favoriteList = _list;
    return this.favoriteList;
  }

  async updatesinhvien(sinhvien) {
    const _sinhvien = await SinhvienModel.update(sinhvien);
    if (_sinhvien)
      this.sinhvien = this.sinhvien.map((v) => {
        if (v.id === _sinhvien.id) return _sinhvien;
        return v;
      });
    return _sinhvien;
  }

  async deletesinhvien(id) {
    const _id = await SinhvienModel.delete(id);
    if (_id) {
      this.sinhvien = this.sinhvien.filter((v) => v.id !== id);
    }
    return _id;
  }

  async getByEmail(email) {
    const _queries = [{ key: "Email", logic: "==", value: email }];
    console.log("kkkgetbyemail", email);
    const _list = await SinhvienModel.getAll(_queries);
    console.log("kkkk getByEmail sv", _list);
    if (_list?.length > 0) return _list[0];
    return;
  }

  async getByMa(ma) {
    const _queries = [{ key: "Massv", logic: "==", value: ma }];
    console.log("kkkgetbyma", ma);
    const _list = await SinhvienModel.getAll(_queries);
    console.log("kkkk getByMa sv", _list);
    if (_list?.length > 0) return _list[0];
    return;
  }

  async addList(_item) {
    const _list = await SinhvienModel.add(_item);
    if (_list) this.list = [_list, ...this.list];
    return _list;
  }

  async getList(force = false, queries = []) {
    // cache list
    if (!force && this.list.length > 0) {
      console.log("return cached list");
      return this.list;
    }
    const _list = await SinhvienModel.getAll(queries);
    console.log("kkkk getlist Sinhvien", _list);
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
    _list = await SinhvienModel.get(id);
    return _list;
  }

  async updateList(list) {
    const _list = await SinhvienModel.update(list);
    if (_list)
      this.list = this.list.map((v) => {
        if (v.id === _list.id) return _list;
        return v;
      });
    return _list;
  }

  async deleteList(id) {
    const _id = await SinhvienModel.delete(id);
    if (_id) {
      this.list = this.list.filter((v) => v.id !== id);
    }
    return _id;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new SinhvienStore();
