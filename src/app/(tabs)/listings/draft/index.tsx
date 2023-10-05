import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Avatar,
  Button,
  Divider,
  List,
  MD3Colors,
  Dialog,
  Chip,
  IconButton,
} from "react-native-paper";
import {
  Text,
  View,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Link, router, usePathname } from "expo-router";
import colors from "@/constants/colors";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import AlertDialog from "@/components/common/AlertDialog";
import clsx from "clsx";

import { IListing } from "@/types/listing";
import CustomTabBar from "@/components/common/CustomTabBar";

import formatListingDate from "@/utils/formatListingDate";
import { useAppDispatch } from "@/hooks/useAppDispatch";

import SwipeableViews from "@/components/common/SwipeableViews";
import {
  useDeleteDraftListingMutation,
  useGetDraftListingsQuery,
  usePublishDraftMutation,
} from "@/redux/listings/draft/draftApiSlice";
import BedroomsBar from "@/components/common/BedroomsBar";

const BEDROOMS = [
  "",
  "Single",
  "Bedsitter",
  "1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "4+ Bedrooms",
];

type ListingProps = {
  listing: IListing;
};

const ListingItem = ({ listing }: ListingProps) => {
  const [deleteListing, { isLoading: isDeleting }] =
    useDeleteDraftListingMutation();

  const [publishListing, { isLoading: isDeactivating }] =
    usePublishDraftMutation();

  return (
    <Pressable
      className="mb-4 bg-white p-3  rounded-md"
      onPress={() =>
        router.push({ pathname: "/view", params: { id: listing._id } })
      }
    >
      <SwipeableViews
        images={listing.listingImages}
        imageStyle={{ borderRadius: 4 }}
        offset={50}
        startIcon="heart"
        endIcon="share-alt"
        endIconColor="#eee"
        startIconColor="red"
        handlePress={() =>
          router.push({ pathname: "/view", params: { id: listing._id } })
        }
      />

      <View className="gap-y-1">
        <Text className="text-gray-darker text-lg font-bold pt-1 ">
          {listing.bedrooms}
        </Text>
        <Text className="text-gray-muted text-sm  ">
          {listing.location?.description}
        </Text>
        <View className="flex-row justify-between">
          <Text className="text-gray-darker  text-md font-medium  ">
            Ksh {listing.price}/mo
          </Text>
          <Text className="text-gray-muted text-sm  ">
            {formatListingDate(new Date(listing.createdAt))}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <IconButton
          icon={({ size, color }) => (
            <FontAwesome name="toggle-off" size={24} color="black" />
          )}
          // className="bg-gray/20 "
          //iconColor=""
          //mode="outlined"
          //containerColor=
          disabled={isDeactivating}
          size={12}
          onPress={() => publishListing(listing._id)}
        />

        <IconButton
          icon={({ size, color }) => (
            <FontAwesome name="trash-o" size={24} color="red" />
          )}
          // className="bg-gray/20 "
          iconColor="red"
          //mode="outlined"
          //containerColor=
          disabled={isDeleting}
          size={12}
          onPress={() => deleteListing(listing._id)}
        />

        <IconButton
          icon={({ size, color }) => (
            <FontAwesome name="pencil-square-o" size={24} color="black" />
          )}
          // className="bg-gray/20 "
          //iconColor=""
          //mode="outlined"
          //containerColor=
          // disabled={item._id === currentId && (isLoading || isRLoading)}
          size={12}
          onPress={() =>
            router.push({
              pathname: "/listings/update/",
              params: { id: 1 },
            })
          }
        />
      </View>
    </Pressable>
  );
};

