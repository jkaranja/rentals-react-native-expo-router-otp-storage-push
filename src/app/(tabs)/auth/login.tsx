import React, { useEffect, useRef, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";

import {
  ActivityIndicator,
  Button,
  HelperText,
  TextInput,
} from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { OTP_REGEX, PHONE_NUMBER_REGEX } from "@/constants/regex";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import secondsToTime from "@/utils/secondsToTime";
import {
  useLoginMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
} from "@/redux/auth/authApiSlice";
import { setCredentials } from "@/redux/auth/authSlice";
import VerifyPin from "@/components/common/VerifyPin";
import PhoneInput from "react-native-phone-number-input";

type SignInFormProps = {
  phoneNumber: string;
  handleStatusChange: () => void;
  handlePhoneChange: (phone: string) => void;
};

/**----------------------------------------------------------------------------------
  SIGN IN FORM
 ---------------------------------------------------------------------------------------*/
const SignInForm = ({
  phoneNumber,   
  handleStatusChange,
  handlePhoneChange, 
}: SignInFormProps) => {
  const phoneInput = useRef<PhoneInput>(null);

  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const [sendOTP, { isLoading, isSuccess, isError, error }] =
    useSendOTPMutation();

  /**--------------------------------
  HANDLE SEND OTP
 -------------------------------------*/
  const handleSendOTP = async () => {
    if (!PHONE_NUMBER_REGEX.test(phoneNumber)) return setIsPhoneValid(true);

    await sendOTP({ phoneNumber });
  };

  useEffect(() => {
    if (PHONE_NUMBER_REGEX.test(phoneNumber)) return setIsPhoneValid(false);
  }, [phoneNumber]);

  //send otp feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) handleStatusChange();

    return () => Toast.hide();
  }, [isSuccess, isError]);

  return (
    <View className="flex-1 p-5  gap-y-5 ">
      <View>
        <Text className="text-3xl font-semibold ">Welcome back</Text>
        <Text className="text-gray-muted ">
          Please sign-in to your account below
        </Text>
      </View>

      <Text className="pb-4">
        We will send a verification code to this number.
      </Text>

      <PhoneInput
        ref={phoneInput} //methods->phoneInput.current?.isValidNumber(value)/getCountryCode()
        //defaultValue={value} //string
        value={phoneNumber} //string
        defaultCode="KE" //country code//https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/src/types.ts#L252
        layout="first" //"first" | "second";
        //(text: string) => void;//format: 720....//without country code
        // onChangeText={(text) => {
        //   setValue(text);
        // }}
        //(text: string) => void;//format +2547......
        onChangeFormattedText={(text) => {
          handlePhoneChange(text);
        }}
        withDarkTheme // boolean
        withShadow // boolean
        autoFocus // boolean
        //countryPickerButtonStyle : StyleProp<ViewStyle>;
        // disabled?: boolean
        // disableArrowIcon?: boolean
        // placeholder?: string;
        // onChangeCountry?: (country: Country) => void;
        containerStyle={{ width: "100%", borderRadius: 3 }} // StyleProp<ViewStyle>;
        textContainerStyle={{ width: "100%", borderRadius: 3 }} // StyleProp<ViewStyle>;
        // renderDropdownImage?: JSX.Element;
        // textInputProps?: TextInputProps;
        // textInputStyle?: StyleProp<TextStyle>;
        // codeTextStyle?: StyleProp<TextStyle>;
        // flagButtonStyle?: StyleProp<ViewStyle>;
      />

      {isPhoneValid && (
        <Text className="text-red">Enter a valid phone number</Text>
      )}

      <Button
        icon="arrow-right" //any MaterialCommunityIcons icon name//see https://icons.expo.fyi/Index
        mode="contained"
        onPress={handleSendOTP}
        loading={isLoading}
      >
        Log in
      </Button>

      <View className="flex-row gap-x-2 items-center">
        <Text className=" text-gray-muted  items-center">
          Don't have an account yet?
        </Text>
        <Link href="/auth/signup" className="text-emerald">
          Sign up
        </Link>
      </View>
    </View>
  );
};

