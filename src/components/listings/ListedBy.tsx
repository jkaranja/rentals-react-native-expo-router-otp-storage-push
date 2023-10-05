import { TControl } from "@/types/react-hook-form";
import React from "react";
import { Controller } from "react-hook-form";
import { Text, View } from "react-native";
import {
  RadioButton
} from "react-native-paper";


type ListedByProps = {
  control: TControl;
};
const ListedBy = ({ control }: ListedByProps) => {
  return (
    <View className="">
      <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
        <Controller
          name="listedBy"
          control={control}
          rules={{
           // required: "Username is required",
          }}
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
                    value="Landlord"
                  />
                  <Text>Landlord</Text>
                </View>
                <View className="flex-row items-center">
                  <RadioButton value="Broker" />
                  <Text>Broker</Text>
                </View>
              </View>
            </RadioButton.Group>
          )}
        />
      </View>
    </View>
  );
};

export default ListedBy;
