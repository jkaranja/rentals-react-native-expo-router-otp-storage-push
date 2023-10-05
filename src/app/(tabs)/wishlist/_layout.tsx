import colors from "@/constants/colors";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCurrentToken } from "@/redux/auth/authSlice";
import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme } from "@react-navigation/native";
import { Link, Slot, Stack, Tabs, router } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { FlatList, Text, View, useWindowDimensions } from "react-native";
import { Button } from "react-native-paper";

export default function WishlistLayout() {
  const token = useAppSelector(selectCurrentToken);

 

  if (!token)
    return (
      <View className="flex-1 px-4 py-8 bg-white">
        <Text className="text-gray-dark font-bold text-lg mb-2">
          Log in to manage your wishlists
        </Text>
        <Text className="text-gray-muted text-md mb-3">
          You can add or remove items from your wishlist
        </Text>
        <Button
          className="bg-emerald"
          // icon="google" //any MaterialCommunityIcons icon name//see https://icons.expo.fyi/Index
          mode="contained"
          onPress={() => router.push("/login")}
          uppercase //boolean//Make the label text uppercased
          //labelStyle={{fontSize: 20}}  //Style for the button text.
          style={{ width: "30%", borderRadius: 5 }} //not fontSize
        >
          Log in
        </Button>
      </View>
    );

  return <Slot />;
}
