import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  selectDraftListing,
  setDraftListing,
} from "@/redux/listings/listingSlice";
import { ListingImage } from "@/types/file";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import ImagesViewer from "./ImagesViewer";
import { selectCurrentToken } from "@/redux/auth/authSlice";

const ListingImages = () => {
  const draft = useAppSelector(selectDraftListing);

  const [listingPics, setListingPics] = useState<Array<ListingImage>>(
    draft.listingImages || []
  );

  const token = useAppSelector(selectCurrentToken);

  const dispatch = useAppDispatch();

  //or use hooks
  //const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  //permission?.status !== ImagePicker.PermissionStatus.GRANTED

  //pick an image/video from the media library
  //Can also pick only image or only video separately. Set mediaTypes below.
  const pickImage = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show({
        type: "error", // error || info
        text1: "Access to media library denied",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //Images | Videos| All  images or only videos separately
      quality: 1,
      aspect: [4, 3], //landscape// portrait: 3,4
    });

    //use 'canceled' => 'cancelled' deprecated
    //if picker was not cancelled
    if (!result.canceled) {
      //fileSize & fileName = undefined in result
      ////don't forget to check if file type is correct(eg format image/jpeg)//else Network error or nothing or multer will return files a stringified array 
      const imgList = result.assets.map((file) => ({
        uri: file.uri,
        name: file.fileName || file.uri.split("/").pop(),
        type: `image/${file.uri.split(".").pop()}`,
      }));
      //dedupe images/not working/name gen randomly each time
      // const newImages = imgList.filter(
      //   (img) =>
      //     !listingPics
      //       .map((pic) => JSON.stringify(pic))
      //       .includes(JSON.stringify(img))
      // );
      setListingPics([...listingPics, ...(imgList as Array<ListingImage>)]);
    }
  };

  //take a photo with the camera
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show({
        type: "error", // error || info
        text1: "Access to camera denied",
      });
      //Alert.alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //Images | Videos| All
      quality: 1,
      aspect: [4, 3], //landscape// portrait: 3,4
    });

    // Explore the result
    //use 'canceled' => 'cancelled' deprecated
    if (!result.canceled) {
      //fileSize & fileName = undefined in result
      //always use the assets array to extract file info->other fields deprecated
      const imgList = result.assets.map((file) => ({
        uri: file.uri,
        name: file.fileName || file.uri.split("/").pop(),
        type: file.type,
      }));

      // //dedupe images/not working/name gen randomly each time
      // const newImages = imgList.filter(
      //   (img) =>
      //     !listingPics
      //       .map((pic) => JSON.stringify(pic))
      //       .includes(JSON.stringify(img))
      // );
      setListingPics([...listingPics, ...(imgList as Array<ListingImage>)]);
    }
  };

  //update draft in store
  useEffect(() => {
    //debounce dispatch->2 sec
    const timerId = setTimeout(() => {
      dispatch(
        setDraftListing({
          ...draft,
          listingImages: listingPics,
        })
      );
    }, 2000);

    return () => clearTimeout(timerId);
  }, [listingPics]);

  const removeImage = (file: ListingImage) => {
    setListingPics((prev) => {
      return prev.filter(
        (image) => JSON.stringify(image) !== JSON.stringify(file)
      );
    });
  };

  return (
    <View className=" p-2 flex-1 ">
      <View className="flex-row justify-evenly">
        <Button mode="contained" onPress={pickImage} className="bg-emerald">
          Select images
        </Button>
        <Button mode="contained" onPress={openCamera} className="bg-emerald">
          Take photo
        </Button>
      </View>

      <View className="flex-1 mt-4">
        {listingPics && (
          <ImagesViewer images={listingPics} removeImage={removeImage} />
        )}
      </View>
    </View>
  );
};

export default ListingImages;
