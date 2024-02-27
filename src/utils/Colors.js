import { theme } from "antd/lib";

const { defaultSeed } = theme;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...defaultSeed,
  primary: defaultSeed.blue,
  backgroundColor: "white",
  bgTransparent: "rgba(255, 255, 255, 0.8)",
  transparent: "transparent",
  red: defaultSeed.red,
  orange: defaultSeed.orange,
  green: defaultSeed.green,
  black: "black",
};
