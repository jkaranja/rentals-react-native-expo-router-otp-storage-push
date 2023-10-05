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
import { selectSearchFilters } from "@/redux/listings/live/liveSlice";

const SearchFilters = () => {
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
  const [brokerFee, setBrokerFee] = useState(filters.brokerFee || "");
  const [keywords, setKeywords] = useState<string[]>(filters.keywords || []);
  const [amenities, setAmenities] = useState({
    water: filters.amenities?.water || "",
    borehole: filters.amenities?.borehole || "",
    parking: filters.amenities?.parking || "",
    wifi: filters.amenities?.wifi || "",
    gym: filters.amenities?.gym || "",
    pool: filters.amenities?.pool || "",
    cctv: filters.amenities?.cctv || "",
    securityLights: filters.amenities?.securityLights || "",
    watchman: filters.amenities?.watchman || "",
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
          ...filters,
          bedrooms,
          bathrooms,
          kitchen,
          priceRange,
          management,
          brokerFee,
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
    brokerFee,
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
    <View className="relative flex-1 pb-[60]">
      <CustomTabBar
        className="bg-white my-3"
        style={{ elevation: 1 }}
        tabs={["Living space", "Price range", "Amenities", "More"]}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

      <SectionList
        className="px-4 bg-white"
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
            <View className=" mb-1">
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
          <View className=" py-2 ">
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

export default SearchFilters;
