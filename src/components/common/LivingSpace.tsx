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

const LivingSpace = () => {
  const [value, setValue] = React.useState("");
  const [checked, setChecked] = React.useState("first");
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return (
    <View className="px-4">
      <List.Item
        title={
          <Text className="text-lg  font-semibold dark:text-gray-light">
            Listed By//owner or broker//Im a owner/broker
          </Text>
        }
        // description="Item description"
        left={(props) => <List.Icon icon="bathtub-outline" />}
      />
      {/* <View className="py-4">
        <ScrollView>
          <SegmentedButtons
            value={value}
            // density="" //Type: 'regular' | 'small' | 'medium' | 'high'
            //style
            onValueChange={setValue}
            buttons={[
              {
                value: "walk", //value of button (required)
                label: "Walking", //text of btn
                // disabled: whether the button is disabled
                // accessibilityLabel: acccessibility label for the button. This is read by the screen reader when the user taps the button.
                // checkedColor: custom color for checked Text and Icon
                // uncheckedColor: custom color for unchecked Text and Icon
                // onPress: callback that is called when button is pressed
                // label: label text of the button
                // showSelectedCheck: show optional check icon to indicate selected state
                // style: pass additional styles for the button
              },
              {
                value: "train",
                label: "Transit",
              },
              { value: "drive", label: "Driving" },
            ]}
          />
        </ScrollView>
      </View> */}

      <View className="pb-4">
        <List.Item
          title={
            <Text className="text-lg  font-semibold dark:text-gray-light">
              Bedrooms
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="bed-outline" />}
        /> 
        <View className="flex-row content-evenly flex-wrap gap-2 ">
          {[...Array(5)].map((label, i) => {
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
                //onClose//Function to execute on close button press.//The close button appears only when this prop is specified.
                //compact//boolean//Sets smaller horizontal paddings 12dp around label, when there is only label.
                // icon="information" //type: IconSource
                //elevated=boolean//false
                //textStyle//Style of chip's text
                //style //Style of chip
                onPress={() => console.log("Pressed")}
              >
                {i === 0 ? "single" : i === 4 ? "5+" : i}
              </Chip>
            );
          })}
        </View>
      </View>
      <Divider />

      <View className="pb-4">
        <List.Item
          title={
            <Text className="text-lg  font-semibold dark:text-gray-light">
              Bathrooms
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="bathtub-outline" />}
        />

        <View className="flex-row content-evenly flex-wrap gap-2 ">
          {[...Array(3)].map((label, i) => {
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
                {i === 2 ? "3+" : i + 1}
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
              Kitchen
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="desk" />}
        />

        <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
          <Text>
            Open plan//open/open concept (not separate from living room)
          </Text>
          <Switch
            value={isSwitchOn}
            //mode// 'flat'(default) | 'outlined'
            //icon={}
            color=""
            style={{}}
            onValueChange={onToggleSwitch}
          />
          <Text>Closed plan (separate from living room)</Text>
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

export default LivingSpace;
