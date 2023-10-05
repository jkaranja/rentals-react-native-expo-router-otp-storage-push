import { Slot } from "expo-router";

//This is using layout routes used to persist shared elements like headers and tab bars between pages. 
//export a REct component  as default
// Slot will render the current child route//like the children prop
//child routes are routes/pages in the same directory as _layout
//Expo Router supports adding a single layout route for a given directory.
// If you want to use multiple layout routes, add multiple directories:
//If you want multiple layout routes without modifying the URL, you can use groups.
export default function HomeLayout() {
  return (
    <>
      {/* <Header /> */}
      <Slot />
      {/* <Footer /> */}
    </>
  );
}
