import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { FontAwesome } from "@expo/vector-icons";
import { IconButton } from "react-native-paper";
import clsx from "clsx";

type ListingItemProps = {
  item: {
    id: string;
    location: string;
    createdAt: string;
    rent: number;
    description: string;
    images: Array<{
      uri: string;
      id: string;
    }>;
  };
} & Record<string, any>;

const ListingItem = ({
  item: { location, createdAt, rent, description, images },
  ...props
}: ListingItemProps) => {
  const dimensions = useWindowDimensions();

  const carouselRef = useRef<Carousel<any>>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const goForward = () => {
    carouselRef.current?.snapToNext();
  };

  const goBack = () => {
    carouselRef.current?.snapToPrev();
  };
  return (
    <View className=" bg-white p-3 my-3 gap-y-2 rounded-md">
      <Carousel
        vertical={false} //Layout slides vertically instead of horizontally//default false//but prop is required
        autoplay={true}
        ///scrollEnabled={true}//default//When false, the view cannot be scrolled via touch interaction
        //autoplayDelay={1000}
        autoplayInterval={6000} //default 3000
        //onPress={() => { carouselRef.current?.snapToNext(); }}
        layout="default" //'default', 'stack' and 'tinder'.//Define the way items are rendered and animated.
        ref={carouselRef}
        data={images} //Array of items to loop on
        //@ts-ignore
        renderItem={({ item, index }) => (
          <View className={clsx(props.height, "relative")}>
            <View className="absolute top-0 right-0 ">
              <IconButton
                icon={({ size, color }) => (
                  <FontAwesome name="heart" size={30} color="#fff" />
                )}
                // iconColor={colors.gray.dark}
                mode="contained"
                containerColor="#fff"
                size={18}
                //selected
                //disabled
                // onPress={() => handleSnapPress()}
                //rippleColor={colors.emerald.DEFAULT}
                //style={{ borderColor: colors.gray.light }}
              />
            </View>

            <Image
              className={clsx(props.height, "w-full")}
              //priority=null | "'low' | 'normal' | 'high'"
              style={{ borderRadius: 10 }}
              //blurRadius={6}//blurs the image
              //source can be a require("../")//relative path//remote url
              //alt=""
              //@ts-ignore
              source={item.uri}
              // placeholder={blurhash}
              contentFit="cover"
              transition={1000}
            />

            <Pagination
              dotsLength={images.length}
              activeDotIndex={activeSlide}
              containerStyle={{
                backgroundColor: "transparent", //rgba(0, 0, 0, 0.75)
                position: "absolute",
                bottom: 0,
                width: "100%",
                paddingVertical: 10,
              }}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 2,
                backgroundColor: "rgba(255, 255, 255, 0.92)",
              }}
              inactiveDotStyle={
                {
                  // Define styles for inactive dots here
                }
              }
              //dotColor="#.."	//Background color of the active dot
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
          </View>
        )}
        sliderWidth={dimensions.width} //using screenWidth//Width in pixels of the carousel itself//Required
        // sliderHeight={screenWidth}//Height in pixels of the carousel itself//required for vertical carousel
        itemWidth={dimensions.width} //Width in pixels of carousel's items, must be the same for all of them/required
        //itemHeight={170}	//Height in pixels of carousel's items.//required for vertical carousel
        onSnapToItem={(index) => setActiveSlide(index)} //Callback fired after snapping to an item
        // hasParallaxImages={true}
        //slideStyle//Optional style for each item's container
        //contentContainerCustomStyle//	Optional styles for Scrollview's items container
        //containerCustomStyle//	Optional styles for Scrollview's global wrapper
        //activeAnimationType="timing"//'decay, 'spring' or 'timing'//Custom animation type:
      />

      <Text className="text-gray.dark text-md font-bold  ">{location}</Text>
      <Text className="text-gray.muted text-sm  ">{description}</Text>
      <Text className="text-gray.muted text-sm  ">{createdAt}</Text>
      <Text className="text-gray.dark font-semibold text-sm  ">
        Ksh {rent}/monthly
      </Text>
      <Text className="text-gray.muted text-sm  ">Views(290)</Text>
      {/* expo-image ->optimized for speed with disk and memory caching */}
    </View>
  );
};

export default ListingItem;
