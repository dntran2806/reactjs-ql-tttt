import { collection } from "firebase/firestore";
import Model from "./Model";

class Quytrinhtt extends Model {
  constructor() {
    super();
    const _collection = collection(this.firestore, "quytrinh");
    this._setCollection(_collection);
  }

  getAll = async (queries = [], orders) => {
    return await this._getAll(queries, orders);
  };

  get = async (id) => {
    return await this._get(id);
  };

  add = async ({ Maqt = "", Tieude = "", Noidung = "" }) => {
    const _data = {
      Maqt,
      Tieude,
      Noidung,
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
export default new Quytrinhtt();
