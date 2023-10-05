import React, { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  getHash,
  startOtpListener,
  useOtpVerify,
  removeListener,
} from "react-native-otp-verify";
import { Button, TextInput } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { PHONE_NUMBER_REGEX } from "@/constants/regex";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  useLoginMutation,
  useResendOTPMutation,
  useVerifyOTPMutation,
} from "@/redux/auth/authApiSlice";
import { setCredentials } from "@/redux/auth/authSlice";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import secondsToTime from "@/utils/secondsToTime";

const VerifyOTP = () => {
  const dispatch = useAppDispatch();

  const [counter, setCounter] = useState(120);

  const [pin, setPin] = useState("");

  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  //auto read otp from SMS message-> otp state change causes a re-render, populating the otp code field
  // You can use the startListener and stopListener to manually trigger listeners again(or stop listener).
  //hash: The hash code for the application which should be added at the end of message.
  //message: SMS message when received.
  // optionally pass numberOfDigits if you want to extract otp
  //otp: OTP retreived from SMS when received.(Must pass numberOfDigits)
  const { hash, otp, message, timeoutError, stopListener, startListener } =
    useOtpVerify({ numberOfDigits: 6 });

  const [verifyOTP, { data, error, isLoading, isError, isSuccess }] =
    useVerifyOTPMutation();

  const [
    resendOTP,
    {
      data: reData,
      error: reError,
      isLoading: reIsLoading,
      isSuccess: reIsSuccess,
      isError: reIsError,
    },
  ] = useResendOTPMutation();

  //feedback->verify
  useEffect(() => {
    //if otp is wrong or could not be verified
    if (isError) {
      setPin(""); //clear entries on otp field
      Toast.show({ type: "error", text1: error as string });
    }

    //save token to redux store + secure store
    const saveToken = async () => {
      try {
        //save token to secure store//size limit= 2kb//you will get a warning or error is limit is reached
        await SecureStore.setItemAsync("token", data!.accessToken);
        // save token->store//synchronously
        dispatch(setCredentials(data!.accessToken));
        //navigate to profile//replace->can't navigate back to this page with the back btn/hides it
        router.replace({
          pathname: "/profile",
          params: { phoneNumber },
        });
      } catch (error) {
        console.log;
      }
    };
    //on success & token is not null
    if (isSuccess && data?.accessToken) saveToken();
  }, [isError, isSuccess, data]);

  //feedback->resend otp
  useEffect(() => {
    if (reIsError) Toast.show({ type: "error", text1: reError as string });

    //on success & token is not null
    if (reIsSuccess) {
      Toast.show({ type: "success", text1: reData?.message });
    }

    return () => Toast.hide();
  }, [reIsError, reIsSuccess, reData]);

  //update code when otp from hook changes is typed//allows invalidating code in otp field if otp is wrong
  useEffect(() => {
    if (otp) setPin(otp);
  }, [otp]);

  //otp expiry timer-> 1 sec interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (counter >= 0) setCounter((prev) => prev - 1);

      return () => clearInterval(intervalId);
    }, 1000);
  }, []);

  //ALTERNATIVE TO USING HOOK: using methods->get hash and start listener for code sent as SMS message
  // useEffect(() => {
  //   getHash()
  //     .then((hash) => {
  //       // use this hash in the message.
  //       console.log(hash);
  //     })
  //     .catch(console.log);

  //   startOtpListener((message) => {
  //     // extract the otp using regex e.g. the below regex extracts 6 digit otp from message
  //    //.exec() returns array of result array or null if no match// \d-> matches 0-9 digits
  //     const otp = /(\d{6})/g.exec(message)?.[1] || "";

  //     setOtp(otp);
  //   });
  //   return () => removeListener();
  // }, []);

  return (
    <KeyboardAvoidingView className="flex-1">
      {/**'auto', 'inverted', 'light', 'dark' */}
      <StatusBar style="auto" backgroundColor="#10b981" />

      <View className=" grow py-10 items-center gap-y-4">
        <Text className="text-lg font-semibold ">
          We sent a verification code to your mobile
        </Text>

        <Text className="text-gray-muted mb-4">******1234</Text>
        <Text className="text-gray-muted mb-4">
          Enter the 6 digit code below
        </Text>

        <OTPInputView
          style={{ width: "80%", height: 50 }}
          pinCount={6} //Number of digits in the component
          code={pin} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
          onCodeChanged={(code) => setPin(code)} //Callback when the digits are changed
          autoFocusOnLoad //Auto activate the input and bring up the keyboard when component is loaded
          codeInputFieldStyle={styles.underlineStyleBase} //The style of the input field which is NOT focused
          codeInputHighlightStyle={styles.underlineStyleHighLighted} //The style of the input field which is focused
          //secureTextEntry//bool/Hide contents of text fields
          //editable//Set editable for inputs
          //keyboardAppearance//Keyboard appearance ('default', 'dark', 'light')
          //keyboardType//Keyboard type->see react native//default numeric
          //clearInputs//Clear inputs after entering code
          //placeholderCharacter//The character/string that will be used as placeholder
          //placeholderTextColor//Color of the placeholderCharacter
          onCodeFilled={(code) => {
            //Callback when the last digit is entered
            // console.log(`Code is ${code}, you are good to go!`);
            verifyOTP({ phoneNumber, otp: code });
          }}
        />
        <Text>Expires in: {secondsToTime(counter)}</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <View className="flex-row gap-2-x items-center">
            <Text>Didn't get the code?</Text>
            <Button
              // icon="arrow-right"
              mode="text"
              onPress={() => resendOTP({ phoneNumber })}
              loading={reIsLoading} //boolean //Whether to show a loading indicator
              compact
            >
              Resend
            </Button>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});

export default VerifyOTP;
