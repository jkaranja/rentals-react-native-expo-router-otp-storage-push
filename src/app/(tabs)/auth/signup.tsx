import React, { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

import { Button, HelperText, TextInput } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { PHONE_NUMBER_REGEX } from "@/constants/regex";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import PhoneInput from "react-native-phone-number-input";

import {
  useSendOTPMutation,
  useVerifyOTPMutation,
} from "@/redux/auth/authApiSlice";
import { setCredentials } from "@/redux/auth/authSlice";
import VerifyPin from "@/components/common/VerifyPin";
import { useRegisterUserMutation } from "@/redux/auth/userApiSlice";

const Signup = () => {
  const dispatch = useAppDispatch();

  type Inputs = {
    phoneNumber: string;
    username: string;
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Inputs>();

  const [registerUser, { data, error, isLoading, isError, isSuccess }] =
    useRegisterUserMutation();

  /**--------------------------------
   HANDLE SIGN UP SUBMIT
 -------------------------------------*/
  const onSubmit = async (data: Inputs) => {
    await registerUser(data);
  };

  //feedback
  useEffect(() => {
    if (isError) {
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
        });
      } catch (error) {
        //  console.log;
      }
    };
    //on success & token is not null
    if (isSuccess && data?.accessToken) saveToken();

    return () => Toast.hide(); //To hide the current visible Toast//default is 4 secs
  }, [isError, isSuccess, data]);

  return (
    <KeyboardAvoidingView className="flex-1 ">
      {/**'auto', 'inverted', 'light', 'dark' */}
      {/* <StatusBar style="auto" backgroundColor="#10b981" /> */}

      <View className="p-10 flex-1">
        <Text className="text-3xl font-semibold ">Create an account</Text>
        <Text className="text-gray-muted mb-4">Please sign-up below</Text>

        <Controller
          name="username"
          control={control}
          rules={{
            required: "Username is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              clearButtonMode="while-editing"
              autoComplete="username" //Specifies autocomplete hints for the system, so it can provide autofill(off to disable). eg username|email|
              //secureTextEntry//If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={Boolean(errors.username?.message)} //Whether to style the TextInput with error style.
              label="Username"
            />
          )}
        />
        <HelperText type="error" visible={Boolean(errors.username?.message)}>
          {errors.username?.message}
        </HelperText>

        <Controller
          name="phoneNumber"
          control={control}
          rules={{
            required: "Phone number is required",
            pattern: {
              value: PHONE_NUMBER_REGEX,
              message: "Please match the format: +254XXXXXXXXX ",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <PhoneInput
              //  ref={phoneInput} //methods->phoneInput.current?.isValidNumber(value)/getCountryCode()
              //defaultValue={value} //string
              value={value} //string
              defaultCode="KE" //country code//https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/src/types.ts#L252
              layout="first" //"first" | "second";
              //(text: string) => void;//format: 720....//without country code
              // onChangeText={(text) => {
              //   setValue(text);
              // }}
              //(text: string) => void;//format +2547......
              onChangeFormattedText={onChange}
              withDarkTheme // boolean
              withShadow // boolean
              //autoFocus // boolean
              //countryPickerButtonStyle : StyleProp<ViewStyle>;
              // disabled?: boolean
              // disableArrowIcon?: boolean
              // placeholder?: string;
              // onChangeCountry?: (country: Country) => void;
              containerStyle={{ width: "100%", borderRadius: 3, height: 50 }} // StyleProp<ViewStyle>;
              textContainerStyle={{ width: "100%", borderRadius: 3 }} // StyleProp<ViewStyle>;
              // renderDropdownImage?: JSX.Element;
              // textInputProps?: TextInputProps;
              // textInputStyle?: StyleProp<TextStyle>;
              // codeTextStyle?: StyleProp<TextStyle>;
              // flagButtonStyle?: StyleProp<ViewStyle>;
            />
          )}
        />

        <HelperText type="error" visible={Boolean(errors.phoneNumber?.message)}>
          {errors.phoneNumber?.message}
        </HelperText>

        <Button
          icon="arrow-right" //any MaterialCommunityIcons icon name//see https://icons.expo.fyi/Index
          mode="contained"
          onPress={handleSubmit(onSubmit)}
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
          loading={isLoading} //boolean //Whether to show a loading indicator
          //disabled //boolean
          //onPressIn
          //style
          //labelStyle={{fontSize: 20}}////Style for the button text.
        >
          Submit
        </Button>

        <View className="flex-row gap-x-2 items-center">
          <Text className=" text-gray-muted my-4 items-center">
            Already have an account?
          </Text>
          <Link href="/auth/login" className="text-emerald">
            Log in
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Signup;
