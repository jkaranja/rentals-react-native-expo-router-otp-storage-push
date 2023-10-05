import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, Text, View, Alert } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { TextInput } from "react-native-paper";
import MapViewDirections from "react-native-maps-directions";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { selectOrigin, setOrigin } from "@/redux/maps/navSlice";
import { useSelector } from "react-redux";

const LOCATION_TASK_NAME = "background-location-task";

//implement geofencing-a virtual boundary using task manager
//start location update using task manager

export default function Maps() {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const dispatch = useAppDispatch();

  const origin = useSelector(selectOrigin);

  useEffect(() => {
    (async () => {
      //Access to the location in the foreground happens while an app is open and visible to the user.
      let { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }
      //background location access happens after a user closes the app or uses the home button to return to their main screen
      //if foregroundStatus === "granted", req permission to use location in the background

      /**   const { status: backgroundStatus } =
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
      } */

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation, //highest possible accuracy that uses additional sensor data
      });

      dispatch(
        setOrigin({
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          description: "Current location",
        })
      );
    })();
  }, []);

  //manage long-running tasks//tasks that can run while the app is in the background

  // TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  //   if (error) {
  //     // Error occurred - check `error.message` for more details.
  //     return;
  //   }
  //   if (data) {
  //     //const { locations } = data;
  //     // do something with the locations captured in the background
  //   }
  // });
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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        //Rendering a Map with an initial region
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        //controlling the region as state
        // region={origin || undefined}
        onRegionChange={(region) => {
          dispatch(setOrigin({ location: region })); //region is LatLng & deltas
        }}
        //customMapStyle={mapStyle}//Customizing the map style. Gen mapStyle array at https://mapstyle.withgoogle.com/
        //mapType="" //"hybrid" | "mutedStandard" | "none" | "satellite" | "standard" | "terrain"
      >
        {/** you can also add multiple markers-add origin and destination */}
        {origin && (
          <Marker
            identifier="origin" //An identifier used to reference this marker at a later date.//see mapRef methods .fitTo...
            //Draggable Markers
            draggable
            //onDragEnd={(e) => setMapRegion(e.nativeEvent.coordinate)}
            // key={index}//when looping using map(()=>) for multiple markers
            coordinate={origin.location}
            title="Marker"
            // description={marker.description}
            //image={{uri: 'custom_pin'}}// or local img using {require('../custom_pin.png')} //using image as a custom marker
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 2,
  },
  box: {
    flex: 1,
  },
});
