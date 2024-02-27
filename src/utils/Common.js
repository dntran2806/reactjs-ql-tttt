import moment from "moment";
export const resetObject = (obj) => {
  const rs = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] instanceof Array) rs[key] = [];
    else rs[key] = "";
  });
  return rs;
};
export const toDateString = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const sendEmail = (subject = "", body = "", to = []) => {
  const mailtoLink = `mailto:${to.join(",")}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  // Open the default mail app
  window.location.href = mailtoLink;
};

export const isEmailSV = (email) => {
  return email.includes("@student.ctu.edu.vn");
};

export const isEmailGV = (email) => {
  return email.includes("@cit.ctu.edu.vn") || email.includes("@ctu.edu.vn");
};
