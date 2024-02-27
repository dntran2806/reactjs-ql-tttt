import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import firebaseConfig from "../firebase-configs.json";
import { getAuth, signInAnonymously } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig || {});
const analytics = getAnalytics(app);

class Firebase {
  instance() {
    return app;
  }

  anonymousSignIn = async () => {
    try {
      const auth = getAuth();
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      console.log("Anonymous user signed in:", user.uid);
      return user;
    } catch (error) {
      console.error("Anonymous sign-in failed:", error);
      return null;
    }
  };

  logEvent = async (screenName) => {
    console.log("kkkkk logEvent", screenName);
    if (process.env.NODE_ENV === "production") {
      logEvent(analytics, screenName, { page_path: screenName });
    }
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Firebase();
