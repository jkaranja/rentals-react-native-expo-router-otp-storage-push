import { Tabs } from "expo-router/tabs";
export default function AppLayout() {
  return (
    <Tabs
    //the Tab.Navigator screenOptions from react navigation
      screenOptions={
        {
          // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          ////headerShown: false
        }
        //or pass a callbacks function
    //     ({ route }) => ({
    //     tabBarIcon: ({ focused, color, size }) => {
    //       let iconName;

    //       if (route.name === "Home") {
    //         iconName = focused ? "home" : "home";
    //       } else if (route.name === "Services") {
    //         iconName = focused ? "border-none" : "border-none";
    //       } else if (route.name === "Activity") {
    //         iconName = focused ? "tasks" : "tasks";
    //       } else if (route.name === "Account") {
    //         iconName = focused ? "user-alt" : "user-alt";
    //       }

    //       // You can return any component that you like here!
    //       return (
    //         <FontAwesome5
    //           name={iconName}
    //           size={size}
    //           color={focused ? "#10b981" : "rgb(102, 112, 133)"}
    //         />
    //       );
    //     },
    //     tabBarActiveTintColor: "#10b981", //Color for the icon and label in the active tab.
    //     tabBarInactiveTintColor: "#667085", //Color for the icon and label in the inactive tabs.
    //     //tabBarActiveBackgroundColor: "",//Background color for the active tab
    //     //tabBarInactiveBackgroundColor:"",//
    //     // tabBarLabelStyle: { fontSize: 13 },
    //     //tabBarBadge: 'string/number',
    //     //tabBarBadgeStyle
    //     //tabBarLabelPosition: below-icon || beside-icon
    //     //tabBarBackground: ()=> React.Element
    //     //tabBarIconStyle: { },
    //     tabBarStyle: { backgroundColor: DefaultTheme.colors.card }, //or add custom height: 50,
    //     //headerShown: false
    //     // headerTitleStyle: {color: "#fff"},//must use this to set header title color
    //     // headerStyle: { backgroundColor: "#10b981" }, //custom  height: 80 of header etc//color won't work
    //   })
      }
    >
      <Tabs.Screen
        // Name of the route to configure.
        name="index"
        // Name of the dynamic route.
        // name="[user]"
        options={{
          // This tab will no longer show up in the tab bar.//hide tab
          href: null,
          // Dynamic routes:
          // Ensure the tab always links to the same href.
          // href: '/evanbacon',
          // OR you can use the Href object:
          //   href: {
          //     pathname: "/[user]",
          //     params: {
          //       user: "evanbacon",
          //     },
          //   },
          //other usual options
          //   title: 'Tab One',//this sets both header title and tab label
          //   tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          //   headerRight: () =>
          ////headerShown: false
        }}
      />
    </Tabs>
  );
}
