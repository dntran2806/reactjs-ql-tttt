import { Firebase } from "../utils/index";
import { getFirestore, serverTimestamp, increment } from "firebase/firestore";
import {
  query,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  where,
  orderBy,
} from "firebase/firestore";

class Model {
  constructor() {
    this.firebase = Firebase.instance();
    this.firestore = getFirestore(this.firebase);
  }

  _setCollection(_collection) {
    this.collection = _collection;
  }

  _increment(num = 1) {
    return increment(num);
  }

  _decrement(num = 1) {
    return increment(-num);
  }

  _timestamp() {
    return serverTimestamp();
  }

  _getAddFields() {
    return {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  }

  _getUpdateFields() {
    return {
      updatedAt: serverTimestamp(),
    };
  }

  _getAll = async (queries = [], orders = [orderBy("createdAt", "desc")]) => {
    try {
      const _queries = queries.map((q) => where(q.key, q.logic, q.value));
      const myQuery = query(this.collection, ..._queries, ...orders);
      const snapshots = await getDocs(myQuery);
      const data = snapshots.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      return data;
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  };

  _get = async (id) => {
    try {
      const documentRef = doc(this.collection, id);
      const documentSnapshot = await getDoc(documentRef);
      if (documentSnapshot.exists()) {
        const documentData = documentSnapshot.data();
        return { id, ...documentData };
      } else {
        // Document does not exist
        console.log("Model:_get:: Document not found", id);
        return null;
      }
    } catch (error) {
      console.error("Model:_get:: Error getting document:", error);
      return null;
    }
  };

  _add = async (data = {}) => {
    try {
      const _data = {
        ...data,
        ...this._getAddFields(),
      };
      let docRef = {};
      if (data.id) {
        docRef = doc(this.collection, data.id);
        await setDoc(docRef, data);
      } else {
        docRef = await addDoc(this.collection, _data);
      }
      console.log("Document written with:", { id: docRef.id, ..._data });
      return { id: docRef.id, ..._data };
    } catch (error) {
      console.error("Error adding document:", error);
      return null;
    }
  };

  _update = async ({ id, ...data }) => {
    try {
      const documentRef = doc(this.collection, id);
      const _data = { ...data, ...this._getUpdateFields() };
      console.log("kkkk updatfile", id, _data);
      const rs = await updateDoc(documentRef, _data);
      console.log("Document updated successfully!", rs);
      return { id, ..._data };
    } catch (error) {
      console.error("Error updating document:", error);
      return null;
    }
  };

  _delete = async (id) => {
    try {
      const documentRef = doc(this.collection, id);
      await deleteDoc(documentRef);
      console.log("Document deleted successfully.");
      return id;
    } catch (error) {
      console.error("Error deleting document: ", error);
      return null;
    }
  };
}

export default Model;
