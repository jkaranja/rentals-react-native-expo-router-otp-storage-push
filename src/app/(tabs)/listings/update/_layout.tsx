import AlertDialog from "@/components/common/AlertDialog";
import colors from "@/constants/colors";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useUpdateListingMutation } from "@/redux/listings/update/updateApiSlice";
import {
  addToUpdated,
  resetUpdated,
  selectUpdatedListing,
} from "@/redux/listings/update/updateSlice";

import { useGetListingQuery } from "@/redux/listings/view/viewApiSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Slot, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const SCREENS = [
  "/listings/post",
  "/listings/post/amenities",
  "/listings/post/pics",
];

const UpdateListingLayout = () => {
  const [isVisible, setIsVisible] = useState(false);

  const [status, setStatus] = useState("");

  const dispatch = useAppDispatch();

  const updated = useAppSelector(selectUpdatedListing);

  const [activeScreen, setActiveScreen] = useState(0);

  const maxScreens = SCREENS.length;

  const { id } = useLocalSearchParams<{ id: string }>();
  /* -------------------------------------------------------------
   FETCH LISTING
   ----------------------------------------------------------------*/
  const {
    currentData: listing, //The latest returned result for the current hook arg, if present.
    //data//The latest returned result regardless of hook arg, if present.
    // isFetching,
    // isSuccess,
    // isError,
    // error,
    //refetch,
  } = useGetListingQuery(id ?? skipToken, {
    // pollingInterval: 1000 * 5,
    // refetchOnFocus: true,
    //last fetched time > 10 secs, refetch//use true |10
    //refetchOnMountOrArgChange: true,
  });

  const [updateListing, { data, error, isLoading, isError, isSuccess }] =
    useUpdateListingMutation();

  //handle next btn
  const handleNext = () => {
    //check required fields
    const isDataValid =
      updated.location &&
      updated.bathrooms &&
      updated.bedrooms &&
      updated.kitchen &&
      updated.price &&
      updated.management &&
      updated.listedBy;

    if (!isDataValid) {
      return setIsVisible(true);
    }

    setActiveScreen((prevActiveScreen) => prevActiveScreen + 1);
  };
  //handle back btn
  const handleBack = () => {
    if (activeScreen === 0) return;
    setActiveScreen((prevActiveScreen) => prevActiveScreen - 1);
  };

  //submit data
  const handleUpdateListing = async () => {
    //check if images are added
    if (!updated.listingImages?.length) {
      return setIsVisible(true);
    }

    const formData = new FormData();
    //append listing images
    //Important: don't forget to check if file type in files is correct(eg format image/jpeg)//else Network error or nothing or multer will return files a stringified array
    updated.newPics?.forEach((img) => {
      formData.append("files", img as any); //if value is not a string | Blob/File, it will be converted to string
    });

    //append the rest
    Object.keys(updated).forEach((field, i) => {
      //skip appending new pics + current listing images
      if (field === "listingImages" || field === "newPics") return;

      let value = updated[field as keyof typeof updated];
      //stringify non-string values
      if (
        field === "location" ||
        field === "policies" ||
        field === "keywords" ||
        field === "amenities" ||
        field === "removedPics"
      ) {
        value = JSON.stringify(value);
      }
      formData.append(field, value as string);
    });

    formData.append("listingStatus", status);

    await updateListing({ id: "", data: formData });
  };

  //feedback
  useEffect(() => {
    if (isError) {
      Toast.show({ type: "error", text1: error as string });
    }
    //on success & token is not null
    if (isSuccess) {
      Toast.show({
        type: "success", // error || info
        text1: data?.message,
      });
      //clear updated from store resetUpdatedListing
      // dispatch(resetUpdated());
    }
    //on success delay redirect for 2 sec to display toast
    const timeoutId = setTimeout(() => {
      if (isSuccess) {
        //  router.push("/listings/");
      }
    }, 2000);

    return () => {
      clearTimeout(timeoutId); //clean timer
      Toast.hide(); //To hide the current visible Toast//default is 4 secs
    };
  }, [isError, isSuccess, data]);

  useEffect(() => {
    router.push(SCREENS[activeScreen] as any);
  }, [activeScreen]);

  useEffect(() => {
    if (!listing) return;

    dispatch(resetUpdated());

    dispatch(addToUpdated(listing));
  }, [listing]);

  return (
    <View className="relative flex-1">
      {isVisible && (
        <AlertDialog
          visible={isVisible}
          handleClose={() => setIsVisible(false)}
        >
          <View className="gap-y-3">
            <Text className="">
              {!updated.listingImages?.length && activeScreen === maxScreens - 1
                ? "Please add at least one image"
                : "Please fill all required fields "}
            </Text>
          </View>
        </AlertDialog>
      )}

      <Slot />

      <View className=" bg-white bottom-0 flex-row justify-between  w-full h-[70] items-center px-3 border-gray-light  border-t-2">
        <Button
          disabled={activeScreen === 0}
          onPress={handleBack}
          className="rounded-md"
          //icon="format-list-text"
          mode="outlined"
          // compact
          // onPress={() => handleSnapPress(filter)}
          //uppercase //boolean//Make the label text uppercased
          labelStyle={
            {
              //fontSize: 13,
              // marginVertical: 8,
            }
          } //Style for the button text.
          //style={{ width: "100%" }}
          textColor={colors.gray.dark}
        >
          Back
        </Button>
        {activeScreen === maxScreens - 1 ? (
          <View className="gap-x-2 flex-row">
            <Button
              onPress={() => {
                dispatch(resetUpdated());
                router.push("/listings/");
              }}
              className="rounded-md bg-red"
              mode="contained"
              compact
              loading={status === "Draft" && isLoading}
              disabled={isLoading}
              // onPress={() => handleSnapPress(filter)}
              //uppercase //boolean//Make the label text uppercased
              labelStyle={
                {
                  //fontSize: 13,
                  // marginVertical: 8,
                }
              } //Style for the button text.
              //style={{ width: "100%" }}
            >
              Discard changes
            </Button>
            <Button
              onPress={handleUpdateListing}
              className="rounded-md bg-emerald"
              mode="contained"
              loading={status === "Active" && isLoading}
              disabled={isLoading}
              //compact
              // onPress={() => handleSnapPress(filter)}
              //uppercase //boolean//Make the label text uppercased
              labelStyle={
                {
                  //fontSize: 13,
                  // marginVertical: 8,
                }
              } //Style for the button text.
              //style={{ width: "100%" }}
            >
              Update
            </Button>
          </View>
        ) : (
          <Button
            onPress={handleNext}
            className="rounded-md bg-gray"
            mode="contained"
            //compact
            // onPress={() => handleSnapPress(filter)}
            //uppercase //boolean//Make the label text uppercased
            labelStyle={
              {
                //fontSize: 13,
                // marginVertical: 8,
              }
            } //Style for the button text.
            //style={{ width: "100%" }}
          >
            Next
          </Button>
        )}
      </View>
    </View>
  );
};

export default UpdateListingLayout;
