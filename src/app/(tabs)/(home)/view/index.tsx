import ListingItem from "@/components/listings/ListingItem";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  SectionList,
  Text,
  View,
  useWindowDimensions,
  Linking,
} from "react-native";
import {
  Button,
  DataTable,
  Dialog,
  Divider,
  IconButton,
  Portal,
  TextInput,
} from "react-native-paper";
// import {
//   useScrollIntoView,
//   wrapScrollView,
// } from "react-native-scroll-into-view";
import { Carousel, Pagination } from "react-native-snap-carousel";
import { Image } from "expo-image";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCurrentToken } from "@/redux/auth/authSlice";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import CustomTabBar from "@/components/common/CustomTabBar";
import { KeyboardAwareSectionList } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IListing } from "@/types/listing";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useGetListingQuery } from "@/redux/listings/view/viewApiSlice";
import AlertDialog from "@/components/common/AlertDialog";
import useSubscription from "@/hooks/useSubscription";
import Toast from "react-native-toast-message";
import useAuth from "@/hooks/useAuth";
import {
  useDepositMutation,
  useGetWalletInfoQuery,
} from "@/redux/wallet/walletApiSlice";
import SwipeableViews from "@/components/common/SwipeableViews";

type PaymentAlertProps = {
  visible: boolean;
  handleClose: () => void;
};

const PaymentAlert = ({ visible, handleClose }: PaymentAlertProps) => {
  const [phone, _id] = useAuth();

  const [deposit, { isLoading, isSuccess, isError, error, data }] =
    useDepositMutation();

  const [phoneNumber, setPhoneNumber] = useState(phone || "");

  const [isInvalidAmount, setIsInvalidAmount] = useState(false);

  const [amount, setAmount] = useState("20");

  /* -------------------------------------------------------------
   FETCH WALLET INFO
   ----------------------------------------------------------------*/
  const { data: wallet } = useGetWalletInfoQuery(undefined, {
    skip: !isSuccess, //start polling when prompt is sent
    // pollingInterval: 1000 * 5,//in ms
    // refetchOnFocus: true,
    //last fetched time > 10 secs, refetch//use true |10
    refetchOnMountOrArgChange: 10, //in secs
  });

  const handleSubmit = async () => {
    if (parseInt(amount) < 20) return setIsInvalidAmount(true);

    await deposit({ phoneNumber, amount: parseInt(amount) });
  };

  useEffect(() => {
    if (parseInt(amount) >= 20) return setIsInvalidAmount(false);
  }, [amount]);

  useEffect(() => {
    if (wallet?.balance) {
      handleClose();
      Toast.show({
        type: "success",
        text1: "Thank you for the tea! You can now view all contacts. ",
      });
    }
  }, [wallet]);

  return (
    <View>
      <AlertDialog visible={visible} handleClose={handleClose}>
        <View className="gap-y-3 px-4 pb-10">
          {isSuccess ||
            (isError && (
              <Text className="text-red">
                {isError &&
                  "Oops! The prompt couldn't be sent. Please try again or send the money to our Till"}

                {isSuccess &&
                  "Prompt sent. Please check your phone and confirm payment."}
              </Text>
            ))}

          <Text className="font-bold text-lg">
            Buy us a cup of tea to unlock contacts
          </Text>

          <Text className="text-gray-muted">
            Enter your phone number and amount not less than Ksh 20 to unlock
            all contacts.
          </Text>

          <Text className="text-muted-main">
            We will send a prompt to your phone to confirm payment.
          </Text>

          <TextInput
            keyboardType="number-pad"
            dense
            mode="outlined"
            //dense//Sets min height with densed layout//adds paddingVertical
            //placeholder="0"
            label="Phone number"
            // value={brokerFee}
            //onChangeText={(text) => setBrokerFee(text)}
            left={<TextInput.Affix text="+254" />}
          />

          <TextInput
            keyboardType="number-pad"
            value={amount}
            onChangeText={(text) =>
              setAmount(String(parseInt(text.replace(/[^0-9]/g, ""))) || "0")
            }
            dense
            mode="outlined"
            //dense//Sets min height with densed layout//adds paddingVertical
            //placeholder="0"
            label="Phone number"
            // value={brokerFee}
            //onChangeText={(text) => setBrokerFee(text)}
            left={<TextInput.Affix text="Ksh" />}
          />

          {isInvalidAmount && (
            <Text className="text-red">Minimum amount is Ksh 20</Text>
          )}

          <Text className="text-muted-main py-1">
            Didn't get the prompt? Send the amount to our Till Number: 34555555
          </Text>

          <View className="py-2">
            <Button loading={isLoading} mode="contained" onPress={handleSubmit}>
              Submit
            </Button>
          </View>
        </View>
      </AlertDialog>
    </View>
  );
};

