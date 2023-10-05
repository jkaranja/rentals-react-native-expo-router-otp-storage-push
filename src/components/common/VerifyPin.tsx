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
// import {
//   getHash,
//   startOtpListener,
//   useOtpVerify,
//   removeListener,
// } from "react-native-otp-verify";
import { Button, TextInput, Portal, Dialog } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { PHONE_NUMBER_REGEX } from "@/constants/regex";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  useLoginMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
} from "@/redux/auth/authApiSlice";
import { setCredentials } from "@/redux/auth/authSlice";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import secondsToTime from "@/utils/secondsToTime";
import { EvilIcons } from "@expo/vector-icons";
import AlertDialog from "./AlertDialog";

type VerifyPinProps = {
  visible: boolean;
  handleClose: () => void;
  handleVerifyOTP: (code: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  children?: React.ReactNode;
  isSending: boolean;
  isVerifying: boolean;
};

const VerifyPin = ({
  visible,
  handleClose,
  handleVerifyOTP,
  resendOTP,
  isSending,
  isVerifying,
}: VerifyPinProps) => {
  const [counter, setCounter] = useState(120);

  const [pin, setPin] = useState(""); 

  //auto read otp from SMS message-> otp state change causes a re-render, populating the otp code field
  // const { hash, otp, message, timeoutError, stopListener, startListener } =
  //   useOtpVerify({ numberOfDigits: 6 });

  //update code when otp from hook changes is typed//allows invalidating code in otp field if otp is wrong
  // useEffect(() => {
  //   if (otp) setPin(otp);
  // }, [otp]);

  /**--------------------------------
  HANDLE RESEND OTP
 -------------------------------------*/
  const handleResendOTP = async () => {
    await resendOTP();
    setCounter(120);
  };

  //otp expiry timer-> 1 sec interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (counter >= 0) setCounter((prev) => prev - 1);

      return () => clearInterval(intervalId);
    }, 1000);
  }, []);

  return (
    <AlertDialog
      visible={visible}
      handleClose={handleClose}      
    >
      <View className=" py-10 items-center gap-y-4 px-4">
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
          onCodeFilled={handleVerifyOTP} 
        />
        <Text>Expires in: {secondsToTime(counter)}</Text>
      </View>

      <View className=" pb-10 items-center gap-y-4 px-4">
        {isVerifying ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <View className="flex-row gap-2-x items-center">
            <Text>Didn't get the code?</Text>
            <Button
              // icon="arrow-right"
              disabled={isSending}
              mode="text"
              onPress={handleResendOTP}
              loading={isSending} //boolean //Whether to show a loading indicator
              compact
            >
              Resend
            </Button>
          </View>
        )}
      </View>
    </AlertDialog>
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

export default VerifyPin;
