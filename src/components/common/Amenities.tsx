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

const Amenities = () => {
  const [value, setValue] = React.useState("");
  const [checked, setChecked] = React.useState("first");
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return (
    <View className="px-4">
      <View className="pb-4">
        <List.Item
          title={
            <Text className="text-lg font-semibold dark:text-gray-light">
              Water availability
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="trash-can-outline" />}
        />

        <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
          <Text>Available: </Text>
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
                <Text>24/7</Text>
              </View>
              <View className="flex-row items-center">
                <RadioButton value="first" />
                <Text>Few days a week</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>

        <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
          <Text>Borehole </Text>
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
            <Text className="text-lg  font-semibold dark:text-gray-light">
              Parking
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="car-outline" />}
        />

        <View className="flex-row content-evenly flex-wrap gap-2 ">
          <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
            <Text>Available</Text>
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
      </View>
      <Divider />

      <View className="pb-4">
        <List.Item
          title={
            <Text className="text-lg  font-semibold dark:text-gray-light">
              Wifi
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="car-outline" />}
        />

        <View className="flex-row content-evenly flex-wrap gap-2 ">
          <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
            <Text>Available</Text>
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
      </View>
      <Divider />

      <View className="pb-4">
        <List.Item
          title={
            <Text className="text-lg  font-semibold dark:text-gray-light">
              Security
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="cctv" />}
        />

        <View className=" gap-2 ">
          <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
            <Text>Watchman</Text>
            <Switch
              value={isSwitchOn}
              //mode// 'flat'(default) | 'outlined'
              //icon={}
              color=""
              style={{}}
              onValueChange={onToggleSwitch}
            />
          </View>
          <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
            <Text>CCTV</Text>
            <Switch
              value={isSwitchOn}
              //mode// 'flat'(default) | 'outlined'
              //icon={}
              color=""
              style={{}}
              onValueChange={onToggleSwitch}
            />
          </View>
          <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
            <Text>Security lights</Text>
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
      </View>
      <Divider />

      <View className="pb-4">
        <List.Item
          title={
            <Text className="text-lg font-semibold dark:text-gray-light">
              Garbage collection
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="trash-can-outline" />}
        />

        <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
          <Text>Available</Text>
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
            <Text className="text-lg  font-semibold dark:text-gray-light">
              Gym
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="weight-lifter" />}
        />

        <View className="flex-row content-evenly flex-wrap gap-2 ">
          <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
            <Text>Available</Text>
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
      </View>
      <Divider />

      <View className="pb-4">
        <List.Item
          title={
            <Text className="text-lg  font-semibold dark:text-gray-light">
              Swimming pool
            </Text>
          }
          // description="Item description"
          left={(props) => <List.Icon icon="pool" />}
        />

        <View className="flex-row content-evenly flex-wrap gap-2 ">
          <View className="flex flex-row gap-2 items-center flex-wrap content-evenly">
            <Text>Available</Text>
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
      </View>
      <Divider />
    </View>
  );
};

export default Amenities;
