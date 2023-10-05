import { View, Text, ScrollView } from "react-native";
import React from "react";
import {
  Divider,
  SegmentedButtons,
  RadioButton,
  List,
  Switch,
  Chip,
} from "react-native-paper";

const MoreInfo = () => {
  const [value, setValue] = React.useState("");
  const [checked, setChecked] = React.useState("first");
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return (
    <View className="px-4">
      <List.Item
        title={
          <Text className="text-lg  font-semibold dark:text-gray-light">
            Broker fee
          </Text>
        }
        // description="Item description"
        left={(props) => <List.Icon icon="bathtub-outline" />}
      />

      <View className="pb-4">
        <List.Item
          title={
            <Text className="text-lg  font-semibold dark:text-gray-light">
              Add keywords
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="bathtub-outline" />}
        />

        <View className="flex-row content-evenly flex-wrap gap-2 ">
          {[...Array(8)].map((label, i) => {
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
                {i === 7 ? "8+" : i + 1}
              </Chip>
            );
          })}
        </View>
      </View>
      <Divider />

      <View className="pb-4">
        <List.Item
          title={
            <Text className="text-lg font-semibold dark:text-gray-light">
              Apartments type
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="home-city-outline" />}
        />
        <RadioButton.Group
          onValueChange={(newValue) => setValue(newValue)}
          value={value}
        >
          <View className="flex  flex-row justify-between gap-2 items-center flex-wrap content-evenly">
            <View className="flex-row items-center">
              <RadioButton
                //disabled
                //uncheckedColor
                //color//Custom color for radio.
                // status={checked === "first" ? "checked" : "unchecked"}
                // onPress={() => setChecked("first")}
                value="first"
              />
              <Text>All</Text>
            </View>
            <View className="flex-row items-center">
              <RadioButton value="first" />
              <Text>Rental</Text>
            </View>
            <View className="flex-row items-center">
              <RadioButton value="second" />
              <Text>Hostel</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>

      <List.Item
        title={
          <Text className="text-lg  font-semibold dark:text-gray-light">
            Policies//use dynamic form in a new component//management
          </Text>
        }
        // description="Item description"
        left={(props) => <List.Icon icon="bathtub-outline" />}
      />

      <View className="pb-4">
        <List.Item
          title={
            <Text className="text-lg font-semibold dark:text-gray-light">
              Management
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="desk" />}
        />

        <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
          <Text>Agency only</Text>
          <Switch
            value={isSwitchOn}
            //mode// 'flat'(default) | 'outlined'
            //icon={}
            color=""
            style={{}}
            onValueChange={onToggleSwitch}
          />
        </View>
      </View>
      <Divider />

      <View className="pb-4">
        <List.Item
          title={
            <Text className="text-lg font-semibold dark:text-gray-light">
              Management
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="desk" />}
        />

        <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
          <Text>Agency only</Text>
          <Switch
            value={isSwitchOn}
            //mode// 'flat'(default) | 'outlined'
            //icon={}
            color=""
            style={{}}
            onValueChange={onToggleSwitch}
          />
        </View>
      </View>
      <Divider />

      <View className="pb-4">
        <List.Item
          title={
            <Text className="text-lg font-semibold dark:text-gray-light">
              Apartments type
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="home-city-outline" />}
        />
        <RadioButton.Group
          onValueChange={(newValue) => setValue(newValue)}
          value={value}
        >
          <View className="flex  flex-row justify-between gap-2 items-center flex-wrap content-evenly">
            <View className="flex-row items-center">
              <RadioButton
                //disabled
                //uncheckedColor
                //color//Custom color for radio.
                // status={checked === "first" ? "checked" : "unchecked"}
                // onPress={() => setChecked("first")}
                value="first"
              />
              <Text>All</Text>
            </View>
            <View className="flex-row items-center">
              <RadioButton value="first" />
              <Text>Rental</Text>
            </View>
            <View className="flex-row items-center">
              <RadioButton value="second" />
              <Text>Hostel</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>
    </View>
  );
};

export default MoreInfo;
