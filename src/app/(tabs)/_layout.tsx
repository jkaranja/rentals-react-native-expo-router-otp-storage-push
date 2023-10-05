import colors from "@/constants/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme } from "@react-navigation/native";
import { Link, Tabs, router } from "expo-router";
import { usePathname } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { Button } from "react-native-paper";

export default function TabLayout() {
  const pathname = usePathname();

  //hide bar from here based on current route/can't hide in sub folders with _layout defined
  //routes where tab bar is hidden
  const hiddenTabBarRoutes = [
    "/listings/post",
    "/view",
    "/inbox/chat",
    "/listings/post/amenities",
    "/listings/post/pics",
    "/view/direction",
 
  ];

  const matches = hiddenTabBarRoutes.includes(pathname);

  return (
    <Tabs
      //screenOptions= {} | ()=> ({})
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "(home)") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "wishlist") {
            iconName = focused ? "heart" : "heart";
          } else if (route.name === "inbox") {
            iconName = focused ? "comment-alt" : "comment-alt";
          } else if (route.name === "profile") {
            iconName = focused ? "user-circle" : "user-circle";
          }

          // You can return any component that you like here!
          return (
            <FontAwesome5
              name={iconName}
              size={size}
              color={focused ? colors.emerald.DEFAULT : colors.gray.DEFAULT}
            />
          );
        },
        tabBarActiveTintColor: colors.emerald.DEFAULT, //Color for the icon and label in the active tab.
        tabBarInactiveTintColor: colors.gray.DEFAULT, //Color for the icon and label in the inactive tabs.
        //tabBarActiveBackgroundColor: "",//Background color for the active tab
        //tabBarInactiveBackgroundColor:"",//
        //tabBarLabelStyle: { fontFamily: "SpaceMono" }, //{ fontSize: 13, fontFamily: "SpaceMono" },
        //tabBarBadge: 'string/number',
        //tabBarBadgeStyle
        //tabBarLabelPosition: below-icon || beside-icon
        //tabBarBackground: ()=> React.Element
        //tabBarIconStyle: { fontSize:  },
        tabBarStyle: {
          backgroundColor: DefaultTheme.colors.card,
          display: matches ? "none" : "flex",
          height: 50,
          paddingTop: 8,
        }, //or add custom height: 50,
        //headerShown: false
        // headerTitleStyle: {color: "#fff"},//must use this to set header title color
        // headerStyle: { backgroundColor: "#10b981" }, //custom  height: 80 of header etc//color won't work
      })}
    >
      {/*Instead of configuring options within the route, you can configure static options outside the route i.e like below:
      This will also order tabs in the order below instead of how the pages are ordered in directory + configure common options here and use Tab.Screen in routes for specific options */}
      <Tabs.Screen
        name="(home)" //must be provided when used as child of layout
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="wishlist" //if layout present name must be name of folder(no path to child). Load index or first route in folder
        options={{
          title: "Wishlist",
        }}
      />
      <Tabs.Screen
        name="inbox" //if no layout, name can be a path to a specific route/page eg 'inbox/index'
        options={{
          title: "Inbox",
        }}
      />
      {/* <Tabs.Screen
        name="inbox/chat"
        options={{
          href: null,
          headerShown: false,
          title: "Chat",
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="auth"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="listings"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
