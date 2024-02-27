import "./App.css";
import AppLayout from "./components/layout/AppLayout";
import DangKy from "./pages/admin/dang-ky";
import Nam from "./pages/admin/nam";
import Doanhnghiep from "./pages/admin/doanh-nghiep";
import { Route, Switch, HashRouter, useHistory } from "react-router-dom";
import Baocao from "./pages/admin/bao-cao";
import Login from "./pages/admin/Login";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import UserLayout from "./components/layout/UserLayout";
import UserPages from "./pages/user/UserPages";
import Lop from "./pages/admin/lop";
import { useEffect, React } from "react";
import {
  NganhModel,
  DonviModel,
  TrangthaiModel,
  SinhvienModel,
  NhomModel,
} from "./models";
import Sinhvien from "./pages/admin/sinh-vien";
import Quytrinhtt from "./pages/admin/quy-trinh-tt";
import Canbo from "./pages/admin/can-bo";
import Error from "./pages/admin/Error";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const history = useHistory();

  // const _goToHome = () => {
  //   history.replace("/");
  // };
  // const auth = getAuth();

  useEffect(() => {
    // addNganhs();
    // addDonvis();
    // addTrangthais();
    // addNhoms();
  }, []);

  const addNganhs = async () => {
    NGANH_DATA.forEach(async (data, index) => {
      const rsad = await NganhModel.add({ ...data, Manganh: index + 1 });
    });
  };

  const addDonvis = async () => {
    DONVI_DATA.forEach(async (data, index) => {
      const rsad = await DonviModel.add({ ...data, Madv: index + 1 });
    });
  };

  const addTrangthais = async () => {
    TRANGTHAI_DATA.forEach(async (data, index) => {
      const rsad = await TrangthaiModel.add({ ...data, Matt: index + 1 });
    });
  };

  const addNhoms = async () => {
    NHOM_DATA.forEach(async (data) => {
      const rsad = await NhomModel.add({ ...data });
    });
  };

  // const addSinhviens = async () => {
  //   SINHVIEN_DATA.forEach(async (data) => {
  //     const rsad = await SinhvienModel.add({ ...data });
  //   });
  // };

  return (
    <div className="App">
      <HashRouter basename="/">
        <Switch>
          <Route
            exact
            path="/bao-cao"
            component={() => (
              <AppLayout>
                <Baocao />
              </AppLayout>
            )}
          />
          <Route path="/signin" exact component={Login} />
          <Route exact path="/" component={Login} />

          {/* <Route path="/reset-password" exact component={Resetpassword} />
        <Route path="/forgot-password" exact component={Forgotpassword} /> */}
          <Route
            exact
            path="/dang-ky"
            component={() => (
              <AppLayout>
                <DangKy />
              </AppLayout>
            )}
          />
          <Route
            exact
            path="/nam"
            component={() => (
              <AppLayout>
                <Nam />
              </AppLayout>
            )}
          />
          <Route
            exact
            path="/lop"
            component={() => (
              <AppLayout>
                <Lop />
              </AppLayout>
            )}
          />
          <Route
            exact
            path="/doanh-nghiep"
            component={() => (
              <AppLayout>
                <Doanhnghiep />
              </AppLayout>
            )}
          />

          <Route
            exact
            path="/UserPages"
            component={() => (
              <UserLayout>
                <UserPages />
              </UserLayout>
            )}
          />
          <Route
            exact
            path="/sinh-vien"
            component={() => (
              <AppLayout>
                <Sinhvien />
              </AppLayout>
            )}
          />
          <Route
            exact
            path="/quy-trinh-tt"
            component={() => (
              <AppLayout>
                <Quytrinhtt />
              </AppLayout>
            )}
          />
          <Route exact path="/khong-co-quyen" component={() => <Error />} />
          <Route
            exact
            path="/can-bo"
            component={() => (
              <AppLayout>
                <Canbo />
              </AppLayout>
            )}
          />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;

const NGANH_DATA = [
  { Tennganh: "Hệ thống thông tin" },
  { Tennganh: "Công nghệ thông tin" },
  { Tennganh: "Kỹ thuật phần mềm" },
  { Tennganh: "Khoa học máy tính" },
];

const DONVI_DATA = [
  { Tendv: "DI" },
  // { Tendv: "CN" },
  // { Tendv: "KT" },
  // { Tendv: "MT" },
];

const TRANGTHAI_DATA = [
  { Tentt: "Đang hoạt động" },
  { Tentt: "Ngừng hoạt động" },
];

const NHOM_DATA = [
  { Nhom: "A1" },
  { Nhom: "A2" },
  { Nhom: "A3" },
  { Nhom: "A4" },
];
