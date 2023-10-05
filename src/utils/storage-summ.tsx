// //expo-secure-store usage//provide a way to encrypt and securely store key–value pairs locally on the device. stores sensitive data eg tokens, password etc
// //size limit= 2kb//you will get a warning or error is limit is reached

// import * as SecureStore from "expo-secure-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";


// await SecureStore.setItemAsync(key, value); //store key
// await SecureStore.getItemAsync(key); //get/retrieve value for given key// return string | null
// await SecureStore.deleteItemAsync(key); //delete

// //Async Storage to store non sensitive data eg preferences. Async Storage(in RN) === localStorage in web
// // provides an asynchronous, unencrypted, key-value store
// await AsyncStorage.setItem("my-key", value); //value must be a string  //can only store string data
// await AsyncStorage.setItem("my-key", JSON.stringify(value)); //to store an object, stringify and parse it when retrieving
// await AsyncStorage.getItem("my-key"); //get/Reading = value || null
// await AsyncStorage.removeItem("MyApp_key"); //remove
