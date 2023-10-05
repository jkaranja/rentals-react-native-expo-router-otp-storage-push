import { TControl } from "@/types/react-hook-form";
import { usePathname } from "expo-router";
import React from "react";
import { Controller } from "react-hook-form";
import { Text, View } from "react-native";
import { RadioButton } from "react-native-paper";


type KitchenProps = {
  control: TControl;
};
const Kitchen = ({ control }: KitchenProps) => {
  const pathname = usePathname();

  const isFilter = pathname === "/filters";

  return (
    <View className="flex flex-row  items-center flex-wrap content-evenly">
      <Controller
        name="kitchen"
        control={control}
        rules={{
         // required: "Username is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <RadioButton.Group onValueChange={onChange} value={value}>
            <View className="flex  flex-row justify-between gap-x-2 items-center flex-wrap content-evenly">
              {isFilter && (
                <View className="flex-row items-center">
                  <RadioButton value="" />
                  <Text>Any</Text>
                </View>
              )}
              <View className="flex-row items-center">
                <RadioButton
                  //disabled
                  //uncheckedColor
                  //color//Custom color for radio.
                  // status={checked === "first" ? "checked" : "unchecked"}
                  // onPress={() => setChecked("first")}
                  value="Closed"
                />
                <Text>Closed plan</Text>
              </View>

              <View className="flex-row items-center">
                <RadioButton value="Open" />
                <Text>Open plan</Text>
              </View>
            </View>
          </RadioButton.Group>
        )}
      />
    </View>
  );
};

export default Kitchen;
