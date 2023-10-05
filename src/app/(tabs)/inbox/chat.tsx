import { Text, View, useWindowDimensions } from "react-native";
import { Avatar, Button, List } from "react-native-paper";
import { useEffect, useState, useCallback } from "react";

import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCurrentToken } from "@/redux/auth/authSlice";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import {
  IChat,
  useGetChatQuery,
  usePostMessageMutation,
} from "@/redux/chat/chatApiSlice";
import { IListing } from "@/types/listing";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { PROFILE_PIC_ROOT } from "@/constants/paths";
import { useGetUserQuery } from "@/redux/auth/userApiSlice";

const Chat = () => {
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const params = useLocalSearchParams<{ recipient: string }>();

  const recipient = JSON.parse(params.recipient);

  const [messages, setMessages] = useState<IMessage[]>([]);

  const token = useAppSelector(selectCurrentToken);

  const [postNew, { data, error, isLoading, isSuccess, isError }] =
    usePostMessageMutation();

  /* -------------------------------------------------------------
   FETCH USER
   ----------------------------------------------------------------*/
  const { currentData: user } = useGetUserQuery(undefined, {
    skip: !token,
    //pollingInterval: 1000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: 50, //refetch if 5o secs have passed since last refresh
  });

  /* -------------------------------------------------------------
   FETCH CHAT
   ----------------------------------------------------------------*/
  const { currentData: messagesData, isFetching } = useGetChatQuery(
    { itemsPerPage, page, recipientId: recipient._id },
    {
      skip: !recipient,
      //pollingInterval: 1000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: 50, //refetch if 5o secs have passed since last refresh
    }
  );

 
  useEffect(() => {
    setMessages((prev) => {
      //make sure no duplicate data
      const currentList = prev.map((item) => item._id);

      const newData =
        messagesData?.messages?.filter(
          (item) => !currentList.includes(item._id)
        ) ?? [];

      //format fetched messages properly
      const fetchedMessages = newData.map((message) => {
        return {
          _id: message._id,
          text: message.content,
          createdAt: new Date(message.createdAt),
          sent: true,
          received: message.isRead,
          user: {
            _id: message.sender?._id,
            name: message.sender?.username,
            avatar: `${PROFILE_PIC_ROOT}/${message.sender?.profilePic?.filename}`,
          },
        } as IMessage;
      });

      return [...fetchedMessages, ...prev];
    });
  }, [messagesData]);

  const onSend = useCallback(async (messages: IMessage[] = []) => {
    // setMessages((previousMessages) =>
    //   GiftedChat.append(previousMessages, messages)
    // );
    //our new message
    const { _id, createdAt, text, user } = messages[0];
    //save message to db
    const formData = new FormData();
    //append chat files
    //Important: don't forget to check if file type in files is correct(eg format image/jpeg)//else Network error or nothing or multer will return files a stringified array
    //  chatFiles.forEach((img, i) => {
    //    formData.append("files", img as any); //if value is not a string | Blob/File, it will be converted to string
    //  });
    //append the rest
    formData.append("content", text);
    formData.append("recipient", recipient._id); //note: FormData would convert undefined/null -> "undefined"/"null"

    await postNew(formData);
  }, []);

  /* -------------------------------------------------------------
   HANDLE LOAD EARLIER
   ----------------------------------------------------------------*/
  const loadMore = useCallback(() => {
    //important->or it will keep on refetching esp if items are smaller than screen size
    if (isError) return;
    setPage((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // setMessages([ 
    //   {
    //     _id: "doc.id",
    //     text: "doc.data().text",
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: "React Native",
    //       avatar: "https://placeimg.com/140/140/any",
    //     },
    //     //image?: string;
    //     // video?: string;
    //     //sent?: boolean;// Mark the message as sent, using one tick
    //     //received?: boolean;// Mark the message as received, using two tick
    //     //pending?: boolean;// Mark the message as pending with a clock loader
    //     //click IMessage to see other properties that IMessage contains
    //   } as IMessage,
    // ]);
  }, []);

  //feedback
  useEffect(() => {
    if (isError) {
      Toast.show({ type: "error", text1: error as string });
    }
    //on success
    if (isSuccess && data?.chatId) {
      Toast.show({
        type: "success", // error || info
        text1: data?.message,
      });
    }
  }, [isError, isSuccess, data]);

  if (!token)
    return (
      <View
        className="flex-1 px-4 py-8 bg-white"
        style={{ flex: 1, paddingTop: insets.top }}
      >
        <Text className="text-gray-dark font-bold text-lg mb-2">
          Log in to see messages from agents
        </Text>
        <Text className="text-gray-muted text-md mb-3">
          You can chat with agents directly with our real-time chat
        </Text>
        <Button
          className="bg-emerald"
          // icon="google" //any MaterialCommunityIcons icon name//see https://icons.expo.fyi/Index
          mode="contained"
          onPress={() => router.push("/login")}
          uppercase //boolean//Make the label text uppercased
          //labelStyle={{fontSize: 20}}  //Style for the button text.
          style={{ width: "30%", borderRadius: 5 }} //not fontSize
        >
          Log in
        </Button>
      </View>
    );

  return (
    <View className=" flex-1" style={{ flex: 1, paddingTop: insets.top }}>
      <List.Item
        className="border-b border-gray-light"
        style={{ paddingLeft: 15 }}
        //descriptionStyle={{}}
        // descriptionNumberOfLines={2} //default 2
        // onPress={() => {}}
        titleStyle={{ color: "#000" }}
        title={<Text className="text-gray">{recipient?.username}</Text>}
        left={() => (
          <Avatar.Icon
            size={40}
            icon={({ size, color }) => {
              size = size + 20;
              return recipient.profilePic ? (
                <Image
                  source={`${PROFILE_PIC_ROOT}/${recipient.profilePic?.filename}`}
                  className="rounded-full"
                  style={{ width: size, height: size }}
                />
              ) : (
                <FontAwesome name="user-o" size={20} color="black" />
              );
            }}
            color="#10b981"
            style={{ backgroundColor: "#e2e8f0" }}
          />
        )}
        right={() => (
          <Button
            onPress={() => router.push("/inbox/")}
            className="rounded-md bg-red  "
            icon="exit-to-app"
            mode="contained"
            compact
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
            Exit
          </Button>
        )}
      />

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: `${user?._id || Math.random() * 15}`, //can get userId from token->jwt-decode->_id
          name: user?.username || "Guest",
          avatar: `${PROFILE_PIC_ROOT}/${user?.profilePic?.filename}`,
        }}
        messagesContainerStyle={{ backgroundColor: "#f7f4f2" }}
        isTyping // (Bool) - Typing Indicator state; default false
        //alwaysShowSend (Bool) - Always show send button in input text composer; default false, show only when text input is not empty
        //renderTicks (Function(message)) - Custom ticks indicator to display message status
        //bottomOffset={100} //(Integer) - Distance of the chat from the bottom of the screen (e.g. useful if you display a tab bar)
        scrollToBottom // (Bool) - Enables the scroll to bottom Component (Default is false)
        showUserAvatar // (Bool) - Whether to render an avatar for the current user; default is false, only show avatars for other users
        onLoadEarlier={loadMore} //(Function) - Callback when loading earlier messages
        isLoadingEarlier={isFetching} // (Bool) - Display an ActivityIndicator when loading earlier messages
        loadEarlier //(Bool) - Enables the "load earlier messages" button, required for infiniteScroll
        infiniteScroll //(Bool) - infinite scroll up when reach the top of messages container, automatically call onLoadEarlier function if exist (not yet supported for the web). You need to add loadEarlier prop too.
      />
    </View>
  );
};

export default Chat;
