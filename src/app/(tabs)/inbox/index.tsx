import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  Text,
  View,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { Avatar, Button, Divider, IconButton, List } from "react-native-paper";
import Toast from "react-native-toast-message";

import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCurrentToken } from "@/redux/auth/authSlice";
import {
  IChat,
  useGetChatsQuery,
  useMarkAsReadMutation,
} from "@/redux/chat/chatApiSlice";

import CustomTabBar from "@/components/common/CustomTabBar";
import { IListing } from "@/types/listing";
import { router, usePathname } from "expo-router";
import colors from "@/constants/colors";
import { Image } from "expo-image";
import { PROFILE_PIC_ROOT } from "@/constants/paths";
import { FontAwesome } from "@expo/vector-icons";

type InboxItemProps = {
  listing: IListing;
};

const InboxItem = ({ listing }: InboxItemProps) => {
  /* -------------------------------------------------------------
   REMOVE INBOX
   ----------------------------------------------------------------*/
  const [markAsRead, { data, error, isLoading, isError, isSuccess }] =
    useMarkAsReadMutation();

  const handleRemove = async () => {
    await markAsRead(listing._id);
  };

  //feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) Toast.show({ type: "success", text1: data?.message });
  }, [isError, isSuccess]);

  return <View></View>;
};

const Chats = () => {
  const layout = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const token = useAppSelector(selectCurrentToken);

  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentId, setCurrentId] = useState("");

  const [chatsData, setChatsData] = useState<IChat[]>([]);

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);  

  const pathname = usePathname();

  /* -------------------------------------------------------------
   FETCH CHATS
   ----------------------------------------------------------------*/
  const { data, isFetching, isSuccess, isError, error, refetch } =
    useGetChatsQuery(
      { itemsPerPage, page },
      {
        skip: !token,
        //pollingInterval: 15000,
        //refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
      }
    );
  useEffect(() => {
    setChatsData((prev) => {
      //make sure no duplicate data
      const currentList = prev.map((item) => item.chatId);

      const newData =
        data?.chats?.filter((item) => !currentList.includes(item.chatId)) ?? [];

      return [...prev, ...newData];
    });
  }, [data]);
 
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
    <View className=" ">
      <View className="">
        <FlatList
          ref={listRef}
          onScroll={handleScroll} //Fires at most once per frame during scrolling.
          keyboardShouldPersistTaps={"handled"} //important for locationPicker else onPress gets no results//the keyboard will not dismiss automatically when the tap was handled by children
          //KeyboardAwareFlatList->handles keyboard appearance and automatically scrolls to focused TextInput->others KeyboardAwareSectionList | KeyboardAwareScrollView
          data={chatsData}
          onRefresh={refetch} // standard RefreshControl will be added for "Pull to Refresh" functionality.
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          onEndReached={loadMore} //update current page/fetch more//infinite scrolling
          //How far from the end (in units of visible length of the list) the trailing edge of the list must be from the end of the content to trigger the onEndReached callback.
          //It accepts a value between 0 and 1, where 0 is the end of the list.
          onEndReachedThreshold={0.3}
          ListHeaderComponent={<View></View>}
          renderItem={({ item }: { item: IChat }) => (
            <Pressable
              key={item.chatId}
              onPress={() =>
                router.push({
                  pathname: "/inbox",
                  params: { recipient: JSON.stringify(item.recipient) },
                })
              }
            >
              <List.Item
                className="px-4 "
                title={
                  <Text className="text-lg  font-semibold dark:text-gray-light">
                    {item?.content}
                  </Text>
                }
                description={item.sender?.username}
                left={(props) => (
                  <Avatar.Icon
                    size={40}
                    icon={({ size, color }) => {
                      size = size + 20;
                      return item.sender?.profilePic ? (
                        <Image
                          source={`${PROFILE_PIC_ROOT}/${item.sender?.profilePic?.filename}`}
                          className="rounded-full"
                          style={{ width: size, height: size }}
                        />
                      ) : (
                        <FontAwesome name="user-o" size={20} color="black" />
                      );
                    }}
                    color={colors.gray.muted}
                    style={{ backgroundColor: "#e2e8f0" }}
                  />
                )}
                right={(props) => (
                  <Text className="text-emerald">({item.unreadCount})</Text>
                )}
              />
              <Divider />
            </Pressable>
          )}
          keyExtractor={(item) => item.chatId}
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

export default Chats;
