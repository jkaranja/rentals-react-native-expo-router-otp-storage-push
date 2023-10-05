import AlertDialog from "@/components/common/AlertDialog";
import CustomTabBar from "@/components/common/CustomTabBar";
import FilterBottomSheet from "@/components/common/BottomSheet";
import ListingItem from "@/components/listings/ListingItem";
import SearchBar from "@/components/listings/SearchBar";
import SearchFilters from "@/components/listings/SearchFilters";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCurrentToken } from "@/redux/auth/authSlice";
import { useGetAllListingsQuery } from "@/redux/listings/live/liveApiSlice";
import {
  addToFilters,
  selectSearchFilters,
} from "@/redux/listings/listingSlice";
import {
  useAddWishlistMutation,
  useGetWishlistQuery,
  useRemoveWishlistMutation,
} from "@/redux/listings/wishlist/wishlistApiSlice";
import { selectMode } from "@/redux/theme/themeSlice";
import { IListing } from "@/types/listing";
import formatListingDate from "@/utils/formatListingDate";
import { FontAwesome } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Button, IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Share from "react-native-share";

const Home = () => {
  const insets = useSafeAreaInsets();

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const token = useAppSelector(selectCurrentToken);
  const [bedrooms, setBedrooms] = useState<string>("");
  const [currentId, setCurrentId] = useState("");
  const [listingData, setListingData] = useState<IListing[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeTab, setActiveTab] = useState<string | JSX.Element>("All");

  const dispatch = useAppDispatch();
  const bottomSheetFilterRef = useRef<BottomSheetModal>(null);

  const listRef = useRef<FlatList>(null);

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const filters = useAppSelector(selectSearchFilters);

  // variables//possible snap points/height of sheet can be: ["25%", "50%","95%"]
  const snapPoints = useMemo(() => ["95%"], []);

  const hideDialog = () => setIsAlertVisible(false);
  /* -------------------------------------------------------------
   ADD TO WISHLIST
  ----------------------------------------------------------------*/
  const [addWishlist, { isLoading }] = useAddWishlistMutation();
  /* -------------------------------------------------------------
   REMOVE FROM WISHLIST
  ----------------------------------------------------------------*/
  const [removeWishlist, { isLoading: isRLoading }] =
    useRemoveWishlistMutation();
  /* -------------------------------------------------------------
   FETCH WISHLIST->when token is valid
   ----------------------------------------------------------------*/
  const { currentData: wishlistData } = useGetWishlistQuery(undefined, {
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
    data, //The latest returned result regardless of hook arg, if present.
    //currentData////The latest returned result for the current hook arg, if present.
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetAllListingsQuery(
    { itemsPerPage, page, bedrooms: filters?.bedrooms || "" },
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
        data?.filter((item) => !currentList.includes(item._id)) ?? [];

      return [...prev, ...newData];
    });
  }, [data]);

  /**---------------------------------------------------------
   * HANDLE TAB CHANGE
   ----------------------------------------------------------*/
  const handleTabChange = (tab: string | JSX.Element) => {
    let bedroom = tab;
    if (tab === "All") bedroom = "";
    if (tab === "1 Bedroom" || tab === "2 Bedrooms")
      bedroom = parseInt(tab).toString();
    if (tab === "3+ Bedrooms") bedroom = "3+";
    setActiveTab(tab);
    setBedrooms(bedroom as string);
  };

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
   HANDLE ON END REACHED
   ----------------------------------------------------------------*/
  const loadMore = useCallback(() => {
    //important->or it will keep on refetching esp if items are smaller than screen size
    if (isError) return;
    setPage((prev) => prev + 1);
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

  /**---------------------------------------------------------
   * SHARE LISTING VIA SOCIAL NETWORKS
   ----------------------------------------------------------*/
  //open/snap bottom sheet to a defined snap point
  const handleShareListing = useCallback((listing: IListing) => {
    const bedrooms = parseInt(listing?.bedrooms as string)
      ? `${listing?.bedrooms} Bedroom`
      : `${listing?.bedrooms}`;

    const onShare = async () => {
      try {
        //Option1: The open() method allows a user to share a premade message via a social medium they choose.
        //In other words, code specifies the message that will be sent and the user chooses to whom and the social medium through which the message will be sent.
        //you can use the react-native Share component but has limited options i.e only message & title
        //message and url are  concatenated to form = body of the message
        const shareResponse = await Share.open({
          message: `${bedrooms} for rent. Location: ${listing?.location?.description}`, //Message sent to the share activity
          title: `${bedrooms} for rent`, //string	//Title sent to the share activity
        });
        //console.log(res);
      } catch (error: any) {
        //*Note that in the case of a user closing the share sheet without sharing, an error will be thrown.
        //Alert.alert(error.message);
        //err && console.log(err);
      }
    };
    onShare();
    /** */
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

  return (
    <View style={{ flex: 1, paddingTop: insets.top }} className="mt-4 relative">
      {/**'auto', 'inverted', 'light', 'dark' */}
      <StatusBar style="auto" backgroundColor="#fff" />

      {isAlertVisible && (
        <AlertDialog visible={isAlertVisible} handleClose={hideDialog}>
          <View className="grow">
            <Text className="  text-lg mb-2">
              Log in to mange your wishlist
            </Text>
            <Text className="text-gray-muted text-md mb-3">
              You can add or remove items from your wishlists
            </Text>
            <Button
              className="bg-emerald"
              // icon="google" //any MaterialCommunityIcons icon name//see https://icons.expo.fyi/Index
              mode="contained"
              onPress={() => {
                router.push("/auth/login");
                setIsAlertVisible(false);
              }}
              uppercase //boolean//Make the label text uppercased
            >
              Log in
            </Button>
          </View>
        </AlertDialog>
      )}

      <View className="px-3">
        <SearchBar handleOpenPress={handleFilterSheetOpen} />
      </View>

      <CustomTabBar
        className="mt-4 "
        style={{ elevation: 1 }}
        tabs={[
          "All",
          "Bedsitter",
          "1 Bedroom",
          "2 Bedrooms",
          "3+ Bedrooms",
          "Single",
        ]}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

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
            <ListingItem
              style={{ marginBottom: 2 }}
              imageStyle={{ borderRadius: 4 }}
              className="bg-white p-3  rounded-md"
              offset={50}
              header={
                <View>
                  <IconButton
                    className="absolute top-2 right-0 bg-gray/20 "
                    icon={({ size, color }) => (
                      <FontAwesome name="share-alt" size={15} color={color} />
                    )}
                    iconColor="#eee"
                    //mode="outlined"
                    //selected
                    //containerColor="#fff"
                    size={8} //default=24
                    onPress={() => handleShareListing(item)}
                  />
                  <IconButton
                    icon={({ size, color }) => (
                      <FontAwesome name="heart" size={17} color={color} />
                    )}
                    className="absolute top-2  "
                    iconColor={
                      wishlistData?.some(
                        (wishlist) => wishlist.listing?._id === item._id
                      )
                        ? "red"
                        : "#000"
                    }
                    //mode="outlined"
                    //containerColor=
                    disabled={
                      item._id === currentId && (isLoading || isRLoading)
                    }
                    size={12}
                    onPress={() => {
                      if (!token) return setIsAlertVisible(true);
                      setCurrentId(item._id);
                      if (
                        wishlistData?.some(
                          (wishlist) => wishlist.listing?._id === item._id
                        )
                      ) {
                        removeWishlist(item._id);
                      } else {
                        addWishlist(item._id);
                      }
                    }}
                  />
                </View>
              }
              images={item.listingImages}
              handlePress={() =>
                router.push({ pathname: "/view", params: { id: item._id } })
              }
            >
              <View className="gap-y-1">
                <Text className="text-gray-darker text-lg font-bold pt-1 ">
                  {parseInt(item.bedrooms as string)
                    ? `${item.bedrooms} Bedroom`
                    : `${item.bedrooms}`}
                  {item.amenities?.parking && ` | parking`}{" "}
                  {item.amenities?.cctv && `| cctv`}
                </Text>
                <Text className="text-gray-muted text-sm  ">
                  {item.location?.description}
                </Text>
                <View className="flex-row justify-between">
                  <Text className="text-gray-darker  text-md font-medium  ">
                    Ksh {item.price}/mo
                  </Text>
                  <Text className="text-gray-muted text-sm  ">
                    {formatListingDate(new Date(item.createdAt))}
                  </Text>
                </View>
              </View>
            </ListingItem>
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

      <FilterBottomSheet
        handleClosePress={handleFilterSheetClose}
        ref={bottomSheetFilterRef}
        snapPoints={snapPoints}
        title="Filters"
      >
        <SearchFilters />
      </FilterBottomSheet>

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

const styles = StyleSheet.create({
  searchBar: {
    shadowColor: "#667085",
    //in android
    elevation: 10,
    //in ios
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  floatingBtn: {},
});

export default Home;
