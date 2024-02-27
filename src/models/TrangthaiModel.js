import { collection } from "firebase/firestore";
import Model from "./Model";

class Trangthai extends Model {
  constructor() {
    super();
    const _collection = collection(this.firestore, "trangthai");
    this._setCollection(_collection);
  }

  getAll = async (queries = [], orders) => {
    return await this._getAll(queries, orders);
  };

  get = async (id) => {
    return await this._get(id);
  };

  add = async ({ Matt = "", Tentt = "" }) => {
    const _data = {
      Matt,
      Tentt,
    };
    return await this._add(_data);
  };

  update = async ({ id, ...data }) => {
    return await this._update({ id, ...data });
  };

  delete = async (id) => {
    return await this._delete(id);
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Trangthai();
