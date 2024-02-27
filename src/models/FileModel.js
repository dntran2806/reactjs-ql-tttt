import { Firebase } from "../utils/index";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

class FileModel {
  constructor() {
    this.firebase = Firebase.instance();
    this.fireStorage = getStorage(this.firebase);
    this.DECUONG_FOLDER = "decuong";
    this.BIEUMAU_FOLDER = "bieumau";
    this.FILES_FOLDER = "files";
  }

  async upload(file, folder = this.FILES_FOLDER) {
    try {
      const fileNam = uuidv4() + "." + this.getFileExtension(file.name);
      const storageRef = ref(this.fireStorage, `${folder}/${fileNam}`);

      const rs = await uploadBytes(storageRef, file);
      console.log("kkkrs", rs);
      const { fullPath, name, size, timeCreated, updated } = rs.metadata;
      return { fullPath, name, size, timeCreated, updated, oname: file.name };
    } catch (error) {
      console.log("kkk upload error", error);
      return;
    }
  }

  async delete(fileNam, folder = this.FILES_FOLDER) {
    try {
      const storageRef = ref(this.fireStorage, `${folder}/${fileNam}`);

      const rs = await deleteObject(storageRef);
      console.log("kkkkk FileModel delete", fileNam);
      return;
    } catch (error) {
      console.log("kkkkk FileModel delete error", error);
      return;
    }
  }

  async getURL(fullPath) {
    if (!fullPath) {
      return;
    }
    try {
      const fileRef = ref(this.fireStorage, fullPath); // Provide the path to your file
      const url = await getDownloadURL(fileRef);
      console.log("kkkDownloadURL", url);
      return url;
    } catch (error) {
      console.log("kkkgetURL error", error);
      return;
    }
  }

  downloadFile(fileUrl) {
    // console.log("kkk downloadFile", fileName);
    // Tạo một thẻ a (liên kết) ẩn
    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);

    // Đặt thuộc tính href của thẻ a bằng URL của tệp
    a.href = fileUrl;

    // Đặt thuộc tính download để đặt tên tệp tải về
    // a.download = fileName;

    // Kích hoạt sự kiện click để bắt đầu tải tệp
    a.click();

    // Loại bỏ thẻ a sau khi đã tải xong
    document.body.removeChild(a);
  }

  getFileExtension(fileName) {
    // Tách tên tệp thành các phần bằng dấu chấm (.)
    const parts = fileName.split(".");

    // Lấy phần tử cuối cùng trong mảng (là đuôi tệp)
    const extension = parts[parts.length - 1];

    return extension;
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new FileModel();
