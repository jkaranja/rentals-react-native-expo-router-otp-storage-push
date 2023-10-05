import { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

//handle the behavior when notifications are received when your app is foregrounded,
// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(
  expoPushToken: Notifications.ExpoPushToken
) {
  const message = {
    to: "ExponentPushToken[NSUhCXGvH32zIPdiTM9xkK]",
    sound: "default", //iOS only
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

   console.log("hello");
  //Push tickets or response
  //returns {data: [{"status": "ok", "id": "hhh"}, {..for next message in same order}]}//success
  //{data: [{"status": "error", "id": "hhh"}, {"status": "ok", "id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"}]}//some message failed
  //whole req failed: {"errors": [{"status": "4XX/5XX"}]}
 const res=  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message), //Body must be JSON and It may either be a single message object (as shown in the example above) or an array of up to 100 message objects, as long as they are all for the same project as shown below.
  });

  console.log(await res.json());

 
}

//or schedule a request
async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: {
      seconds: 2,
      //channelId: "new-emails" //channel in setNotificationChannelAsync
    },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  //must be a device:Push notifications don't work on emulators/simulators.
  if (Device.isDevice) {
    //Calling this function checks current permissions settings related to notifications. It lets you verify whether the app is currently allowed to display alerts, play sounds, etc. There is no user-facing effect of calling this.
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      //Prompts the user for notification permissions according to request. Request defaults to asking the user to allow displaying alerts, setting badge count and playing sounds.
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    });
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  //Starting in Android 8.0 (API level 26), all notifications must be assigned to a channel. For each channel, you can set the visual and auditory behavior that is applied to all notifications in that channel. Then, users can change these settings and decide which notification channels from your app should be intrusive or visible at all
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      // sound: 'mySoundFile.wav', // Provide ONLY the base filename
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default function NotificationSettings() {
  const [expoPushToken, setExpoPushToken] =
    useState<Notifications.ExpoPushToken>();
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    //These listeners allow you to add behavior when notifications are received while your app is open and foregrounded and when your app is backgrounded or closed and the user taps on the notification.

    //Listeners registered by this method will be called whenever a notification is received while the app is running.
    //User interacted with notification: false
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        //natification type: {date: Date, request: {content: {data: {}(no shown), body: string(main content), title: string(Notification title -), sound}, identifier: string, trigger: NotificationTrigger}}
      });
    //Listeners registered by this method will be called whenever a user interacts with a notification (for example, taps on it).
    //it is triggered both when app is foregrounded or in the background(Background event listeners are not supported in Expo Go.)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  //GET latest notification//A React hook always returns the notification response that was received most recently (a notification response designates an interaction with a notification, such as tapping on it).
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.url &&
      lastNotificationResponse.actionIdentifier ===
        Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      // Linking.openURL(
      //   lastNotificationResponse.notification.request.content.data.url
      // );
    }
  }, [lastNotificationResponse]);

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-around" }}
    >
      <Text>Your expo push token: {JSON.stringify(expoPushToken)}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken!);
        }}
      />
    </View>
  );
}