const ViewListing = () => {
  const insets = useSafeAreaInsets();

  const timeLeft = useSubscription();
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);
  // const scrollIntoView = useScrollIntoView();
  const scrollRef = useRef<SectionList>(null);

  const [activeTab, setActiveTab] = useState<string | JSX.Element>(
    "Main specs"
  );

  const { id, from } = useLocalSearchParams<{ id: string; from: any }>();

  const [listing, setListing] = useState<Partial<IListing>>({});

  const [scrollPosition, setScrollPosition] = useState(0);

  /* -------------------------------------------------------------
   FETCH LISTING
   ----------------------------------------------------------------*/
  const {
    currentData: data, //The latest returned result for the current hook arg, if present.
    //data//The latest returned result regardless of hook arg, if present.
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetListingQuery(id ?? skipToken, {
    // pollingInterval: 1000 * 5,
    // refetchOnFocus: true,
    //last fetched time > 10 secs, refetch//use true |10
    //refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    setListing(data || {});
  }, [data]);

  /* -------------------------------------------------------------
    HANDLE TAB CHANGE
   ----------------------------------------------------------------*/
  const handleTabChange = (tab: string | JSX.Element) => {
    if (tab === "Directions") {
      router.push({
        pathname: "/view/direction",
        params: { location: JSON.stringify(listing.location || "") },
      });
      return setActiveTab("Basic");
    }

    setActiveTab(tab);

    let sectionIndex = 0;
    if (tab === "Amenities") sectionIndex = 1;
    if (tab === "Policies") sectionIndex = 2;
    //scroll to section
    scrollRef.current?.scrollToLocation({
      sectionIndex,
      itemIndex: 0,
      //viewOffset: 140,
      //animated: true,//Defaults to true.
    });
  };

  /* -------------------------------------------------------------
   HANDLE ON SCROLL->GET POSITION
   ----------------------------------------------------------------*/
  const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
    const scrollOffset = nativeEvent.contentOffset.y;
    setScrollPosition(scrollOffset);
  };

  const handlePaymentToggle = () => {
    setIsPaymentVisible((prev) => !prev);
  };

  const DATA = [
    {
      title: "Main specs",
      data: [
        {
          key: "Bedroom",
          value: listing.bedrooms,
        },
        {
          key: "Bathroom",
          value: listing.bathrooms,
        },
        {
          key: "kitchen",
          value: listing.kitchen,
        },
        {
          key: "Rent",
          value: `Ksh ${listing.price}`,
        },
        {
          key: "Management",
          value: listing.management,
        },
        {
          key: "ListedBy",
          value: listing.listedBy,
        },
        {
          key: "BrokerFee",
          value: `Ksh ${listing.brokerFee}`,
        },
      ],
    },
    {
      title: "Amenities",
      data: [
        {
          key: "Water 7days/week",
          value: listing.amenities?.water ? "✔️" : "❌",
        },
        {
          key: "Borehole",
          value: listing.amenities?.borehole ? "✔️" : "❌",
        },
        {
          key: "Parking",
          value: listing.amenities?.parking ? "✔️" : "❌",
        },
        {
          key: "Wifi",
          value: listing.amenities?.wifi ? "✔️" : "❌",
        },
        {
          key: "Pool",
          value: listing.amenities?.pool ? "✔️" : "❌",
        },
        {
          key: "cctv",
          value: listing.amenities?.cctv ? "✔️" : "❌",
        },
        {
          key: "Watchman",
          value: listing.amenities?.watchman ? "✔️" : "❌",
        },
        {
          key: "Gym",
          value: listing.amenities?.gym ? "✔️" : "❌",
        },
      ],
    },
    {
      title: "Policies",
      data:
        listing.policies?.map((policy, i) => ({ key: i + 1, value: policy })) ||
        [],
    },
  ];

  return (
    <View
      className="flex-1 relative pb-[60]"
      style={{ flex: 1, paddingTop: insets.top }}
    >
      <StatusBar style="auto" backgroundColor="transparent" />
      <View>
        {isPaymentVisible && (
          <PaymentAlert
            visible={isPaymentVisible}
            handleClose={handlePaymentToggle}
          />
        )}
      </View>

      <SwipeableViews
        images={listing.listingImages!}
        imageStyle={{ height: 200 }}
        className="h-[200]"
        // offset={50}
        startIcon="angle-left"
        endIcon="share-alt"
        endIconColor="#eee"
        startIconColor="#fff"
        startButtonPress={() => router.push(from || "/")}
      />

      <View className="px-4 pt-2 pb-1 bg-white gap-y-1">
        <Text className="text-lg font-semibold">{listing.bedrooms}</Text>
        <Text className="text-md text-gray-muted">
          {listing.location?.description}
        </Text>

        <Text className="text-lg font-semibold">Ksh {listing.price}/mo</Text>
      </View>

      <View>
        <CustomTabBar
          className="mb-4 mt-3 "
          style={{ elevation: 1 }}
          tabs={["Main specs", "Amenities", "Policies"]}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
      </View>

      <SectionList
        //onStartReachedThreshold//How far from the start (in units of visible length of the list) the leading edge of the list must be from the start of the content to trigger the onStartReached callback.
        //onStartReached//(info: {distanceFromStart: number}) => void//Called once when the scroll position gets within within onStartReachedThreshold from the logical start of the list.
        //initialScrollIndex
        onScroll={handleScroll}
        ref={scrollRef}
        ListHeaderComponent={<View></View>}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]} //An array of child indices determining which children get docked to the top of the screen when scrolling.
        //initialNumToRender={10}//default/10//How many items to render in the initial batch.
        onRefresh={refetch} //function// standard RefreshControl will be added for "Pull to Refresh" functionality.
        refreshing={isFetching} //Set this true while waiting for new data from a refresh.
        // stickySectionHeadersEnabled={true} ////default: false in android//Makes section headers stick to the top of the screen until the next one pushes it off.
        sections={DATA}
        keyExtractor={(item, index) => item.key}
        renderItem={({ item }) => (
          <View>
            <DataTable.Row>
              <DataTable.Cell className="font-semibold">
                {item.key}
              </DataTable.Cell>
              <DataTable.Cell>{item.value}</DataTable.Cell>
            </DataTable.Row>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View className=" px-2 py-1  ">
            <Text className="text-lg font-semibold">{title}</Text>
          </View>
        )}
        // ListFooterComponent={
        //   <View className="py-3 flex-row ">
        //     <Text>scroll to top</Text>
        //   </View>
        // }
      />

      <View className="p-2 absolute bottom-0  w-full border-gray-light bg-white  border-t-2">
        <View className="flex-row justify-center gap-x-4">
          <Button
            icon="message"
            onPress={() =>
              timeLeft
                ? handlePaymentToggle()
                : router.push({
                    pathname: "/inbox/chat",
                    params: { recipient: JSON.stringify(listing.user) },
                  })
            }
          >
            Chat
          </Button>

          <Button
            icon="message"
            onPress={() =>
              timeLeft
                ? handlePaymentToggle()
                : Linking.openURL(
                    `whatsapp://send?phone=${listing.user?.phoneNumber}`
                  )
            }
          >
            WhatsApp
          </Button>
          <Button
            icon="message"
            onPress={() =>
              !timeLeft
                ? handlePaymentToggle()
                : Linking.openURL(`tel:${listing.user?.phoneNumber}`)
            }
          >
            Call
          </Button>
        </View>
      </View>

      {scrollPosition > 100 && (
        <IconButton
          className="bg-gray/30 absolute bottom-20 right-0"
          mode="contained-tonal"
          size={20}
          //labelStyle={{ fontSize: 30 }}
          //containerColor
          icon="chevron-up"
          iconColor="#fff"
          onPress={() => handleTabChange("Main specs")}
        />
      )}
    </View>
  );
};
export default ViewListing;