const DraftListings = () => {
  const listRef = useRef<FlatList>(null);
  const [listingData, setListingData] = useState<IListing[]>([]);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string | JSX.Element>("Draft");
  const dispatch = useAppDispatch();
  const [bedrooms, setBedrooms] = useState<string>("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [listingStatus, setListingStatus] = useState<string>("Draft");

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  /* -------------------------------------------------------------
   FETCH LISTINGS
   ----------------------------------------------------------------*/
  const {
    currentData: data, //The latest returned result for the current hook arg, if present.
    //data//The latest returned result regardless of hook arg, if present.
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetDraftListingsQuery(
    { itemsPerPage, page, filters: { bedrooms, listingStatus } },
    {
      // pollingInterval: 1000 * 5,
      // refetchOnFocus: true,
      //last fetched time > 10 secs, refetch//use true |10
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    setListingData((prev) => {
      //make sure no duplicate data
      const currentList = prev.map((item) => item._id);

      const newData =
        data?.listings?.filter((item) => !currentList.includes(item._id)) ?? [];

      return [...prev, ...newData];
    });
  }, [data]);

  /* -------------------------------------------------------------
   HANDLE TAB CHANGE
   ----------------------------------------------------------------*/
  const handleTabChange = (tab: string | JSX.Element) => {
    if (tab === "Active") return router.push("/listings/active/");
    if (tab === "Inactive") return router.push("/listings/inactive/");
    if (tab === "Draft") return router.push("/listings/draft/");
    //setActiveTab(tab);
  };

  /* -------------------------------------------------------------
   HANDLE SCROLL TO TOP
   ----------------------------------------------------------------*/
  const scrollToTop = useCallback(() => {
    //Scroll to a specific content pixel offset in the list.
    listRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, []);

  /* -------------------------------------------------------------
   HANDLE ON SCROLL->GET POSITION
   ----------------------------------------------------------------*/
  //use this to show top btn at certain position from top of list = y
  const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
    const scrollOffset = nativeEvent.contentOffset.y;
    setScrollPosition(scrollOffset);
  };

  /* -------------------------------------------------------------
   HANDLE ON END REACHED
   ----------------------------------------------------------------*/
  const loadMore = useCallback(() => {
    //important->or it will keep on refetching esp if items are smaller than screen size
    if (isError) return;
    setPage((prev) => prev + 1);
  }, []);

  return (
    <View className="flex-1  relative">
      {/**'auto', 'inverted', 'light', 'dark' */}
      {/* <StatusBar style="auto" backgroundColor="#fff" /> */}

      <CustomTabBar
        className=" "
        style={{ elevation: 1 }}
        tabs={["Active", "Draft", "Inactive"]}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

      <View className="py-4 px-3">
        <BedroomsBar bedrooms={bedrooms} setBedrooms={setBedrooms} />
      </View>

      <View className="px-4 pb-4">
        <Text>Results {data?.total || 0}</Text>
      </View>

      <View className="px-4">
        <FlatList
          ref={listRef}
          onScroll={handleScroll} //Fires at most once per frame during scrolling.
          keyboardShouldPersistTaps={"handled"} //important for locationPicker else onPress gets no results//the keyboard will not dismiss automatically when the tap was handled by children
          data={listingData}
          onRefresh={refetch} // standard RefreshControl will be added for "Pull to Refresh" functionality.
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          onEndReached={loadMore} //update current page/fetch more//infinite scrolling
          //How far from the end (in units of visible length of the list) the trailing edge of the list must be from the end of the content to trigger the onEndReached callback.
          //It accepts a value between 0 and 1, where 0 is the end of the list.
          onEndReachedThreshold={0.3}
          ListHeaderComponent={<View></View>}
          renderItem={({ item }: { item: IListing }) => (
            <ListingItem listing={item} />
          )}
          keyExtractor={(item) => item._id}
        />
      </View>

      {scrollPosition > 200 && (
        <IconButton
          className="bg-gray/30 absolute bottom-2 right-0"
          mode="contained-tonal"
          size={20}
          //labelStyle={{ fontSize: 30 }}
          //containerColor
          icon="chevron-up"
          iconColor="#fff"
          onPress={scrollToTop}
        />
      )}
    </View>
  );
};

export default DraftListings;
