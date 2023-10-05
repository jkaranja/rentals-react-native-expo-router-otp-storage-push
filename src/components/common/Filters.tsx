import React, { useEffect, useRef, useState } from "react";
import { SectionList, Text, View } from "react-native";
import {
  Button,
  Checkbox,
  Divider,
  IconButton,
  List,
} from "react-native-paper";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import Bedrooms from "@/components/listings/Bedrooms";
import Bathrooms from "@/components/listings/Bathrooms";
import Kitchen from "@/components/listings/Kitchen";
import PriceRange from "@/components/listings/PriceRange";
import CustomTabBar from "@/components/common/CustomTabBar";
import Policies from "@/components/listings/Policies";
import Keywords from "@/components/listings/Keywords";
import Management from "@/components/listings/Management";
import BrokerFee from "@/components/listings/BrokerFee";
import ListedBy from "@/components/listings/ListedBy";
import { useGetAllListingsQuery } from "@/redux/listings/live/liveApiSlice";
import { router } from "expo-router";
import { addToFilters, selectSearchFilters } from "@/redux/listings/live/liveSlice";

import LocationPicker from "@/components/listings/LocationPicker";
import { Controller, useForm } from "react-hook-form";
import { TAmenitiesInputs, TBasicInfoInputs } from "@/types/react-hook-form";
import ListingPrice from "@/components/listings/ListingPrice";
import { ILocation } from "@/types/listing";
import { FlatList } from "react-native-gesture-handler";

const BasicPanel = () => {
  const filters = useAppSelector(selectSearchFilters);

  const dispatch = useAppDispatch();

  const [location, setLocation] = useState({} as ILocation);

  const [priceRange, setPriceRange] = useState(
    filters.priceRange || [100, 1000000]
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    register,
    reset: resetForm,
    getValues,
  } = useForm<TBasicInfoInputs>({
    defaultValues: {
      bedrooms: filters.bedrooms || "",
      bathrooms: filters.bathrooms || "",
      kitchen: filters.kitchen || "",
      price: filters.price || "",
      management: filters.management || "",
      brokerFee: filters.brokerFee || "",
      policies: filters.policies || [],
      keywords: filters.keywords || [],
      listedBy: filters.listedBy || "",
    },
  });

  // //update filter in store
  useEffect(() => {
    let subscription: ReturnType<typeof watch>;
    //debounce dispatch->2 sec
    const timerId = setTimeout(() => {
      // Callback version of watch. Optimized for performance. Render at hook level instead of whole app  It's your responsibility to unsubscribe when done.
      subscription = watch((data) => {
        //console.log(data, name, type); 2nd param: { name, type }//name=name of field that changed, type= event type eg 'change'
        const values = data as TBasicInfoInputs;
        dispatch(
          addToFilters({
            location,
            ...values, //form values as an object
          })
        );
      });
    }, 2000);

    return () => {
      clearTimeout(timerId);
      subscription?.unsubscribe();
    };
  }, [watch, location]);

  return (
    <View className="relative flex-1">
      <Text className="text-lg">Location</Text>
      <LocationPicker setLocation={setLocation} />

      <Text className="text-lg">Bedrooms</Text>
      <Bedrooms resetForm={resetForm} />

      <Text className="text-lg">Price Range</Text>
      <PriceRange priceRange={priceRange} setPriceRange={setPriceRange} />

      <Text className="text-lg">Bathrooms</Text>
      <Bathrooms resetForm={resetForm} />

      <Text className="text-lg">Kitchen plan</Text>
      <Kitchen control={control} />

      <Text className="text-lg">Management</Text>
      <Management control={control} />

      <Text className="text-lg">Keywords</Text>
      <Keywords resetForm={resetForm} />
    </View>
  );
};

