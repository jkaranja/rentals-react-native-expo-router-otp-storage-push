import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";

import colors from "@/constants/colors";
import { useAppSelector } from "@/hooks/useAppSelector";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";

import { useAppDispatch } from "@/hooks/useAppDispatch";

import * as Location from "expo-location";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { ILocation } from "@/types/listing";
import { selectDraftListing } from "@/redux/listings/draft/draftSlice";

//// navigator or window.navigator interface return identity of user agent/device
//navigator.geolocation: Returns a Geolocation object allowing accessing the location of the device.
//@ts-ignore//needed for accessing current location by google-places-autocomplete
navigator.geolocation = require("react-native-geolocation-service");

type LocationPickerProps = {
  setLocation: React.Dispatch<React.SetStateAction<ILocation>>;
} & Record<string, any>;

const LocationPicker = ({ setLocation, ...props }: LocationPickerProps) => {
  const dispatch = useAppDispatch();
  const placesRef = useRef<GooglePlacesAutocompleteRef>(null);

  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  const draft = useAppSelector(selectDraftListing);

  useEffect(() => {
    (async () => {
      //Access to the location in the foreground happens while an app is open and visible to the user.
      let { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        return;
      }
      setIsPermissionGranted(true);

      //background location access happens after a user closes the app or uses the home button to return to their main screen
      //if foregroundStatus === "granted", req permission to use location in the background
      // const { status: backgroundStatus } =
      //   await Location.requestBackgroundPermissionsAsync();
      // if (backgroundStatus !== "granted") {
      //   return; //current location option will be hidden
      // }
      // setIsPermissionGranted(true); //show current location
    })();
  }, []);

  //google auto complete optional methods
  useEffect(() => {
    placesRef.current?.setAddressText(draft.location?.description || ""); //set the value of TextInput
    //placeRef.current?.focus()//makes the TextInput focus//blur()= remove focus//clear()=>clear text
    //const current = placeRef.current?.getCurrentLocation()//makes a query to find nearby places based on current location
  }, []);

  return (
    <View>
      <GooglePlacesAutocomplete
        ref={placesRef}
        placeholder="Search"
        query={{
          key: process.env.EXPO_PUBLIC_MAPS_API_KEY,
          language: "en",
          components: "country:ke", //limit results to one country
        }}
        //keepResultsAfterBlur={true}
        // currentLocation={isPermissionGranted} //default false//only enable this is permission is granted
        currentLocationLabel="Current location"
        //#use custom Text Input component
        // textInputProps={{
        //   InputComp: Searchbar,
        //   leftIcon: { type: "font-awesome", name: "chevron-left" },
        //   errorStyle: { color: "red" },
        //   //...pass other props for the TextInput component
        // }}
        //autoFocus={false}
        //debounce={400}//debounce the requests (in ms)//default 0
        //disableScroll//boolean//	disable scroll on the results list
        minLength={2} //	number//	minimum length of text to trigger a search//default	0
        //onPress runs after a suggestion is pressed
        onPress={(data, details) => {
          // 'details' is provided when fetchDetails = true
          if (details) {
            setLocation({
              coordinate: {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              },
              description: data.description,
            });
          }
        }}
        //renderLeftButton//function to render component on the left of input
        //renderRightButton//function to render component to the right side of the Text Input
        renderRightButton={() => (
          <IconButton
            icon={({ size, color }) => (
              // <Entypo name="flow-parallel" size={size} color={color} />
              <FontAwesome name="map-marker" size={20} color="black" />
            )}
            iconColor={colors.gray.dark}
            mode="outlined"
            containerColor="#fff"
            size={10}
            // onPress={() => handleSnapPress()}
            //rippleColor={colors.emerald.DEFAULT}
            style={{ borderColor: colors.gray.light }}
          />
        )}
        //textInputProps//object//define props for the textInput, or provide a custom input component//you can then pass props to it//see above
        enablePoweredByContainer={false} //boolean	show "powered by Google" at the bottom of the search results list//default	true
        //nearbyPlacesAPI=""'none' | 'GooglePlacesSearch'(default) | 'GoogleReverseGeocoding(must enable Google Maps Geocoding API)'//which API to use for current location
        fetchDetails={true} //get more place details about the selected option from the Place Details API//default false
        //returnKeyType="search" //	the return key text//default "search"
        styles={{
          //base container for textInputContainer+TextInput
          container: { flex: 0 }, //*IMPORTANT-make it zero else results not showing//default is 1
          //container for TextInput
          textInputContainer: {
            // backgroundColor: "red",
            borderWidth: 1,
            borderColor: "#5d5d5d",
            borderRadius: 5,
          },
          //textInput is inside textInputContainer
          textInput: {
            height: 38,
            color: "#5d5d5d",
            fontSize: 16,
            // borderWidth: 1,
            // borderColor: "#5d5d5d",
            marginBottom: 0,
          },
          predefinedPlacesDescription: {
            color: "#1faadb", //eg current location
          },
          //   separator: { height: 0.5, backgroundColor: "#c8c7cc" }, //default styles
          // loader: {
          //   flexDirection: "row",
          //   justifyContent: "flex-end",
          //   height: 20,
          // },
        }}
      />

      {/* <Searchbar
        placeholder="Search location"
        onChangeText={onChangeSearch}
        value={searchQuery}
        //mode="'bar' | 'view'"//bar default//must be bar for icons to work
        //icon="" | require() | {{uri: ""}} | ()=>React.ReactNode//left icon button
        iconColor={colors.gray.dark}
        //onIconPress//Callback to execute if we want the left icon to act as button.
        //traileringIcon="" | require() | {{uri: ""}} | ()=>React.ReactNode//Icon name for the right trailering icon button. Works only when mode is set to "bar".
        //onTraileringIconPress//Callback to execute on the right trailering icon button press.
        //traileringIconColor//Custom color for the right trailering icon,
        //right//Callback which returns a React element to display on the right side.
        right={() => (
          <View className="">
            <IconButton
              icon={({ size, color }) => (
                // <Entypo name="flow-parallel" size={size} color={color} />
                <FontAwesome name="map-marker" size={20} color="black" />
              )}
              iconColor={colors.gray.dark}
              mode="outlined"
              containerColor="#fff"
              size={18}
              // onPress={() => handleSnapPress()}
              //rippleColor={colors.emerald.DEFAULT}
              style={{ borderColor: colors.gray.light }}
            />
          </View>
        )}
        //showDivider//default=true//Whether to show Divider at the bottom of the search. mode must be view
        elevation={1} //default 0//Changes Searchbar shadow and background
        //inputStyle={{ color: "red" }} //Set style of the TextInput component inside the searchbar
        style={{ backgroundColor: "#fff" }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    shadowColor: "#667085",
    //in android
    elevation: 10,
    //in ios
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  floatingBtn: {},
});

export default LocationPicker;
