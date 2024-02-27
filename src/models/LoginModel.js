import { collection } from "firebase/firestore";
import Model from "./Model";

class Login extends Model {
  constructor() {
    super();
    const _collection = collection(this.firestore, "taikhoan");
    this._setCollection(_collection);
  }

  getAll = async (queries = [], orders) => {
    return await this._getAll(queries, orders);
  };

  get = async (id) => {
    return await this._get(id);
  };

  add = async ({ Matk = "", Tentk = "", Matkhau = "", Quyen = "" }) => {
    const _data = {
      Matk,
      Tentk,
      Matkhau,
      Quyen,
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
export default new Login();
