import AlertDialog from "@/components/common/AlertDialog";
import CustomTabBar from "@/components/common/CustomTabBar";
import FilterBottomSheet from "@/components/common/BottomSheet";

import SearchBar from "@/components/listings/SearchBar";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCurrentToken } from "@/redux/auth/authSlice";
import { useGetAllListingsQuery } from "@/redux/listings/live/liveApiSlice";

import {
  IWishlist,
  IWishlistResult,
  useAddWishlistMutation,
  useGetWishlistQuery,
  useRemoveWishlistMutation,
} from "@/redux/listings/wishlist/wishlistApiSlice";
import { IListing } from "@/types/listing";
import formatListingDate from "@/utils/formatListingDate";
import { FontAwesome } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";

import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Button, Chip, IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
//import Share from "react-native-share";
import BottomSheet from "@/components/common/BottomSheet";

import {
  addToFilters,
  resetFilters,
  selectSearchFilters,
} from "@/redux/listings/live/liveSlice";
import LoginAlert from "@/components/listings/LoginAlert";
import SwipeableViews from "@/components/common/SwipeableViews";
import Filters from "@/components/listings/Filters";
import BedroomsBar from "@/components/common/BedroomsBar";

type ListingProps = {
  listing: IListing;
  wishlist: IWishlistResult;
};

const ListingItem = ({ listing, wishlist }: ListingProps) => {
  const token = useAppSelector(selectCurrentToken);

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  //is listing in wishlist
  const isInWishlist = () => {
    return wishlist?.listings?.some(
      (item) => item.listing?._id === listing._id
    );
  };

  //wishlist Id of the current listing
  const extractWishlistId = () => {
    const wishlistItem = wishlist?.listings?.find(
      (item) => item.listing?._id === listing._id
    );
    return wishlistItem?._id;
  };

  /* -------------------------------------------------------------
   ADD TO WISHLIST
  ----------------------------------------------------------------*/
  const [addWishlist, { isLoading: isAdding }] = useAddWishlistMutation();
  /* -------------------------------------------------------------
   REMOVE FROM WISHLIST
  ----------------------------------------------------------------*/
  const [removeWishlist, { isLoading: isRemoving }] =
    useRemoveWishlistMutation();

  //show/hide login dialog
  const handleLoginAlert = () => {
    setIsAlertVisible((prev) => !prev);
  };

  const handleWishlistClick = () => {
    if (!token) return handleLoginAlert();
    if (isInWishlist()) return removeWishlist(extractWishlistId()!);
    return addWishlist(listing._id);
  };

  /**---------------------------------------------------------
   * SHARE LISTING VIA SOCIAL NETWORKS
   ----------------------------------------------------------*/
  //open/snap bottom sheet to a defined snap point
  // const handleShareListing = useCallback((listing: IListing) => {
  //   const bedrooms = parseInt(listing?.bedrooms as string)
  //     ? `${listing?.bedrooms} Bedroom`
  //     : `${listing?.bedrooms}`;

  //   const onShare = async () => {
  //     try {
  //       //Option1: The open() method allows a user to share a premade message via a social medium they choose.
  //       //In other words, code specifies the message that will be sent and the user chooses to whom and the social medium through which the message will be sent.
  //       //you can use the react-native Share component but has limited options i.e only message & title
  //       //message and url are  concatenated to form = body of the message
  //       const shareResponse = await Share.open({
  //         message: `${bedrooms} for rent. Location: ${listing?.location?.description}`, //Message sent to the share activity
  //         title: `${bedrooms} for rent`, //string	//Title sent to the share activity
  //       });
  //       //console.log(res);
  //     } catch (error: any) {
  //       //*Note that in the case of a user closing the share sheet without sharing, an error will be thrown.
  //       //Alert.alert(error.message);
  //       //err && console.log(err);
  //     }  style={{ marginBottom: 2 }}

  //   };
  //   onShare();
  //   /** */
  // }, []);

  return (
    <Pressable
      className="mb-4 bg-white p-3  rounded-md"
      onPress={() =>
        router.push({ pathname: "/view", params: { id: listing._id } })
      }
    >
      {isAlertVisible && (
        <LoginAlert visible={isAlertVisible} handleClose={handleLoginAlert} />
      )}

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
    </Pressable>
  );
};