/**------------------------------------------------------------------------------------------
  VERIFY OTP FORM
 ---------------------------------------------------------------------------------------------*/
type VerifyPinFormProps = {
  phoneNumber: string;
};

const VerifyPinForm = ({ phoneNumber }: VerifyPinFormProps) => {
  const [counter, setCounter] = useState(120);
  const [isInvalidOTP, setIsInvalidOTP] = useState(false);
  const [otp, setOtp] = useState("");

  const dispatch = useAppDispatch();

  const [
    resendOTP,
    { isLoading: isSending, error: otpError, isError: isOTPError },
  ] = useSendOTPMutation();

  const [login, { data, error, isLoading, isError, isSuccess }] =
    useLoginMutation();

  /**--------------------------------
  HANDLE SEND OTP
 -------------------------------------*/
  const handleResendOTP = async () => {
    await resendOTP({ phoneNumber });
  };

  /**--------------------------------
   HANDLE verify & LOGIN
 -------------------------------------*/
  const handleLoginSubmit = async (code: string) => {
    ////only show err after trying to submit. Code has 6 characters while otp state hasn't added 6th one yet. async
    if (!OTP_REGEX.test(code)) return setIsInvalidOTP(true);

    await login({ phoneNumber, otp: code });
  };

  //OTP validation->Dismiss err if valid otp is typed
  useEffect(() => {
    if (OTP_REGEX.test(otp)) return setIsInvalidOTP(false);
  }, [otp]);

  //otp expiry timer-> 1 sec interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (counter >= 0) setCounter((prev) => prev - 1);

      return () => clearInterval(intervalId);
    }, 1000);
  }, []);

  //resend otp feedback
  useEffect(() => {
    if (isOTPError) Toast.show({ type: "error", text1: error as string });
    return () => Toast.hide();
  }, [isOTPError, otpError]);

  //login/verify feedback
  useEffect(() => {
    if (isError) {
      Toast.show({ type: "error", text1: error as string });
    }
    // //on success & token is not null
    // if (isSuccess) {
    //   Toast.show({
    //     type: "success", // error || info
    //     text1: data?.message,
    //     //text2: "Second line of text"
    //     //position: "top", //or bottom//default: bottom
    //     //visibilityTime:{4000}//default = 4000ms
    //     //autoHide:{true}//default: true
    //     //onPress: ()=> void //Called on Toast press
    //     //bottomOffset={40} //Offset from the bottom of the screen (in px). Has effect only when position is bottom
    //     //topOffset={40}//Offset from the top of the screen
    //   });
    // }

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
        });
      } catch (error) {
        console.log;
      }
    };
    //on success & token is not null
    if (isSuccess && data?.accessToken) saveToken();

    return () => Toast.hide(); //To hide the current visible Toast//default is 4 secs
  }, [isError, isSuccess, data]);

  return (
    <View className=" py-10 items-center gap-y-4 px-4">
      <Text className="text-lg font-semibold ">
        We sent a verification code to your mobile
      </Text>

      <Text className="text-gray-muted mb-4">******1234</Text>
      <Text className="text-gray-muted mb-4">Enter the 6 digit code below</Text>

      <OTPInputView
        style={{ width: "80%", height: 50 }}
        pinCount={6} //Number of digits in the component
        code={otp} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
        onCodeChanged={(code) => setOtp(code)} //Callback when the digits are changed
        autoFocusOnLoad //Auto activate the input and bring up the keyboard when component is loaded
        codeInputFieldStyle={styles.underlineStyleBase} //The style of the input field which is NOT focused
        codeInputHighlightStyle={styles.underlineStyleHighLighted} //The style of the input field which is focused
        //secureTextEntry//bool/Hide contents of text fields
        //editable //Set editable for inputs
        //keyboardAppearance//Keyboard appearance ('default', 'dark', 'light')
        //keyboardType//Keyboard type->see react native//default numeric
        //clearInputs//Clear inputs after entering code
        //placeholderCharacter//The character/string that will be used as placeholder
        //placeholderTextColor//Color of the placeholderCharacter
        onCodeFilled={(code) => handleLoginSubmit(code)} //Code is the complete code. When this fires, state otp has 5 digits
      />

      {isInvalidOTP && (
        <Text className="text-red">
          Invalid code. Please re-enter the code.
        </Text>
      )}

      <Text>Expires in: {secondsToTime(counter)}</Text>

      <View className="flex-row gap-2-x items-center">
        {isLoading ? (
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
    </View>
  );
};

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isSent, setIsSent] = useState(false);

  const handleStatusChange = () => {
    setIsSent(true);
  };

  const handlePhoneChange = (phone: string) => {
    setPhoneNumber(phone);
  };

  return (
    <KeyboardAvoidingView className="flex-1 ">
      {/**'auto', 'inverted', 'light', 'dark' */}
      <StatusBar style="auto" backgroundColor="#10b981" />
      {isSent ? (
        <VerifyPinForm phoneNumber={phoneNumber} />
      ) : (
        <SignInForm
          phoneNumber={phoneNumber}
          handlePhoneChange={handlePhoneChange}
          handleStatusChange={handleStatusChange}
        />
      )}

      {/**TEXT INPUT AND BUTTON SUMMARY */}
      {/* <TextInput
              //also inherits react native TextInput props
              keyboardType="number-pad" //or numeric
              clearButtonMode="while-editing"
              autoComplete="tel" //Specifies autocomplete hints for the system, so it can provide autofill(off to disable). eg username|email|
              //secureTextEntry//If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
              mode="outlined"              
              //onChangeText={(text)=> setText(text)}
              value={value}
              //mode='flat' | 'outlined'//default: flat input with an underline.
              //outlineColor//Inactive outline color of the input.
              //activeOutlineColor//active outline color of the input.
              //underlineColor
              //activeUnderlineColor
              //textColor //Color of the text in the input.
              //dense//Sets min height with densed layout//adds paddingVertical
              //multiline=boolean//whether the input can have multiple lines.
              //numberOfLines={numberOfLines}
              //onFocus
              //onBlur
              //render=()=> React.ReactNode//render custom input like nativeTextInput
              //left=React.ReactNode//same options as for right below or pass custom
              //right=React.ReactNode eg {<TextInput.Affix textStyle text="/100" />}//render a leading / trailing text in the TextInput
              //or an icon {<TextInput.Icon color onPress icon="eye" />}// render a leading / trailing icon in the TextInput
              //disabled
              //placeholder
              left={<TextInput.Affix text="+254" />}
              error={Boolean(errors.phoneNumber?.message)} //Whether to style the TextInput with error style.
              label="Phone number"
              // value={text}
              // onChangeText={(text) => setText(text)}
              // secureTextEntry
              //contentStyle//Pass custom style directly to the input itself.
              //outlineStyle//override the default style of outlined wrapper eg borderRadius, borderColor
              //underlineStyle// override the default style of underlined wrapper// eg borderRadius
              //style={{}}//eg height of input /fontSize of text inside TextInput
            />        
   
        <Button
          icon="arrow-right" //any MaterialCommunityIcons icon name//see https://icons.expo.fyi/Index
          mode="contained"
          onPress={handleSendOTP}
          //uppercase//boolean//Make the label text uppercased
          // icon={({ size, color }) => (
          //   <Image
          //     source={require("../assets/chameleon.jpg")}
          //     style={{ width: size, height: size, tintColor: color }}
          //   />
          // )}//custom icon component
          //icon={require('../assets/chameleon.jpg')}//load img as icon
          //icon={{ uri: 'https://avatars0.githubusercontent.com/u/17571969?v=3&s=400' }}//remote img
          //mode='text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal'//Default value: 'text'
          //dark= false// boolean//Whether the color is a dark color///only when mode= contained, contained-tonal and elevated modes
          //buttonColor=""
          //textColor=""
          //compact
          //rippleColor=""//Color of the ripple effect.
         // loading={isLoading || isSending} //boolean //Whether to show a loading indicator
          //disabled //boolean
          //onPressIn
          //style
          //labelStyle={{fontSize: 20}}////Style for the button text.
        >
          Submit
        </Button> */}
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

export default Login;
