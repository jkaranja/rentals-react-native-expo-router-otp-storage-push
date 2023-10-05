import React from "react";
import { Text, View } from "react-native";
import { RadioButton } from "react-native-paper";

import { TControl } from "@/types/react-hook-form";
import { Controller } from "react-hook-form";

type ManagementProps = {
  control: TControl;
};
const Management = ({ control }: ManagementProps) => {
  return (
    <View className="">
      <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
        <Controller
          name="management"
          control={control}
          rules={
            {
              // required: "Username is required",
            }
          }
          render={({ field: { onChange, onBlur, value } }) => (
            <RadioButton.Group onValueChange={onChange} value={value}>
              <View className="flex  flex-row justify-between gap-x-2 items-center flex-wrap content-evenly">
                <View className="flex-row items-center">
                  <RadioButton
                    //disabled
                    //uncheckedColor
                    //color//Custom color for radio.
                    // status={checked === "first" ? "checked" : "unchecked"}
                    // onPress={() => setChecked("first")}
                    value="Agency"
                  />
                  <Text>Agency</Text>
                </View>
                <View className="flex-row items-center">
                  <RadioButton value="Landlord" />
                  <Text>Landlord</Text>
                </View>
              </View>
            </RadioButton.Group>
          )}
        />
      </View>
    </View>
  );
};

export default Management;
