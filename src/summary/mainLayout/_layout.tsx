import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

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

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
//The default behavior is to hide the splash screen when the first route is rendered
//with preventAutoHideAsync is called, then the splash screen will remain visible until the SplashScreen.hideAsync() function has been invoked
SplashScreen.preventAutoHideAsync();
//use Root/AppLayout
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  //usage: style={{fontFamily: "SpaceMono"}}//can also create a custom Text component that has this font by default

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}
