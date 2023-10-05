
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { useEffect, useRef } from "react";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  StyleSheet,
  View
} from "react-native";
//// navigator or window.navigator interface return identity of user agent/device
//navigator.geolocation: Returns a Geolocation object allowing accessing the location of the device.
//@ts-ignore//needed for accessing current location by google-places-autocomplete
navigator.geolocation = require("react-native-geolocation-service");

const Location = () => {
  const dispatch = useAppDispatch();
  const ref = useRef(null);
  //google auto complete optional methods
  useEffect(() => {
    //ref.current?.setAddressText("Some Text");//set the value of TextInput
    //ref.current?.focus()//makes the TextInput focus//blur()= remove focus//clear()=>clear text
    //const current = ref.current?.getCurrentLocation()//makes a query to find nearby places based on current location
  }, []);

  const homePlace = {
    description: "Home",
    geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
  };
  const workPlace = {
    description: "Work",
    geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
  };

  return (
    <View>
      <GooglePlacesAutocomplete
        //ensure you
        //keyboardShouldPersistTaps="always"//results are displayed in a FlatList->this is a ScrollView/FlatList Option//'always' =>the scroll view will not catch taps, but children of the scroll view can catch taps//must add keyboardShouldPersistTaps={"handled"} to all parent/ancestor scrollView or /flat/section list
        ref={ref}
        placeholder="Search"
        query={{
          key: process.env.EXPO_PUBLIC_MAPS_API_KEY,
          // language: "en",
          // components: "country:us", //limit results to one country: ke=>kenya
        }}
        //isRowScrollable//enable/disable horizontal scrolling of a list result//default:true
        //inbetweenCompo//React.ReactNode	Insert a ReactNode in between the search bar and the search results Flatlist
        //keepResultsAfterBlur//show list of results after blur//default:false
        //keyboardShouldPersistTaps='always'//default: 'always'//Determines when the keyboard should stay visible after a tap//
        //predefinedPlaces={[homePlace, workPlace]}//see var above//Allows you to show pre-defined places (e.g. home, work)
        ////predefinedPlacesAlwaysVisible	boolean	Shows predefined places at the top of the search results//default: false
        currentLocation={true} //default false//// Will add a 'Current location' button at the top of the predefined places list
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
        //returns when after a suggestion is selected
        onPress={(data, details = null) => {
          //you can also use the Place Photos API to request place related photos using reference id/place_id=>in both data/details
          // 'details' is provided when fetchDetails = true
          //the data object also has photos array for people near the location entered
          console.log(details, data);

          // if (details) {
          //   dispatch(
          //     setDestination({
          //       location: {
          //         latitude: details.geometry.location.lat,
          //         longitude: details.geometry.location.lng,
          //         latitudeDelta: 0.005,
          //         longitudeDelta: 0.005,
          //       }, //lat: 333, lng: -000
          //       // address: details.formatted_address
          //       description: data.description,
          //     })
          //   );
          // }
        }} //runs after a suggestion is pressed
        //renderLeftButton//function to render component on the left of input
        //renderRightButton//function to render component to the right side of the Text Input
        //textInputProps//object//define props for the textInput, or provide a custom input component//you can then pass props to it//see above
        enablePoweredByContainer={false} //boolean	show "powered by Google" at the bottom of the search results list//default	true
        //nearbyPlacesAPI=""'none' | 'GooglePlacesSearch'(default) | 'GoogleReverseGeocoding(must enable Google Maps Geocoding API)'//which API to use for current location
        fetchDetails={true} //get more place details about the selected option from the Place Details API//default false
        //returnKeyType="search" //	the return key text//default "search"
        //onFail	function	returns if an unspecified error comes back from the API
        //suppressDefaultStyles//removes all default styling from the library//false
        //onNotFound	function	returns if the Google Places Details API returns a 'not found' code (when you press a suggestion).
        //listUnderlayColor//underlay color of the list result when pressed//default: '#c8c7cc'
        styles={{
          textInputContainer: {
            backgroundColor: "grey",
          },
          container: { flex: 0 }, //*IMPORTANT-make it zero else results not showing//default is 1
          textInput: {
            height: 38,
            color: "#5d5d5d",
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: "#1faadb",
          },
          separator: { height: 0.5, backgroundColor: "#c8c7cc" }, //default styles
          loader: {
            flexDirection: "row",
            justifyContent: "flex-end",
            height: 20,
          }, //default styles
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

export default Location;
