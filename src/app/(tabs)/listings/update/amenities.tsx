import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { addToUpdated, selectUpdatedListing } from "@/redux/listings/update/updateSlice";

import { TAmenitiesInputs } from "@/types/react-hook-form";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FlatList, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";

const AmenitiesList = () => {
  const dispatch = useAppDispatch();
  const updated = useAppSelector(selectUpdatedListing);

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
      water: updated.amenities?.water || false,
      borehole: updated.amenities?.borehole || false,
      parking: updated.amenities?.parking || false,
      wifi: updated.amenities?.wifi || false,
      gym: updated.amenities?.gym || false,
      pool: updated.amenities?.pool || false,
      cctv: updated.amenities?.cctv || false,
      securityLights: updated.amenities?.securityLights || false,
      watchman: updated.amenities?.watchman || false,
    },
  });

  //update updated in store
  useEffect(() => {
    // Callback version of watch. Optimized for performance. Render at hook level instead of whole app  It's your responsibility to unsubscribe when done.
    const subscription = watch((data) => {
      //console.log(data, name, type); 2nd param: { name, type }//name=name of field that changed, type= event type eg 'change'
      const values = data as TAmenitiesInputs;
      dispatch(
        addToUpdated({
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

export default AmenitiesList;
