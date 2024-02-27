import { makeAutoObservable } from "mobx";
import { VideoModel, NamModel, FileModel } from "../models/index";
// import { Themes } from "@utils/index";
import { orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

class NamStore {
  // images = [];
  // favoriteList = [];
  nam = null;
  list = [];
  constructor() {
    makeAutoObservable(this);
  }

  async add(nam) {
    const _nam = await NamModel.add(nam);
    if (_nam) this.nam = [_nam, ...this.nam];
    return _nam;
  }

  async getNam(force = false, queries = [], orders) {
    // cache images
    if (!force && this.nam.length > 0) {
      console.log("getNam:: cached nam");
      return this.nam;
    }
    const _nam = await NamModel.getAll(queries, orders);
    console.log("getNam:: fetch nam", _nam);
    if (_nam) this.nam = _nam;
    return this.nam;
  }

  async getfavoriteList(force = false) {
    // cache favorite images
    if (!force && this.favoriteList.length > 0) {
      console.log("return cached favorite nam", this.favoriteList);
      return this.favoriteList;
    }
    const _queries = [
      { key: "isFavorite", logic: "==", value: true },
      { key: "isActive", logic: "==", value: true },
    ];
    const _orders = [orderBy("updatedAt", "desc")];
    const _list = await NamModel.getAll(_queries, _orders);
    console.log("getfavoriteList", _list);
    if (_list) this.favoriteList = _list;
    return this.favoriteList;
  }

  async updateNam(nam) {
    const _nam = await NamModel.update(nam);
    if (_nam)
      this.nam = this.nam.map((v) => {
        if (v.id === _nam.id) return _nam;
        return v;
      });
    return _nam;
  }

  async deleteNam(id) {
    const _id = await NamModel.delete(id);
    if (_id) {
      this.nam = this.nam.filter((v) => v.id !== id);
    }
    return _id;
  }

  async addList(_item) {
    const _list = await NamModel.add(_item);
    if (_list) this.list = [_list, ...this.list];
    return _list;
  }

  async getList(force = false, queries = []) {
    // cache list
    if (!force && this.list.length > 0) {
      console.log("return cached list");
      return this.list;
    }
    const _list = await NamModel.getAll(queries);
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
    _list = await NamModel.get(id);
    return _list;
  }

  async updateList(list) {
    const _list = await NamModel.update(list);
    if (_list)
      this.list = this.list.map((v) => {
        if (v.id === _list.id) return { ...v, ..._list };
        return v;
      });
    return _list;
  }

  async deleteList(id) {
    const _id = await NamModel.delete(id);
    if (_id) {
      this.list = this.list
        .map((v) => {
          if (v.id === id) {
            FileModel.delete(v.Bieumau?.name, FileModel.BIEUMAU_FOLDER);
            FileModel.delete(v.Decuong?.name, FileModel.DECUONG_FOLDER);
            return null;
          } else {
            return v;
          }
        })
        .filter((_) => !!_);
    }
    return _id;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new NamStore();
