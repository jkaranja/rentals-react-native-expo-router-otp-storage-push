import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import Bathrooms from "@/components/listings/Bathrooms";
import Bedrooms from "@/components/listings/Bedrooms";
import BrokerFee from "@/components/listings/BrokerFee";
import Keywords from "@/components/listings/Keywords";
import Kitchen from "@/components/listings/Kitchen";
import ListedBy from "@/components/listings/ListedBy";
import ListingPrice from "@/components/listings/ListingPrice";
import LocationPicker from "@/components/listings/LocationPicker";
import Management from "@/components/listings/Management";
import Policies from "@/components/listings/Policies";

import { ILocation } from "@/types/listing";
import { TBasicInfoInputs } from "@/types/react-hook-form";
import { useForm } from "react-hook-form";
import { addToUpdated, selectUpdatedListing } from "@/redux/listings/update/updateSlice";

const BasicInfo = () => {
  const updated = useAppSelector(selectUpdatedListing);
  const dispatch = useAppDispatch();

  const [location, setLocation] = useState({} as ILocation);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    register,
    reset: resetForm,
    getValues, //returns
  } = useForm<TBasicInfoInputs>({
    defaultValues: {
      bedrooms:  updated.bedrooms || "",
      bathrooms:  updated.bathrooms || "",
      kitchen:  updated.kitchen || "",
      price:  updated.price || "",
      management:  updated.management || "",
      brokerFee:  updated.brokerFee || "",
      policies:  updated.policies || [],
      keywords:  updated.keywords || [],
      listedBy:  updated.listedBy || "",
    },
  });

  // //update  updated in store
  useEffect(() => {
    // Callback version of watch. Optimized for performance. Render at hook level instead of whole app  It's your responsibility to unsubscribe when done.
    const subscription = watch((data) => {
      //console.log(data, name, type); 2nd param: { name, type }//name=name of field that changed, type= event type eg 'change'
      const values = data as TBasicInfoInputs;
      dispatch(
        addToUpdated({
          location,
          ...values, //form values as an object
          //below handled in input field in register field
          // price: price.replace(/[^0-9]/g, "") || "0", //only numbers, default is 0,
          // brokerFee: brokerFee.replace(/[^0-9]/g, "") || "0", //only numbers, default is 0
        })
      );
    });
    return () => subscription.unsubscribe();
  }, [watch, location]);

  return (
    <View className="relative flex-1">
      <Text className="text-lg">Location</Text>
      <LocationPicker setLocation={setLocation} />

      <Text className="text-lg">Bedrooms</Text>
      <Bedrooms resetForm={resetForm} />

      <Text className="text-lg">Bathrooms</Text>
      <Bathrooms resetForm={resetForm} />

      <Text className="text-lg">Kitchen plan</Text>
      <Kitchen control={control} />

      <Text className="text-lg">Rent</Text>
      <ListingPrice control={control} />

      <Text className="text-lg">Management</Text>
      <Management control={control} />

      <Text className="text-lg">Listed by</Text>
      <ListedBy control={control} />

      <Text className="text-lg">Broker fee</Text>
      <BrokerFee control={control} />

      <Text className="text-lg">Keywords</Text>
      <Keywords resetForm={resetForm} />

      <Policies resetForm={resetForm} />
    </View>
  );
};

export default BasicInfo;
