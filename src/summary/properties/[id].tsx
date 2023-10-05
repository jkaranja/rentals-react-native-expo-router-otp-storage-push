import { useGlobalSearchParams, useLocalSearchParams, useNavigation, usePathname, useSegments } from "expo-router";
import { Text } from "react-native";
//Dynamic routes match any unmatched path at a given segment level.
//Routes with higher specificity will be matched before a dynamic route. For example, /blog/bacon will match blog/bacon.js before blog/[id].js.
export default function Page() {
  //Dynamic segments are accessible as search parameters in the page component.
  //Search parameters (also known as query params) are serializable fields that can be added to a URL. They are commonly used to pass data between pages.
  //dynamic routes are rep as query parameters(in the web, there would be query params)
  //Returns the URL search parameters for the contextually selected route.
  const { slug } = useLocalSearchParams();
  //Returns the URL search parameters for the globally selected route
  //vs
  //   useLocalSearchParams: Returns the search parameters for the current component. It only updates when the global URL conforms to the route.
  // useGlobalSearchParams: Returns the global URL regardless of the component. It updates on every search param change and might cause components to update extraneously in the background.
  const { user, extra } = useGlobalSearchParams();
  //Statically-typed Search Parameters
  //Both the useLocalSearchParams and useGlobalSearchParams can be statically typed using a generic:
  const { user: x } = useLocalSearchParams<{ user: string }>();

  //Returns the currently selected route location without search parameters.
  //For example, /acme?foo=bar -> /acme. Segments will be normalized: /[id]?id=normal -> /normal
  const pathname = usePathname();
  ////router.setParams({ id: '123' });//Update the query params for the currently selected route.
  const navigation = useNavigation(); //Access the underlying React Navigation navigation prop//navigation.navigate("explore")

  //Given a function, the useFocusEffect hook will invoke the function whenever the route is "focused".//see react navigation docs
  // useFocusEffect(() => {
  //   console.log("Hello");
  // });
  const segments = useSegments();
  //  Returns a list of segments for the currently selected route. Segments are not normalized so that they will be the same as the file path.
  //For example, /[id]?id=normal -> ["[id]"].

  //const inAuthGroup = segments[0] === "(auth)";

  return <Text>Blog post: {slug}</Text>;
}
