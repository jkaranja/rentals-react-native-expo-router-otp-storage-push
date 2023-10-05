import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import {
    Button,
    Checkbox
} from "react-native-paper";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import CustomTabBar from "@/components/common/CustomTabBar";
import Bathrooms from "@/components/listings/Bathrooms";
import Bedrooms from "@/components/listings/Bedrooms";
import Keywords from "@/components/listings/Keywords";
import Kitchen from "@/components/listings/Kitchen";
import Management from "@/components/listings/Management";
import PriceRange from "@/components/listings/PriceRange";
import { useGetAllListingsQuery } from "@/redux/listings/live/liveApiSlice";
import {
    addToFilters,
    resetFilters,
    selectSearchFilters,
} from "@/redux/listings/live/liveSlice";
import { router } from "expo-router";

import LocationPicker from "@/components/listings/LocationPicker";
import { ILocation } from "@/types/listing";
import { TAmenitiesInputs, TBasicInfoInputs } from "@/types/react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { FlatList } from "react-native-gesture-handler";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

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
    <BottomSheetScrollView className="relative flex-1">
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
    </BottomSheetScrollView>
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
  const filters = useAppSelector(selectSearchFilters);

  const [activeTab, setActiveTab] = useState<string | JSX.Element>(
    "Main specs"
  );

  const dispatch = useAppDispatch();

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  /* -------------------------------------------------------------
    HANDLE TAB CHANGE
   ----------------------------------------------------------------*/
  const handleTabChange = (tab: string | JSX.Element) => {
    setActiveTab(tab);
    let sectionIndex = 0;
    if (tab === "Amenities") sectionIndex = 2;
    if (tab === "Price range") sectionIndex = 1;
    if (tab === "More") sectionIndex = 3;
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

  return (
    <View className="relative flex-1 pb-[60] ">
      <CustomTabBar
        className="bg-white my-3"
        style={{ elevation: 1 }}
        tabs={["Main specs", "Amenities"]}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

      <View className="px-4">
        {activeTab === "Main specs" && <BasicPanel />}
        {activeTab === "Amenities" && <AmenitiesPanel />}
      </View>

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
    </View>
  );
};

export default Filters;
