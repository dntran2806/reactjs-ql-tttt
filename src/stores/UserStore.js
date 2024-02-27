import { makeAutoObservable } from "mobx";
import { USER_INFO } from "../utils/Constants";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import UserModel from "../models/UserModel";
import CanboStore from "./CanboStore";
import { isEmailGV, isEmailSV } from "../utils/Common";

class UserStore {
  userInfo = null;
  congViecHienTai = {};
  constructor() {
    makeAutoObservable(this);
  }
  setUserInfo(user) {
    this.userInfo = user;
  }

  async loadUserInfo() {
    console.log("startloaduserinfo");
    const _user = localStorage.getItem(USER_INFO);
    console.log("kkk _userinfo", _user);
    if (_user) {
      const parseUser = JSON.parse(_user);
      console.log("kkkparseUser", parseUser);
      let rs = await UserModel.get(parseUser.uid);
      if (isEmailGV(rs.email)) {
        const _gv = await CanboStore.getByEmail(rs.email);
        console.log("kkkkk loadUserInfo _gv", _gv);
        if (_gv && _gv.Vaitro !== rs.role) {
          rs.role = _gv.Vaitro;
          await this.update({ ...rs, role: _gv.Vaitro });
        }
        localStorage.setItem(
          USER_INFO,
          JSON.stringify({ uid: rs.uid, role: rs.role })
        );
      }
      if (!this.userInfo) this.userInfo = rs;
    }
    return this.userInfo;
  }

  async getByEmail(email) {
    const _queries = [{ key: "email", logic: "==", value: email }];
    console.log("kkk UserStore getByEmail", email);
    const _users = await UserModel.getAll(_queries);
    console.log("kkkk UserStore getByEmail user", _users);
    if (_users?.length > 0) return _users[0];
    return;
  }

  async update(user) {
    const _user = await UserModel.update(user);
    console.log("kkkk UserStore update", _user);
    return _user;
  }

  setCongViecHienTai(cvht) {
    this.congViecHienTai = cvht;
  }
  isSignedIn() {
    const _user = localStorage.getItem(USER_INFO);
    return _user;
  }

  async logout() {
    localStorage.removeItem(USER_INFO);
    this.userInfo = null;
    try {
      const auth = getAuth();
      await signOut(auth);
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  async googleLogin(cb) {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google user logged in:", user);
      if (!user.email.includes("ctu.edu.vn")) {
        return;
      }
      await this.onLoginSuccess({ ...user, provider: "google" }, cb);
      return user;
      // Handle successful Google login
    } catch (error) {
      console.error("Error signing in with Google:", error);
      cb?.();
      return;
      // Handle Google login error
    }
  }

  async onLoginSuccess(user, cb) {
    let role = "";
    let _gv = null;
    if (isEmailSV(user.email)) {
      role = "sv";
    }
    if (isEmailGV(user.email)) {
      _gv = await CanboStore.getByEmail(user.email);
      console.log("kkkkk _gv", _gv);
      role = _gv?.Vaitro || "gv";
    }
    const _data = {
      accessToken: user.accessToken,
      displayName: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      providerId: user.providerId,
      uid: user.uid,
      id: user.uid,
      provider: user.provider,
      role: role,
    };
    let _user = await UserModel.get(user.uid);
    console.log("kkkkk check user existed", _user);
    if (!_user) {
      _user = await UserModel.add(_data);
      this.userInfo = _user;
    } else {
      if (isEmailGV(_user.email)) {
        _gv = await CanboStore.getByEmail(_user.email);
        if (_gv && _gv.Vaitro !== _user.role) {
          _user = await this.update({ ..._user, role: _gv.Vaitro });
        }
      }
    }
    if (_user) {
      this.userInfo = _user;
      localStorage.setItem(
        USER_INFO,
        JSON.stringify({ uid: _user.uid, role: _user.role })
      );
    }
    console.log("kkkkk add user", _user);
    cb?.(_user);
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UserStore();
