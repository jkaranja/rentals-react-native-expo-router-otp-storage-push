import { Drawer } from "expo-router/drawer";
import { useNavigation } from "expo-router";
export default function Layout() {
  //Access the underlying React Navigation navigation prop to imperatively access layout-specific functionality like navigation.openDrawer() in a Drawer layout.
  const navigation = useNavigation();
  //eg

  //To open and close drawer, use the following helpers:
 // navigation.openDrawer();
 // navigation.closeDrawer();
  //navigation.toggleDrawer();

  return (
    <Drawer
      screenOptions={
        {
          //...Default options to use for the screens
          //accepts same props as options in screens//see below
        }
      }
    >
      <Drawer.Screen
        name="explore"
        options={{
          //title
          //drawerLabel: ({ focused: boolean, color: string })=>React.ReactNode//to display in drawer sidebar//else title
          //drawerIcon: ({ focused: boolean, color: string)=>React.ReactNode//to display in drawer sidebar
          //drawerActiveTintColor//Color for the icon and label in the active item in the drawer.
          //drawerActiveBackgroundColor//Background color for the active item in the drawer.
          //drawerInactiveTintColor//Color for the icon and label in the inactive items in the drawer.
          //drawerInactiveBackgroundColor//Background color for the inactive items in the drawer.
          //drawerLabelStyle//Style object to apply to the Text style inside content section which renders a label.
          //drawerContentContainerStyle//Style object for the content section inside the ScrollView.
          //drawerContentStyle//Style object for the wrapper view.
          //drawerStyle//Style object for the drawer component. You can pass a custom background color for a drawer or a custom width here.
          //drawerPosition//Options are left or right. Defaults to left for LTR languages and right for RTL languages.
          //drawerType//It determines how the drawer looks and animates.//default is slide on iOS and front on android(front|back|slide|permanent->always shown/good for larger screens)
          //##header related options// options to use for the screens in the drawer
          // https://reactnavigation.org/docs/headers#setting-the-header-title
          title: "My home", //title: params.name,
          //headerBackTitle: "Back",
          ////headerShown: false
          // https://reactnavigation.org/docs/headers#adjusting-header-styles
          headerStyle: { backgroundColor: "#f4511e" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            //style properties for the title
            fontWeight: "bold",
          },
          // https://reactnavigation.org/docs/headers#replacing-the-title-with-a-custom-component
          //headerTitle: (props) => <LogoTitle {...props} />,
          //   headerRight: () => (
          //     <Button
          //       onPress={() => setCount((c) => c + 1)}
          //       title="Update count"
          //     />
          //   ),
          //headerLeft: () => React.ReactNode
          //   headerTransparent: true,
          //   headerBackground: () => (
          //     <BlurView/>/use expo-blur module//blurs everything underneath the view.
          //       tint="light"
          //       intensity={100}
          //       style={StyleSheet.absoluteFill}
          //     />
          //   ),
          //other options: https://reactnavigation.org/docs/elements#header
        }}
      />
      <Drawer.Screen name="properties" />
    </Drawer>
  );
}
