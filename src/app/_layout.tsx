import "expo-dev-client"; //or better err reporting
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as secureStore from "expo-secure-store";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, Tabs } from "expo-router";
import { useEffect, useLayoutEffect, useMemo } from "react";
import { useColorScheme } from "react-native";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectMode, setMode } from "../redux/theme/themeSlice";
import themeSettings from "../config/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { selectCurrentToken, setCredentials } from "@/redux/auth/authSlice";
import Toast from "react-native-toast-message";
import { PaperProvider } from "react-native-paper";
import useNotificationSetup from "@/hooks/useNotificationSetup";
import usePersistAuth from "@/hooks/usePersistAuth";

//Expo Router enables fine-tuned error handling to enable a more opinionated data-loading strategy in the future.
//When ErrorBoundary is not present, the error will be thrown to the nearest parent's ErrorBoundary.
//I will export the error-boundary once in the RootLayout to catch all other routes errors
//You can use the default ErrorBoundary component for a quick UI:
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";
//or export(named export) a custom error-boundary component
// export function ErrorBoundary(props: ErrorBoundaryProps) {
//   return (
//     <View style={{ flex: 1, backgroundColor: "red" }}>
//       <Text>{props.error.message}</Text>
//       <Text onPress={props.retry}>Try Again?</Text>
//     </View>
//   );
// }

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: "(tabs)",
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
//The default behavior is to hide the splash screen when the first route is rendered
//with preventAutoHideAsync is called, then the splash screen will remain visible until the SplashScreen.hideAsync() function has been invoked
//SplashScreen.preventAutoHideAsync();
//use Root/AppLayout
export default function RootLayout() {
  // const [loaded, error] = useFonts({
  //   RobotoRegular: require("../../assets/fonts/Roboto-Regular.ttf"),
  //   ...FontAwesome.font,
  // });

  //usage: style={{fontFamily: "SpaceMono"}}//can also create a custom Text component that has this font by default

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  // useEffect(() => {
  //   if (error) throw error;
  // }, [error]);

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}

function RootLayoutNav() {
  //RN provides 2 ways to get user's appearance preferences eg preferred color scheme (light or dark)
  //1. Using 'Appearance' module, get color scheme: Appearance.getColorScheme(), returns: light | dark | null if user has not set any
  //2. using useColorScheme hook: light | dark | null (null: Follow the system's interface style)
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectMode);
  const token = useAppSelector(selectCurrentToken);

  //handle notifications
  useNotificationSetup();

  //load token from secure store to redux store
  usePersistAuth();

  //set theme auto based on system color scheme or manually on toggle mode
  const theme = useMemo(() => themeSettings(mode), [mode]);
  //set header theme
  useLayoutEffect(() => {
    //set system preference theme
    dispatch(setMode(colorScheme === null ? "light" : colorScheme!));
  }, []);

  return (
    //colorScheme === "dark" ? DarkTheme : DefaultTheme
    <ThemeProvider value={theme}>
      <BottomSheetModalProvider>
        <PaperProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </PaperProvider>
      </BottomSheetModalProvider>

      <Toast
        position="bottom" //top or bottom//default: top
        bottomOffset={20} //Offset from the bottom of the screen (in px)
        //visibilityTime={4000}//default = 4000ms
        //autoHide={true}//default: true
        //type="success|| error || info"//default: success
      />
    </ThemeProvider>
  );
}
