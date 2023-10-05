import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { router } from "expo-router";

//this will match b4 [id]/ [...rest]
export default function Page() {
  //navigate programmatically or imperatively(outside of react)
  //router.push("/")//Navigate to a route. You can provide a full path like /profile/settings or a relative path like ../settings. Navigate to dynamic routes by passing an object like { pathname: 'profile', params: { id: '123' } }.
  //with params
  router.push({ pathname: "/account/settings", params: { user: "jane" } });
  
  router.replace("/login"); //as push but replaces the current route in the history instead of pushing a new one.
  //router.setParams({ id: '123' });//Update the query params for the currently selected route.
  //router.back()//Navigate back to previous route.
  //router.canGoBack()//Returns true if a valid history stack exists eg const isPresented = router.canGoBack();, {!isPresented && <Link href="../">Dismiss</Link>}//If can't go back, go to root(when context is lost eg after reload in web)
  return (
    <View>
      <Text>Home page</Text>
      {/* href can be a full path(root is app dir) like /profile/settings or a relative path like ../settings//you can ignore or pass route groups in the path */}
      <Link href="/about">About</Link>
      {/* Buttons//Link child must support onClick/onPress//it will receive the onPress event from Link */}
      <Link href="/other" asChild>
        <Pressable>
          <Text>Home</Text>
        </Pressable>
      </Link>
      {/* Linking to dynamic routes */}
      {/* <Link
        replace // replace current screen instead of pushing//can't go back to it
        href={{
          pathname: "/user/[id]", // full path like /profile/settings or a relative path like ../settings
          params: { id: "bacon" },
        }}
      >
        View user
      </Link> */}
    </View>
  );
}
