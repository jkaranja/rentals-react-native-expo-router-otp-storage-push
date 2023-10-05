type ItemProps = { title: string; parallaxProps: any };
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,

} from "react-native";
import { Image } from "expo-image";
const Item = ({ title, parallaxProps }: ItemProps) => (
  <View className="py-3 bg-gray p-3 my-3">
    <Text className="text-white py-2">{title}</Text>
    {/* <Image
      className="h-[100] w-full"
      blurRadius={6}
      //alt=""
      //src={'https://reactnative.dev/img/tiny_logo.png'}//can use this for remote url only
      source={{
        uri: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
      }}
    />
    {/* <Image source={require("../../assets/glass.svg")} className="h-[100] w-full" />  */}
    {/* <Image
      source={{ uri: "https://reactjs.org/logo-og.png" }}
      style={{ width: 400, height: 400 }}
    /> */}
    {/* expo-image ->optimized for speed with disk and memory caching */}
    <Image
      className="h-[100] w-full"
      //priority=null | "'low' | 'normal' | 'high'"
      // style={styles.image}
      // blurRadius={6}//blurs the image
      //source can be a require("../")//relative path//remote url
      //alt=""
      source="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg"
      // placeholder={blurhash}
      contentFit="cover"
      transition={1000}
    />
    {/* ParallaxImage from corousel that aware of carousel's current scroll position and therefore able to display a nice parallax effect*/}

    {/* <ParallaxImage
      source={{ uri: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg" }}
      containerStyle={{
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: "white",
        borderRadius: 8,
      }}
     // style={{ ...StyleSheet.absoluteFillObject, resizeMode: "cover" }}
      parallaxFactor={0.4}
      {...parallaxProps}
      // showSpinner={true}//default //Whether to display a spinner while image is loading or not
      //spinnerColor=""//'rgba(0, 0, 0, 0.4)' default
    /> */}
  </View>
);
