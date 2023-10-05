import colors from "@/constants/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme } from "@react-navigation/native";
import { Link, Slot, Stack, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

export default function HomeLayout() {



  
  return (<Slot />
    // <Stack>
    //   <Stack.Screen
    //     name="index"
    //     options={{
    //       title: "Home", //not visible with header not shown
    //       headerShown: false,
    //       // headerStyle: {
    //       //   //style object that will be applied to the View that wraps the header
    //       //   backgroundColor: "#fff",
    //       // },
    //       // headerTitleStyle: {
    //       //   //style properties for the title
    //       //   color: colors.gray.darker,
    //       // },
    //     }}
    //   />

    //   <Stack.Screen
    //     name="maps"
    //     options={{ title: "Location", presentation: "modal" }}
    //   />

    //   <Stack.Screen
    //     name="filters"
    //     options={{ title: "Filters", presentation: "modal" }}
    //   />

    //   <Tabs.Screen
    //     name="view/index"
    //     options={{
    //       title: "Listing details(#id 2)",
    //       headerShown: false,
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="view/direction"
    //     options={{
    //       title: "Direction",
    //     }}
    //   />
    // </Stack>
  );
}
