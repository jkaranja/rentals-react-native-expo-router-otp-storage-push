import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { TextInput } from "react-native-paper";
import MapViewDirections from "react-native-maps-directions";

const LOCATION_TASK_NAME = "background-location-task";

//implement geofencing-a virtual boundary using task manager
//start location update using task manager

//expo-location=> A library that provides access to reading geolocation information, polling current location or subscribing location update events from the device.
//use it to request current location permission, get current location, or get updates when location changes
export default function Maps() {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922, //adds precision to latitude//optional
    longitudeDelta: 0.0421, //adds precision to longitude//optional
  });

  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      //Access to the location in the foreground happens while an app is open and visible to the user.
      let { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      //background location access happens after a user closes the app or uses the home button to return to their main screen
      //if foregroundStatus === "granted", req permission to use location in the background
      //NOTE: MUST Add isAndroidBackgroundLocationEnabled in app.json file and rebuild app to use this option
      //see expo-location package docs in expo docs
      //else warning: unhandled promise rejection. You need to add 'ACCESS_BACKGROUND_LOCATION to the AndroidManifest.xml
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === "granted") {
        //start taking location updates and register a task
        //Registers for receiving location updates that can also come when the app is in the background.
        //expo-location uses expo-task-manager under the hood to register/unregister tasks
        ////apart from location,the expo-background-fetch (fetches data in the bg) also uses this module under the hood
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
        });
        //call await Location.stopLocationUpdatesAsync(taskName)//Stops geofencing for specified task. It unregisters the background task. No need to call TaskManager.unregisterTaskAsync(taskName). It will be called under the hood
        //GEO-FENCiNG/boundary
        //await Location.startGeofencingAsync(taskName, regions)
        //regions: {identifier: string, latitude: number, longitude: number, notifyOnEnter: true/default//call the task on enter, notifyOnExit: true/default//call the task if the device exits the region, radius: number//region's outer boundary}[]
        //await Location.stopGeofencingAsync(taskName)//Stops geofencing for specified task. It unregisters the background task so the app will not be receiving any updates
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation, //highest possible accuracy that uses additional sensor data
      });
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  //manage long-running tasks//tasks that can run while the app is in the background

  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      // Error occurred - check `error.message` for more details.
      return;
    }
    if (data) {
      //const { locations } = data;
      // do something with the locations captured in the background
    }
  });
  //use: TaskManager.unregisterAllTasksAsync() to unregister all tasks//call this when the user is signing out and you no longer need to track his location or run any other background tasks.
  //or unregister specific task TaskManager.unregisterTaskAsync(taskName)

  //google auto complete optional methods
  useEffect(() => {
    //ref.current?.setAddressText("Some Text");//set the value of TextInput
    //ref.current?.focus()//makes the TextInput focus//blur()= remove focus//clear()=>clear text
    //const current = ref.current?.getCurrentLocation()//makes a query to find nearby places based on current location
  }, []);

  //react-native-maps methods//zoom in markers
  //  useEffect(() => {
  //  if(!origin || !destination) return
  // //zoom & fit to markers
  //mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {edgePadding: {top: 50, left: 50, bottom: 50, right: 50}});

  //  }, [origin, destination]);

  //hit google api to get timestamps from description
  useEffect(() => {
    if (!origin || !destination) return;
    const getTravelTime = async () => {
      fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?
units-imperial&origins=${origin.description}&destinations=$
{destination.description}&key=${GOOGLE_MAPS_APIKEY}`)
        .then((res) => res.json())
        .then((data) => {
          //dispatch(setTravelTimeInformation(data.rows[0].elements[0]));//{distance: {text: "470 mi", value: 756340}, duration: {text: "8 hours 7 mins", value: 29240"}
        });
    };
    getTravelTime();
  }, [origin, destination, GOOGLE_MAPS_APIKEY]);

  return (
    <View style={styles.container}>
      <MapView
        //props: https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md
        //userInterfaceStyle	'light' | 'dark'		Sets the map to the style selected.
        //
        ref={mapRef}
        style={styles.map}
        //onMapReady//Callback that is called once the map is fully loaded.
        //onRegionChange={(region)=>}//Callback that is called continuously when the region changes, such as when a user is dragging the map.
        //showsUserLocation	Boolean	false	If true the users location will be shown on the map. NOTE: You need runtime location permissions prior to setting this to true, otherwise it is going to fail silently!
        //showsMyLocationButton	Boolean	true	If false hide the button to move map to the current user's location.
        //showsTraffic	Boolean	false	A Boolean value indicating whether the map displays traffic information.
        //onUserLocationChange	{ coordinate: Location }//Callback that is called when the underlying map figures our users current location//Make sure showsUserLocation is set to true.
        //onLongPress	{ coordinate: LatLng, position: Point }	Callback that is called when user makes a "long press" somewhere on the map.
        //onPress{ coordinate: LatLng, position: Point }	Callback that is called when user taps on the map.
        //onMarkerPress//Callback that is called when a marker on the map is tapped by the user.
        //onDoublePress	{ coordinate: LatLng, position: Point }	Callback that is called when user double taps on the map.
        //onMarkerDrag	{ coordinate: LatLng, position: Point }	Callback called continuously as a marker is dragged
        //Rendering a Map with an initial region////map will zoom in the region
        // initialRegion={{
        //   latitude: 37.78825,
        //   longitude: -122.4324,
        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.0421,
        // }}
        //controlling the region as state////map will zoom in the region
        region={mapRegion}
        onRegionChange={(region) => setMapRegion(region)}
        //customMapStyle={mapStyle}//Customizing the map style. Gen mapStyle array at https://mapstyle.withgoogle.com/
        //mapType="" //"hybrid" | "mutedStandard" | "none" | "satellite" | "standard" | "terrain"
      >
        {/** you can also add multiple markers-add origin and destination */}
        <Marker
          identifier="origin" //An identifier used to reference this marker at a later date.//see mapRef methods .fitTo...
          //Draggable Markers
          draggable
          onDragEnd={(e) => setMapRegion(e.nativeEvent.coordinate)}
          // key={index}//when looping using map(()=>) for multiple markers
          coordinate={mapRegion}
          title="Marker"
          // description={marker.description}
          //image={{uri: 'custom_pin'}}// or local img using {require('../custom_pin.png')} //using image as a custom marker
        />
        {/**other overlays to select a region
         *supported overlays <Circle />, <Polygon />, and <Polyline />
         *
         */}

        {/**Directions component for react-native-maps – Draws a route between two coordinates. Once the directions in between destination and origin has been fetched, a MapView.Polyline between the two will be drawn. Whenever one of both changes, new directions will be fetched and rendered.  */}
        <MapViewDirections
          //origin={origin}//The origin location to start routing from//can be object| address|place_id| or Coordinates in the form of a string with latitude and longitude values separated by a comma
          /// destination={destination}// The destination location to start routing to
          // apikey={GOOGLE_MAPS_APIKEY}//Your Google Maps Directions API Key
          //precision="low"//default// Setting to "high" may cause a hit in performance
          //timePrecision="none"//default | "now"//The timePrecision to get Realtime traffic info.
          //mode="DRIVING"/default | "BICYCLING", "WALKING", and "TRANSIT"  //Which transportation mode to use when calculating directions.
          //language="en"	//The language to use when calculating directions.
          //waypoints=[]//Array of waypoints to use between origin and destination.
          strokeWidth={3} //The stroke width to use for the path.
          strokeColor="hotpink" //The stroke color to use for the path.
          optimizeWaypoints={true}
          onStart={(params) => {
            //Callback that is called when the routing has started.
            console.log(
              `Started routing between "${params.origin}" and "${params.destination}"`
            );
          }}
          onReady={(result) => {
            //Callback that is called when the routing has succesfully finished.
            console.log(`Distance: ${result.distance} km`);
            console.log(`Duration: ${result.duration} min.`);

            // this.mapView.fitToCoordinates(result.coordinates, {
            //   edgePadding: {
            //     right: width / 20,
            //     bottom: height / 20,
            //     left: width / 20,
            //     top: height / 20,
            //   },
            // });
          }}
          onError={(errorMessage) => {
            //Callback that is called in case the routing has failed.
            // console.log('GOT AN ERROR');
          }}
          //tappable={false}//default//allow a polyline to be tappable and use the onPress function.
          //onPress//Callback that is called when the user presses on the polyline
          //..NOTE: this overlay support all polyline props except coordinates-> react-native-maps Component API
        />
      </MapView>

      <Text>{text}</Text>

      <GooglePlacesAutocomplete
        ref={ref}
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: "YOUR API KEY",
          language: "en",
          components: "country:us", //limit results to one country
        }}
        // currentLocation={true}//default false
        // currentLocationLabel="Current location"
        //#use custom Text Input component
        textInputProps={{
          InputComp: TextInput,
          leftIcon: { type: "font-awesome", name: "chevron-left" },
          errorStyle: { color: "red" },
          //...pass other props for the TextInput component
        }}
        //autoFocus={false}
        //debounce={400}//debounce the requests (in ms)//default 0
        //disableScroll//boolean//	disable scroll on the results list
        minLength={2} //	number//	minimum length of text to trigger a search//default	0
        onPress={(data, details = null) => {
          //dispatch(setOrigin({
          //location: details.geometry.location,//lat: 333, lng: -000
          //address: details.formatted_address
          //description: data.description
          //}))
        }} //runs after a suggestion is pressed
        //renderLeftButton//function to render component on the left of input
        //renderRightButton//function to render component to the right side of the Text Input
        //textInputProps//object//define props for the textInput, or provide a custom input component//you can then pass props to it//see above
        enablePoweredByContainer={false} //boolean	show "powered by Google" at the bottom of the search results list//default	true
        //nearbyPlacesAPI=""'none' | 'GooglePlacesSearch'(default) | 'GoogleReverseGeocoding'//which API to use for current location
        fetchDetails={true} //get more place details about the selected option from the Place Details API//default false
        //returnKeyType="search" //	the return key text//default "search"
        styles={{
          //base container for textInputContainer+TextInput
          container: { flex: 0 }, //*IMPORTANT-make it zero else results not showing//default is 1
          //container for TextInput
          textInputContainer: {
            backgroundColor: "grey",
          },
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