const Home = () => {
  const insets = useSafeAreaInsets();
  const filters = useAppSelector(selectSearchFilters);

  const token = useAppSelector(selectCurrentToken);
  const bottomSheetFilterRef = useRef<BottomSheetModal>(null);

  const [listingData, setListingData] = useState<IListing[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [bedrooms, setBedrooms] = useState<string>(filters?.bedrooms || "");

  const dispatch = useAppDispatch();

  const listRef = useRef<FlatList>(null);

  // variables//possible snap points/height of sheet can be: ["25%", "50%","95%"]
  const snapPoints = useMemo(() => ["95%"], []);

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  /* -------------------------------------------------------------
   FETCH WISHLIST->when token is valid
   ----------------------------------------------------------------*/
  const { data: wishlist } = useGetWishlistQuery(undefined, {
    skip: !token,
    // pollingInterval: 1000 * 5,//in ms
    // refetchOnFocus: true,
    //last fetched time > 10 secs, refetch//use true |10
    refetchOnMountOrArgChange: true, //in secs
  });

  /* -------------------------------------------------------------
   FETCH LISTINGS
   ----------------------------------------------------------------*/
  const {
    currentData: data, //The latest returned result regardless of hook arg, if present.
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
   HANDLE LOAD MORE ON END REACHED
   ----------------------------------------------------------------*/
  const loadMore = useCallback(() => {
    //important->or it will keep on refetching esp if items are smaller than screen size
    if (isError) return;
    setPage((prev) => prev + 1);
  }, []);

  /**---------------------------------------------------------
   * FILTERS BTM SHEET
   ----------------------------------------------------------*/

  //open/snap bottom sheet to a defined snap point
  const handleFilterSheetOpen = useCallback(() => {
    //return bottomSheetFilterRef.current?.snapToIndex(snapPoints.length - 1);
    return bottomSheetFilterRef.current?.present();
  }, []);
  //close btm sheet
  const handleFilterSheetClose = useCallback(() => {
    //return bottomSheetFilterRef.current?.close();
    return bottomSheetFilterRef.current?.dismiss();
  }, []);

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
    //all values are numbers
    //     {
    //   nativeEvent: {
    //     contentInset: {bottom, left, right, top},
    //     contentOffset: {x, y},
    //     contentSize: {height, width},
    //     layoutMeasurement: {height, width},
    //     zoomScale
    //   }
    // }
    const scrollOffset = nativeEvent.contentOffset.y;
    setScrollPosition(scrollOffset);
  };

  /* -------------------------------------------------------------
   HANDLE CLEAR FILTERS
   ----------------------------------------------------------------*/
  const handleClearFilters = useCallback(() => {
    dispatch(resetFilters());
    setBedrooms("");
  }, []);

  //update bedroom filter in store
  useEffect(() => {
    //debounce dispatch->2 sec
    const timerId = setTimeout(() => {
      dispatch(
        addToFilters({
          bedrooms,
        })
      );
    }, 2000);

    return () => clearTimeout(timerId);
  }, [bedrooms]);

  //when filters change, reset page
  useEffect(() => {
    setPage(1);
    setBedrooms(filters?.bedrooms || "");
  }, [filters]);

  return (
    <View style={{ flex: 1, paddingTop: insets.top }} className="mt-4 relative">
      {/**'auto', 'inverted', 'light', 'dark' */}
      <StatusBar style="auto" backgroundColor="#fff" />

      <View className="px-3">
        <SearchBar handleOpen={handleFilterSheetOpen} />
      </View>

      <View className="pt-4 px-3">
        <BedroomsBar bedrooms={bedrooms} setBedrooms={setBedrooms} />
      </View>

      {!!Object.keys(filters).length && filters?.bedrooms && (
        <View className="flex-row justify-between items-center px-4 py-2">
          <Text className="">Results {data?.total || 0}</Text>
          <Pressable onPress={handleClearFilters}>
            <Text className="text-red underline">Clear filters</Text>
          </Pressable>
        </View>
      )}

      <View className="p-4">
        <FlatList
          ref={listRef}
          onScroll={handleScroll} //Fires at most once per frame during scrolling.
          keyboardShouldPersistTaps={"handled"} //important for locationPicker else onPress gets no results//the keyboard will not dismiss automatically when the tap was handled by children
          //KeyboardAwareFlatList->handles keyboard appearance and automatically scrolls to focused TextInput->others KeyboardAwareSectionList | KeyboardAwareScrollView
          data={listingData}
          onRefresh={refetch} // standard RefreshControl will be added for "Pull to Refresh" functionality.
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          onEndReached={loadMore} //update current page/fetch more//infinite scrolling
          //How far from the end (in units of visible length of the list) the trailing edge of the list must be from the end of the content to trigger the onEndReached callback.
          //It accepts a value between 0 and 1, where 0 is the end of the list.
          onEndReachedThreshold={0.5} //default=0.5
          //onStartReached//Called once when the scroll position gets within within onStartReachedThreshold from the logical start of the list.
          //onStartReachedThreshold//How far from the start (in units of visible length of the list) the leading edge of the list must be from the start of the content to trigger the onStartReached callback.
          //Rendered in between each item, but not at the top or bottom. Type: component | JSX.Element
          //@ts-ignore//accep
          // ItemSeparatorComponent={<List.Subheader>Some title</List.Subheader>}
          ////function/component or React.ReactNode//Rendered at the top of all the items
          ListHeaderComponent={<View></View>}
          renderItem={({ item }: { item: IListing }) => (
            <ListingItem listing={item} wishlist={wishlist!} />
          )}
          keyExtractor={(item) => item._id}
          // ListFooterComponent={
          //   <View className="flex-row justify-center py-2">
          //     {isFetching && (
          //       <ActivityIndicator size="large" color={colors.gray.DEFAULT} />
          //     )}
          //   </View>
          // } //function/component or React.ReactNode//rendered bottom of list
        />
      </View>

      <BottomSheet
        handleClosePress={handleFilterSheetClose}
        ref={bottomSheetFilterRef}
        snapPoints={snapPoints}
        title="Filters"
      >
        <Filters />
      </BottomSheet>

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

export default Home;
