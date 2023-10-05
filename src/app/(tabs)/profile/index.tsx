import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SectionList,
} from "react-native";
import React, { useLayoutEffect } from "react";
import {
  Avatar,
  Button,
  Divider,
  List,
  MD3Colors,
  Surface,
} from "react-native-paper";
import {
  Link,
  Tabs,
  router,
  useFocusEffect,
  useNavigation,
  useRouter,
} from "expo-router";
import clsx from "clsx";
import { FontAwesome } from "@expo/vector-icons";
import colors from "@/constants/colors";
import { Pressable } from "react-native";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCurrentToken } from "@/redux/auth/authSlice";
import { useSendLogoutMutation } from "@/redux/auth/authApiSlice";
import { KeyboardAwareSectionList } from "react-native-keyboard-aware-scroll-view";

const SCREENS = [
  {
    title: "Settings",
    data: [
      {
        path: "/profile/account",
        label: "Profile settings",
      },
      {
        path: "/profile/subscription",
        label: "Subscription",
      },
      {
        path: "/profile/earnings",
        label: "Earnings & payouts",
      },
      {
        path: "/profile/notifications",
        label: "Notifications",
      },
    ],
  },
  {
    title: "Support",
    data: [
      {
        path: "/auth/contact",
        label: "Contact us",
      },
    ],
  },
  {
    title: "Legal",
    data: [
      {
        path: "/auth/terms",
        label: "Terms of service",
      },
      {
        path: "/auth/privacy",
        label: "Privacy policy",
      },
    ],
  },
];

const Profile = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [sendLogout, { data, error, isLoading, isError, isSuccess }] =
    useSendLogoutMutation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      tabBarStyle: { display: "none" },
    });
  }, []);

  /**------------------------------
   * Handle Logout
   -------------------------------------*/
  //this calls logOut() to clear token in the store + secure store
  const handleLogout = async () => {
    await sendLogout();
  };

  //feedback
  // useEffect(() => {
  //   //redirect user to home on success
  //   if (isSuccess) navigate("/");

  //   if (isError) toast.error(error as string);

  //   return () => toast.dismiss();
  // }, [isError, isSuccess]);

  return (
    <View className="flex-1 p-4 ">
      <KeyboardAwareSectionList
        //stickyHeaderIndices={[0]}//ListHeaderComponent sticky //An array of child indices determining which children get docked to the top of the screen when scrolling.
        ////StickyHeaderComponent//must use stickyHeaderIndices={[0]}// + other scrollView props eg contentContainerStyle
        //initialNumToRender={10}//default/10//How many items to render in the initial batch.
        //Rendered in between each item, but not at the top or bottom. Type: component | JSX.Element
        //@ts-ignore//accep
        // ItemSeparatorComponent={<List.Subheader>Some title</List.Subheader>}
        ////function/component or React.ReactNode//Rendered at the top of all the items
        // ListHeaderComponent={<View></View>}
        // ListFooterComponent={<View></View>} //function/component or React.ReactNode//rendered bottom of list
        //onRefresh//function// standard RefreshControl will be added for "Pull to Refresh" functionality.
        //refreshing={false}//Set this true while waiting for new data from a refresh.
        //SectionSeparatorComponent//component, element//Rendered at the top and bottom of each section
        //renderSectionHeader//(info: {section: Section}) => element, null//Rendered at the top of each section.
        //stickySectionHeadersEnabled////default: false in android//Makes section headers stick to the top of the screen until the next one pushes it off.
        //renderSectionFooter//(info: {section: Section}) => element, null//Rendered at the bottom of each section.
        ListHeaderComponent={
          <View>
            <List.Item
              //descriptionStyle={{}}
              // descriptionNumberOfLines={2} //default 2
              // onPress={() => {}}
              titleStyle={{}}
              title={<Text className="text-lg font-semibold">Mark Walter</Text>}
              description={
                <Text className="text-sm text-gray-muted dark:text-gray-muted">
                  Profile
                </Text>
              } // string | React.ReactNode
              left={() => (
                <Avatar.Icon
                  size={60}
                  icon="account"
                  color="#10b981"
                  style={{ backgroundColor: "#e2e8f0" }}
                />
              )}
              right={() => (
                <FontAwesome name="angle-right" size={25} color="black" />
              )}
            />
            <View className="flex-row justify-between gap-y-2  flex-wrap content-evenly py-2">
              <Pressable
                style={styles.surface}
                onPress={() => router.push("/listings/post")}
                className="h-[110] bg-white rounded-md py-2 items-center justify-evenly basis-[49%] "
              >
                <FontAwesome
                  name="plus"
                  size={30}
                  color={colors.emerald.DEFAULT}
                />
                <Text className="font-semibold">Add a listing</Text>
                <Text className="text-sm text-gray-muted dark:text-gray-muted ">
                  List a vacant house
                </Text>
              </Pressable>
              <Pressable
                style={styles.surface}
                onPress={() => router.push("/listings/active")}
                className="h-[110] bg-white rounded-md py-2 items-center justify-evenly basis-[49%] "
              >
                <FontAwesome
                  name="building-o"
                  size={30}
                  color={colors.emerald.DEFAULT}
                />
                <Text className="font-semibold">My listings</Text>
                <Text className="text-sm text-gray-muted dark:text-gray-muted">
                  All my listings
                </Text>
              </Pressable>
            </View>
          </View>
        }
        sections={SCREENS}
        keyExtractor={(item, index) => item.path}
        renderItem={({ item }) => (
          <View>
            <List.Item
              onPress={() => router.push(item.path)}
              title={
                <Text className="text-md text-md  dark:text-gray-light">
                  {item.label}
                </Text>
              }
              left={() => (
                <List.Icon
                  //color//color for the icon
                  //style
                  // {...props}//inherit styling props from list.item
                  icon={({ size, color }) => {
                    let icon: any;
                    if (item.path === "account") icon = "user-circle-o";
                    if (item.path === "notifications") icon = "bell-o";
                    if (item.path === "privacy") icon = "list-ul";
                    if (item.path === "terms") icon = "list-alt";
                    if (item.path === "settings") icon = "gear";

                    if (item.path === "contact") icon = "envelope-o";
                    if (item.path === "privacy") icon = "list-ul";
                    if (item.path === "terms") icon = "list-alt";

                    if (item.path === "billing") icon = "plus-square-o";

                    return <FontAwesome name={icon} size={20} color="black" />;
                  }}
                />
              )}
              right={() => (
                <List.Icon
                  icon={() => (
                    <FontAwesome name="angle-right" size={24} color="black" />
                  )}
                />
              )}
            />
            <Divider className="dark:bg-gray-muted" />
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <List.Subheader className="text-lg font-bold px-0">
            {title}
          </List.Subheader>
        )}
        ListFooterComponent={
          <View className="py-3 flex-row ">
            <Button onPress={handleLogout}>Log out</Button>
          </View>
        }
      />

      <Text>Version 2.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  surface: {
    shadowColor: "#667085",
    //in android
    elevation: 10,
    //in ios
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default Profile;
