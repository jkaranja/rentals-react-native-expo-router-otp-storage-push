import colors from "@/constants/colors";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

const themeSettings = (mode: string) => {
  return {
    dark: mode === "light",
    ...(mode === "dark"
      ? {
          colors: {
            ...DarkTheme.colors, //not need/we're changing all color options
            primary: colors.emerald.DEFAULT, //brand color//not sure
            background: colors.gray.darker, //screen bg
            card: colors.gray.dark, //headers bg/tabs bg
            text: colors.gray.light, //text color like header text
            border: colors.gray.divider, //header border, tab bar border
            notification: colors.emerald.DEFAULT, //badge color
          },
        }
      : {
          colors: {
            ...DefaultTheme.colors,
            primary: colors.emerald.DEFAULT,
            background: colors.gray.bg, //screen bg
            //card: colors.emerald.DEFAULT, //brand//headers/tabs//use headerStyle in options/screenOptions/setOptions
            //text: colors.gray.darker, //text color
            // border: "#fff", //header border, tab bar border//keep default
            notification: colors.emerald.DEFAULT, //badge color
          },
        }),
  };
};

export default themeSettings;
