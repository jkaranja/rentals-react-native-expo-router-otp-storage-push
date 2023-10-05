import { Slot, Stack } from "expo-router";

//create a Stack layout with two screens//stack/tab/drawers are added to the _layout file
//the stack component will handle rendering the current child route(no need for Slot)
////child routes are routes/pages in the same directory as _layout//the routes could be a single route/page or a route group or nested route
export default function HomeLayout() {//or StackLayout
  //Use the screenOptions prop to configure the header bar.
  //if you are not passing any options config ahead of time, use <Stack screenOptions={{...}} /> self closing

  //You can use the <Stack.Screen name={routeName} /> component in the layout component route to statically configure screen options. 
  //This is useful for tab bars or drawers which need to have an icon defined ahead of time.
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        ////headerShown: false
        ////headerMode: "screen" | "float" //default: "screen"
      }}
    >
      {/*Instead of configuring options within the route(see Rentals), you can configure static options outside the route. //name prop must be provided when used as child of layout */}
      <Stack.Screen name="home" options={{}} />
      {/* render modal and tabs as a screen->first screen is tabs */}
      {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ 
        //// Set the presentation mode to modal for our modal route.//open: <Link href="/modal">Present modal</Link>
        //// <Link href="/home">Dismiss</Link>}//se `../` as a simple way to navigate to the root.//or use btn onPress .goBack()
        presentation: "modal" }} 
        
        /> */}
    </Stack>
  );
}