//amenities
const AmenitiesPanel = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectSearchFilters);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    register,
    reset: resetForm,
    getValues, //returns
  } = useForm<TAmenitiesInputs>({
    defaultValues: {
      water: filters.amenities?.water || false,
      borehole: filters.amenities?.borehole || false,
      parking: filters.amenities?.parking || false,
      wifi: filters.amenities?.wifi || false,
      gym: filters.amenities?.gym || false,
      pool: filters.amenities?.pool || false,
      cctv: filters.amenities?.cctv || false,
      securityLights: filters.amenities?.securityLights || false,
      watchman: filters.amenities?.watchman || false,
    },
  });

  //update filters in store
  useEffect(() => {
    // Callback version of watch. Optimized for performance. Render at hook level instead of whole app  It's your responsibility to unsubscribe when done.
    const subscription = watch((data) => {
      //console.log(data, name, type); 2nd param: { name, type }//name=name of field that changed, type= event type eg 'change'
      const values = data as TAmenitiesInputs;
      dispatch(
        addToFilters({
          amenities: { ...values },
        })
      );
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <View>
      <FlatList
        className="px-4 bg-white"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        data={Object.keys(getValues())}
        ListHeaderComponent={
          <View className="bg-white py-3">
            <Text className="text-lg text-gray-dimmed ">
              Available amenities
            </Text>
          </View>
        }
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const key = item as keyof TAmenitiesInputs;
          return (
            <View className="flex-row items-center justify-between py-1">
              <Text className="">
                {key === "water" && "Water 7 days/week"}
                {key === "borehole" && "Borehole"}
                {key === "parking" && "Spacious parking"}
                {key === "wifi" && "Wifi"}
                {key === "gym" && "Gym"}
                {key === "pool" && "Swimming pool"}
                {key === "cctv" && "CCTV"}
                {key === "securityLights" && "Security lights"}
                {key === "watchman" && "Watchman/security guard"}
              </Text>

              <Controller
                name={key}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    status={value ? "checked" : "unchecked"}
                    onPress={() => onChange(!watch(key))}
                  />
                )}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

const Filters = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef<SectionList>(null);

  const filters = useAppSelector(selectSearchFilters);

  const [activeTab, setActiveTab] = useState<string | JSX.Element>(
    "Living space"
  );

  const [bedrooms, setBedrooms] = useState<string>(filters.bedrooms || "");
  const [bathrooms, setBathrooms] = useState<string>(filters.bathrooms || "");
  const [kitchen, setKitchen] = useState(filters.kitchen || "");
  const [priceRange, setPriceRange] = useState(
    filters.priceRange || [100, 1000000]
  );
  const [management, setManagement] = useState(filters.management || "");
  const [listedBy, setListedBy] = useState(filters.listedBy || "");
  const [keywords, setKeywords] = useState<string[]>(filters.keywords || []);
  const [amenities, setAmenities] = useState({
    water: filters.amenities?.water || false,
    borehole: filters.amenities?.borehole || false,
    parking: filters.amenities?.parking || false,
    wifi: filters.amenities?.wifi || false,
    gym: filters.amenities?.gym || false,
    pool: filters.amenities?.pool || false,
    cctv: filters.amenities?.cctv || false,
    securityLights: filters.amenities?.securityLights || false,
    watchman: filters.amenities?.watchman || false,
  });

  const dispatch = useAppDispatch();

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  /* -------------------------------------------------------------
    HANDLE TAB CHANGE
   ----------------------------------------------------------------*/
  const handleTabChange = (tab: string | JSX.Element) => {
    setActiveTab(tab);
    let sectionIndex = 0;
    if (tab === "Amenities") sectionIndex = 2;
    if (tab === "Price range") sectionIndex = 1;
    if (tab === "More") sectionIndex = 3;
    //scroll to section
    scrollRef.current?.scrollToLocation({
      sectionIndex,
      itemIndex: 0,
      //viewOffset: 140,
      //animated: true,//Defaults to true.
    });
  };

  /* -------------------------------------------------------------
   HANDLE ON SCROLL->GET POSITION
   ----------------------------------------------------------------*/
  const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
    const scrollOffset = nativeEvent.contentOffset.y;
    setScrollPosition(scrollOffset);
  };

  /* -------------------------------------------------------------
   FETCH LISTINGS
   ----------------------------------------------------------------*/
  const {
    currentData, //The latest returned result regardless of hook arg, if present.
    //currentData////The latest returned result for the current hook arg, if present.
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetAllListingsQuery(
    { itemsPerPage, page, filters },
    {
      // pollingInterval: 1000 * 5,
      // refetchOnFocus: true,
      //last fetched time > 10 secs, refetch//use true |10
      //refetchOnMountOrArgChange: true,
    }
  );

  //update filters in store
  useEffect(() => {
    //debounce dispatch->2 sec
    const timerId = setTimeout(() => {
      dispatch(
        addToFilters({
          bedrooms,
          bathrooms,
          kitchen,
          priceRange,
          management,
          keywords,
          listedBy,
          amenities,
        })
      );
    }, 2000);

    return () => clearTimeout(timerId);
  }, [
    bedrooms,
    bathrooms,
    kitchen,
    priceRange,
    management,
    keywords,
    listedBy,
    amenities,
  ]);

  interface ISectionData {
    sectionTitle: string;
    data: Array<{
      title: string;
      content: JSX.Element;
      checkbox?: JSX.Element;
    }>;
  }
  const DATA: Array<ISectionData> = [
    {
      sectionTitle: "Living space",
      data: [
        {
          title: "Bedrooms",
          content: <Bedrooms bedrooms={bedrooms} setBedrooms={setBedrooms} />,
        },
        {
          title: "Bathrooms",
          content: (
            <Bathrooms bathrooms={bathrooms} setBathrooms={setBathrooms} />
          ),
        },
        {
          title: "Kitchen",
          content: <Kitchen kitchen={kitchen} setKitchen={setKitchen} />,
        },
      ],
    },

    {
      sectionTitle: "Price range",
      data: [
        {
          title: "Rent",
          content: (
            <PriceRange priceRange={priceRange} setPriceRange={setPriceRange} />
          ),
        },
      ],
    },

    {
      sectionTitle: "Amenities",
      data: Object.keys(amenities).map((item) => {
        const key = item as keyof typeof amenities;
        return {
          title: `${key[0].toUpperCase() + key.slice(1)}`,
          content: <View></View>,
          checkbox: (
            <Checkbox
              status={amenities[key] ? "checked" : "unchecked"}
              onPress={() => {
                setAmenities((prev) => ({
                  ...prev,
                  [item]: !amenities[key],
                }));
              }}
            />
          ),
        };
      }),
    },

    {
      sectionTitle: "More",
      data: [
        {
          title: "Listed by",
          content: <ListedBy listedBy={listedBy} setListedBy={setListedBy} />,
        },

        {
          title: "Management",
          content: (
            <Management management={management} setManagement={setManagement} />
          ),
        },

        {
          title: "Keywords",
          content: <Keywords keywords={keywords} setKeywords={setKeywords} />,
        },
      ],
    },
  ];

  return (
    <View className="relative flex-1 pb-[60] ">
      <CustomTabBar
        className="bg-white mb-2 "
        style={{ elevation: 1 }}
        tabs={["Living space", "Price range", "Amenities", "More"]}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

      <BottomSheetSectionList
        className=" bg-white"
        //onStartReachedThreshold//How far from the start (in units of visible length of the list) the leading edge of the list must be from the start of the content to trigger the onStartReached callback.
        //onStartReached//(info: {distanceFromStart: number}) => void//Called once when the scroll position gets within within onStartReachedThreshold from the logical start of the list.
        //initialScrollIndex
        onScroll={handleScroll}
        ref={scrollRef}
        ListHeaderComponent={<View></View>}
        showsVerticalScrollIndicator={false}
        // stickySectionHeadersEnabled={true} ////default: false in android//Makes section headers stick to the top of the screen until the next one pushes it off.
        sections={DATA}
        keyExtractor={(item, index) => item.title}
        renderItem={({ item }) => {
          return (
            <View className=" mb-1 px-4">
              <View className="flex-row justify-between items-center">
                {item.title !== "Rent" && (
                  <Text className="text-lg ">
                    {item.title === "Water"
                      ? "Water 7days/week"
                      : item.title === "SecurityLights"
                      ? "Security lights"
                      : item.title}
                  </Text>
                )}
                {item?.checkbox && (
                  <Text className="text-lg py-2">{item?.checkbox}</Text>
                )}
              </View>
              {!item?.checkbox && <View className="py-3">{item.content}</View>}
              <Divider />
            </View>
          );
        }}
        renderSectionHeader={({ section: { sectionTitle } }) => (
          <View className=" py-2 px-3">
            <Text className="text-lg font-semibold">{sectionTitle}</Text>
          </View>
        )}
        ListFooterComponent={<View className="py-3 flex-row "></View>}
      />

      <View className="px-4  absolute bottom-0 w-full h-[60] border border-gray-disabled justify-between flex-row items-center">
        <Button
          className="rounded-md"
          icon=""
          mode="outlined"
          //compact
          onPress={() => dispatch(resetFilters())}
          //uppercase //boolean//Make the label text uppercased
        >
          Clear all
        </Button>
        <Button
          className="bg-gray-dark rounded-md"
          icon=""
          mode="contained"
          loading={isFetching}
          onPress={() => router.push("/")}
        >
          Show ({!isFetching && `${currentData?.total || "0"}`})
        </Button>
      </View>

      {scrollPosition > 100 && (
        <IconButton
          className="bg-gray/30 absolute bottom-20 right-0"
          mode="contained-tonal"
          size={20}
          //labelStyle={{ fontSize: 30 }}
          //containerColor
          icon="chevron-up"
          iconColor="#fff"
          onPress={() => handleTabChange("Living space")}
        />
      )}
    </View>
  );
};

export default Filters;
