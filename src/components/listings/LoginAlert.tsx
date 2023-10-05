import { View, Text } from "react-native";
import React from "react";
import AlertDialog from "../common/AlertDialog";
import { Button } from "react-native-paper";
import { router } from "expo-router";

type LoginAlertProps = {
  visible: boolean;
  handleClose: () => void;
};

const LoginAlert = ({ visible, handleClose }: LoginAlertProps) => {
  return (
    <AlertDialog visible={visible} handleClose={handleClose}>
      <View className="grow">
        <Text className="  text-lg mb-2">Log in to manage your wishlist</Text>
        <Text className="text-gray-muted text-md mb-3">
          You can add or remove items from your wishlists
        </Text>
        <Button
          className="bg-emerald"
          // icon="google" //any MaterialCommunityIcons icon name//see https://icons.expo.fyi/Index
          mode="contained"
          onPress={() => {
            router.push("/auth/login");
            //handleClose()
          }}
          uppercase //boolean//Make the label text uppercased
        >
          Log in
        </Button>
      </View>
    </AlertDialog>
  );
};

export default LoginAlert;
