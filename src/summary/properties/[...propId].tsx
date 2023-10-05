import { Text } from "react-native";
//Dynamic routes
//Multiple slugs can be matched in a single route by using the rest syntax
//[...rest] this is a catch all segment in next.js
export default function Page() {
  return <Text>Home page</Text>;
}
