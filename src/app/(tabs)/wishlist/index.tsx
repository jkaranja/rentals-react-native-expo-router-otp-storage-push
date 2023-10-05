import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Text,
  View,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { Button, IconButton } from "react-native-paper";
import Toast from "react-native-toast-message";

import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCurrentToken } from "@/redux/auth/authSlice";
import {
  IWishlist,
  IWishlistResult,
  useGetWishlistQuery,
  useRemoveWishlistMutation,
} from "@/redux/listings/wishlist/wishlistApiSlice";
import { IListing } from "@/types/listing";
import { FontAwesome } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import SwipeableViews from "@/components/common/SwipeableViews";

type ListingProps = {
  wishlist: IWishlist;
};

const ListingItem = ({ wishlist }: ListingProps) => {
  const token = useAppSelector(selectCurrentToken);

  /* -------------------------------------------------------------
   REMOVE FROM WISHLIST
  ----------------------------------------------------------------*/
  const [removeWishlist, { isLoading: isRemoving }] =
    useRemoveWishlistMutation();

  return (
    <Pressable
      className="mb-4 bg-white p-3  rounded-md"
      onPress={() =>
        router.push({
          pathname: "/view",
          params: { id: wishlist.listing?._id },
        })
      }
    >
      <SwipeableViews
        images={wishlist.listing?.listingImages}
        imageStyle={{ borderRadius: 4 }}
        offset={50}
        startIcon="remove"
        endIcon="share-alt"
        endIconColor="#eee"
        startIconColor="red"
        startButtonPress={() => removeWishlist(wishlist._id)}
        handlePress={() =>
          router.push({
            pathname: "/view",
            params: { id: wishlist.listing?._id },
          })
        }
      />

      <View className="gap-y-1">
        <Text className="text-gray-darker text-lg font-bold pt-1 ">
          {wishlist.listing?.bedrooms}
        </Text>
        <Text className="text-gray-muted text-sm  ">
          {wishlist.listing.location?.description}
        </Text>
        <Text className="text-gray-darker  text-md font-medium  ">
          Ksh {wishlist.listing.price}/mo
        </Text>
      </View>
    </Pressable>
  );
};

const WishList = () => {
  const layout = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const token = useAppSelector(selectCurrentToken);

  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentId, setCurrentId] = useState("");

  const [wishlistData, setWishlistData] = useState<Array<IWishlist>>([]);

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const pathname = usePathname();

  /* -------------------------------------------------------------
   FETCH WISHLIST
   ----------------------------------------------------------------*/
  const { data, isFetching, isSuccess, isError, error, refetch } =
    useGetWishlistQuery(
      { itemsPerPage, page },
      {
        //pollingInterval: 15000,
        //refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
      }
    );
  useEffect(() => {
    setWishlistData((prev) => {
      //make sure no duplicate data
      const currentList = prev.map((item) => item._id);

      const newData =
        data?.listings?.filter((item) => !currentList.includes(item._id)) ?? [];

      return [...prev, ...newData];
    });
  }, [data]);

  /* -------------------------------------------------------------
   REMOVE FROM WISHLIST
  ----------------------------------------------------------------*/
  const [removeWishlist, { isSuccess: removeSuccess, isLoading }] =
    useRemoveWishlistMutation();

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

  if (!wishlistData.length && !isFetching) {
    return <Text className="text-gray-muted p-4">No listing added</Text>;
  }

  return (
    <View className="flex-1 px-4 relative">
      <View className="flex-1">
        <FlatList
          ref={listRef}
          onScroll={handleScroll} //Fires at most once per frame during scrolling.
          keyboardShouldPersistTaps={"handled"} //important for locationPicker else onPress gets no results//the keyboard will not dismiss automatically when the tap was handled by children
          //KeyboardAwareFlatList->handles keyboard appearance and automatically scrolls to focused TextInput->others KeyboardAwareSectionList | KeyboardAwareScrollView
          data={wishlistData}
          onRefresh={refetch} // standard RefreshControl will be added for "Pull to Refresh" functionality.
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          onEndReached={loadMore} //update current page/fetch more//infinite scrolling
          //How far from the end (in units of visible length of the list) the trailing edge of the list must be from the end of the content to trigger the onEndReached callback.
          //It accepts a value between 0 and 1, where 0 is the end of the list.
          onEndReachedThreshold={0.3}
          ListHeaderComponent={<View></View>}
          renderItem={({ item }: { item: IWishlist }) => (
            <ListingItem wishlist={item} />
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

export default WishList;
