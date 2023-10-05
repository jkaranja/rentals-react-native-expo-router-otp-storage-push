import colors from "@/constants/colors";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCurrentToken } from "@/redux/auth/authSlice";
import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme } from "@react-navigation/native";
import { Link, Slot, Stack, Tabs, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, useColorScheme, View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ListingsLayout() {

const insets = useSafeAreaInsets();
 const token = useAppSelector(selectCurrentToken);

 if (!token)
   return (
     <View className="flex-1 px-4 py-8 bg-white">
       <Text className="text-gray-dark font-bold text-lg mb-2">
         Log in to manage your listings
       </Text>
       <Text className="text-gray-muted text-md mb-3">
         You can add or remove items from your wishlist
       </Text>
       <Button
         className="bg-emerald"
         // icon="google" //any MaterialCommunityIcons icon name//see https://icons.expo.fyi/Index
         mode="contained"
         onPress={() => router.push("/login")}
         uppercase //boolean//Make the label text uppercased
         //labelStyle={{fontSize: 20}}  //Style for the button text.
         style={{ width: "30%", borderRadius: 5 }} //not fontSize
       >
         Log in
       </Button>
     </View>
   );

  
  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      {/**'auto', 'inverted', 'light', 'dark' */}
      <StatusBar style="dark" backgroundColor="#fff" />

      <Slot />
    </View>
    // <Stack>
    //   <Stack.Screen
    //     name="post"
    //     options={{
    //       title: "Post listing",
    //       headerTitleStyle: {
    //         //style properties for the title
    //         fontSize: 18,
    //       },
    //       headerRight: () => (
    //         <Button
    //           onPress={() => router.push("/")}
    //           className="rounded-md bg-red "
    //           icon="exit-to-app"
    //           mode="contained"
    //           compact
    //           // onPress={() => handleSnapPress(filter)}
    //           //uppercase //boolean//Make the label text uppercased
    //           labelStyle={
    //             {
    //               fontSize: 13,
    //               marginVertical: 8,
    //             }
    //           } //Style for the button text.
    //           //style={{ width: "100%" }}
    //         >
    //          Exit
    //         </Button>
    //       ),
    //     }}
    //   />
    //   <Stack.Screen
    //     name="index"
    //     options={{
    //       title: "My listings",
    //       //headerShown: false,
    //       headerStyle: {
    //         //style object that will be applied to the View that wraps the header
    //         backgroundColor: "#fff",
    //       },
    //       headerBackground: () => <View />,
    //       // headerTitleStyle: {
    //       //   //style properties for the title
    //       //   color: colors.gray.darker,
    //       // },

    //       headerRight: () => (
    //         <Button
    //           onPress={() => router.push("/listings/post/")}
    //           className="rounded-md "
    //           icon="plus"
    //           //mode="contained"
    //           compact
    //           // onPress={() => handleSnapPress(filter)}
    //           //uppercase //boolean//Make the label text uppercased
    //           labelStyle={
    //             {
    //               //fontSize: 13,
    //               // marginVertical: 8,
    //             }
    //           } //Style for the button text.
    //           //style={{ width: "100%" }}
    //         >
    //           Post new
    //         </Button>
    //       ),
    //     }}
    //   />

    //   <Tabs.Screen
    //     name="view/index"
    //     options={{
    //       title: "Listing details(#id 2)",
    //     }}
    //   />

    //   <Tabs.Screen
    //     name="update"
    //     options={{
    //       title: "Update listing(#id 2)",
    //     }}
    //   />
    // </Stack>
  );
}
