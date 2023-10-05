import { View, Text, ScrollView } from "react-native";
import React from "react";
import {
  Divider,
  SegmentedButtons,
  RadioButton,
  List,
  Switch,
  Chip,
  TextInput,
} from "react-native-paper";

const SortListings = () => {
  const [value, setValue] = React.useState("");
  return (
    <View className="px-4 py-10 flex-1 content-between gap-y-3">
      <Text>Sort by</Text>
      <View className="flex-row content-evenly flex-wrap gap-2">
        {["Price", "Date posted", "Popularity"].map((label, i) => {
          return (
            <Chip
              key={i}
              mode="flat" //'flat'(default) | 'outlined'
              //avatar= React.ReactNode//when not using icon
              //closeIcon//Icon to display as the close button for the Chip. The icon appears only when the onClose prop is specified.
              //selected=boolean//Whether chip is selected.
              //selectedColor//Whether to style the chip color as selected.
              //showSelectedCheck=boolean//true//shows check icon if icon prop is not provided
              //disabled=boolean//false//Whether the chip is disabled.
              //rippleColor
              //onPress
              //onClose//The close button appears only when this prop is specified.
              //compact//boolean//Sets smaller horizontal paddings 12dp around label, when there is only label.
              // icon="information" //type: IconSource
              //elevated=boolean//false
              //textStyle//Style of chip's text
              //style //Style of chip
              onPress={() => console.log("Pressed")}
            >
              {label}
            </Chip>
          );
        })}
      </View>
      <View className="pb-4 gap-2">
        <Text>Order</Text>
        <RadioButton.Group
          onValueChange={(newValue) => setValue(newValue)}
          value={value}
        >
          <View className="items-start pt-3">
            <View className="flex-row items-center">
              <RadioButton
                //disabled
                //uncheckedColor
                //color//Custom color for radio.
                // status={checked === "first" ? "checked" : "unchecked"}
                // onPress={() => setChecked("first")}
                value="first"
              />
              <Text>Ascending</Text>
            </View>
            <View className="flex-row items-center">
              <RadioButton value="first" />
              <Text>Descending</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>
    </View>
  );
};

export default SortListings;
