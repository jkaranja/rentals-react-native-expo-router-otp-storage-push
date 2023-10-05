import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
const LogoTitle = () => (
  <Image
    style={{ width: 50, height: 50 }}
    source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
  />
);

//You can use a layout's Screen component to configure the header bar dynamically from within the route.
//pass the options prop
export default function Rentals() {
  //You can use the imperative API router.setParams() function to configure the route dynamically.
  const router = useRouter();
  const params = useLocalSearchParams();
  return (
    <View>
      {" "}
      <Stack.Screen
      //don't add name prop here = error
        options={{
          // https://reactnavigation.org/docs/headers#setting-the-header-title
          title: "My home", //title: params.name,
          //headerBackTitle: "Back",
          ////headerShown: false
          // https://reactnavigation.org/docs/headers#adjusting-header-styles
            headerStyle: {//style object that will be applied to the View that wraps the header
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",//the back button and title both use this property as their color
            headerTitleStyle: {//style properties for the title
              fontWeight: "bold",
            },
          // https://reactnavigation.org/docs/headers#replacing-the-title-with-a-custom-component
          // headerTitle: (props) => <LogoTitle {...props} />,
          //   headerRight: () => (
          //     <Button
          //       onPress={() => setCount((c) => c + 1)}
          //       title="Update count"
          //     />
          //   ),
          //headerLeft: () => React.ReactNode
          //headerTransparent: true,
          //headerBackground: () => (
          //     <BlurView/>/use expo-blur module//blurs everything underneath the view.
          //       tint="light"
          //       intensity={100}
          //       style={StyleSheet.absoluteFill}
          //     />
          //   ),
          //other options: https://reactnavigation.org/docs/elements#header
        }}
      />
      <Text>Home Screen</Text>
      {/* <Link href={{ pathname: "details", params: { name: "Bacon" } }}>
        Go to Details
      </Link> */}
      <Text
        onPress={() => {
          router.setParams({ name: "Updated" });
        }}
      >
        Update the title
      </Text>
    </View>
  );
}
