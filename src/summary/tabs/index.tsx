import { View, Text } from "react-native";
import { Redirect } from "expo-router";

//You can redirect a request to a different URL based on some in-app criteria.
export default function Page() {
  //   const { user } = useAuth();

  //   if (!user) {
  //     //You can immediately redirect from a particular screen by using the Redirect component:
  //     return <Redirect href="/login" />;
  //   }

  //#You can also redirect imperatively with the useRouter hook:
  //   const router = useRouter();
  //   useFocusEffect(() => {
  //     // Call the replace method to redirect to a new route without adding to the history.
  //     // We do this in a useFocusEffect to ensure the redirect happens every time the screen
  //     // is focused.
  //     router.replace("/profile/settings");
  //   });

  return (
    <View>
      <Text>Welcome Back!</Text>
    </View>
  );
}
