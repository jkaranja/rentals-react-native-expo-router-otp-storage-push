import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  addToDraft,
  selectDraftListing,
} from "@/redux/listings/draft/draftSlice";
import { TAmenitiesInputs } from "@/types/react-hook-form";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FlatList, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";

const AmenitiesList = () => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector(selectDraftListing);

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
      water: draft.amenities?.water || false,
      borehole: draft.amenities?.borehole || false,
      parking: draft.amenities?.parking || false,
      wifi: draft.amenities?.wifi || false,
      gym: draft.amenities?.gym || false,
      pool: draft.amenities?.pool || false,
      cctv: draft.amenities?.cctv || false,
      securityLights: draft.amenities?.securityLights || false,
      watchman: draft.amenities?.watchman || false,
    },
  });

  //update draft in store
  useEffect(() => {
    // Callback version of watch. Optimized for performance. Render at hook level instead of whole app  It's your responsibility to unsubscribe when done.
    const subscription = watch((data) => {
      //console.log(data, name, type); 2nd param: { name, type }//name=name of field that changed, type= event type eg 'change'
      const values = data as TAmenitiesInputs;
      dispatch(
        addToDraft({
          amenities: { ...values },
        })
      );
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <View className=" flex-1 ">
      <FlatList
        className=" "
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        data={Object.keys(getValues())}
        ListHeaderComponent={
          <View className="">
            <Text className="text-lg py-3   ">
              Check all the available amenities
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

export default AmenitiesList;
