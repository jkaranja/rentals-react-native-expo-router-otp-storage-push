import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  HelperText,
  IconButton,
  TextInput,
} from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import AlertDialog from "@/components/common/AlertDialog";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  getHash,
  startOtpListener,
  useOtpVerify,
  removeListener,
} from "react-native-otp-verify";

import secondsToTime from "@/utils/secondsToTime";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import colors from "@/constants/colors";
import { Controller, useForm } from "react-hook-form";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/redux/auth/userApiSlice";
import { EMAIL_REGEX, OTP_REGEX, PHONE_NUMBER_REGEX } from "@/constants/regex";
import {
  useSendOTPMutation,
  useVerifyOTPMutation,
} from "@/redux/auth/authApiSlice";
import VerifyPin from "@/components/common/VerifyPin";
import { PROFILE_PIC_ROOT } from "@/constants/paths";
import { IUser } from "@/types/user";
import PhoneInput from "react-native-phone-number-input";

type AccountInputs = {
  username: string;
  email: string;
  phoneNumber: string;
};

type AccountFormProps = {
  user: IUser;
  handleValuesChange: (arg: AccountInputs) => void;
  handleStatusChange: () => void;
};

/**----------------------------------------------------------------------------------
  ACCOUNT FORM
 ---------------------------------------------------------------------------------------*/

const AccountForm = ({
  user,
  handleValuesChange,
  handleStatusChange,
}: AccountFormProps) => {
  interface IProfilePic {
    name: string;
    uri: string;
    type: string;
  }
  const [profilePic, setProfilePic] = useState<IProfilePic>({} as IProfilePic);

  const [isVisible, setIsVisible] = useState(false);

  // const [updateUser, { data, error, isLoading, isError, isSuccess }] =
  //   useUpdateUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
    reset: resetForm,
  } = useForm<AccountInputs>();

  const [sendOTP, { isLoading, isSuccess, isError, error }] =
    useSendOTPMutation();

  /**--------------------------------
  HANDLE SEND OTP
 -------------------------------------*/
  const handleSendOTP = async () => {
    await sendOTP({ phoneNumber: getValues("phoneNumber") });
    setIsVisible(true);
  };

  //image picker
  const pickImage = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show({
        type: "error", // error || info
        text1: "Access to media library denied",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //Images | Videos| All  images or only videos separately
      quality: 1,
      aspect: [3, 3], //landscape->4, 3// portrait:[3, 4]
    });

    //use 'canceled' => 'cancelled' deprecated
    //if picker was not cancelled
    if (!result.canceled) {
      //fileSize & fileName = undefined in result
      ////don't forget to check if file type is correct(eg format image/jpeg)//else Network error or nothing or multer will return files a stringified array
      setProfilePic({
        uri: result.assets[0]?.uri,
        name:
          result.assets[0]?.fileName || result.assets[0]?.uri.split("/").pop()!,
        type: `image/${result.assets[0]?.uri.split(".").pop()}`,
      });
    }
  };

  //set defaults
  useEffect(() => {
    resetForm({
      username: user?.username,
      email: user?.email,
      phoneNumber: user?.phoneNumber?.slice(4),
    });
  }, [user]);

  // form values state
  useEffect(() => {
    // Callback version of watch. Optimized for performance. Render at hook level instead of whole app  It's your responsibility to unsubscribe when done.
    const subscription = watch((data) => {
      //console.log(data, name, type); 2nd param: { name, type }//name=name of field that changed, type= event type eg 'change'
      const values = data as AccountInputs;
      handleValuesChange(values);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  //send otp feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) handleStatusChange();
    return () => Toast.hide();
  }, [isSuccess, isError]);

  return (
    <View className=" flex-1">
      <View className="flex-row justify-center  my-3">
        <Pressable className="" onPress={pickImage}>
          <Avatar.Icon
            // size={60}
            icon={({ size, color }) => {
              size = size + 20;
              return profilePic.uri || user?.profilePic?.filename ? (
                <Image
                  source={
                    profilePic.uri ||
                    `${PROFILE_PIC_ROOT}/${user?.profilePic?.filename}`
                  }
                  className="rounded-full"
                  style={{ width: size, height: size }}
                />
              ) : (
                <FontAwesome name="user-o" size={24} color="black" />
              );
            }}
            color="#10b981"
            style={{ backgroundColor: "#e2e8f0" }}
          />
          <View className="absolute bottom-0 right-4 ">
            <MaterialCommunityIcons
              name="pencil"
              size={24}
              color={colors.emerald.DEFAULT}
            />
          </View>
        </Pressable>
      </View>

      <Controller
        name="username"
        control={control}
        rules={{
          required: "Username is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
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
        name="email"
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value: EMAIL_REGEX,
            message: "Enter an email address",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            clearButtonMode="while-editing"
            autoComplete="email" //Specifies autocomplete hints for the system, so it can provide autofill(off to disable). eg username|email|
            //secureTextEntry//If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={Boolean(errors.email?.message)} //Whether to style the TextInput with error style.
            label="Email"
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.email?.message)}>
        {errors.email?.message}
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

      <HelperText type="error" visible={!isValid}>
        Fill all fields
      </HelperText>

      <View className="py-4">
        <Button
          onPress={handleSendOTP}
          className="rounded-md"
          mode="contained"
          disabled={!isValid}
          loading={isLoading}
          labelStyle={
            {
              //fontSize: 13,
              // marginVertical: 8,
            }
          } //Style for the button text.
          //style={{ width: "100%" }}
          //textColor={colors.gray.dark}
        >
          Update profile
        </Button>
      </View>
    </View>
  );
};

/**------------------------------------------------------------------------------------------
  VERIFY OTP FORM
 ---------------------------------------------------------------------------------------------*/
type VerifyPinFormProps = {
  formValues: AccountInputs;
};

const VerifyPinForm = ({ formValues }: VerifyPinFormProps) => {
  const [counter, setCounter] = useState(120);
  const [isInvalidOTP, setIsInvalidOTP] = useState(false);
  const [otp, setOtp] = useState("");

  const dispatch = useAppDispatch();

  const [
    resendOTP,
    { isLoading: isSending, error: otpError, isError: isOTPError },
  ] = useSendOTPMutation();

  const [updateUser, { data, error, isLoading, isError, isSuccess }] =
    useUpdateUserMutation();

  /**--------------------------------
  HANDLE RESEND OTP
 -------------------------------------*/
  const handleResendOTP = async () => {
    await resendOTP({ phoneNumber: formValues.phoneNumber });
  };

  /**--------------------------------
   HANDLE ACCOUNT SUBMIT
 -------------------------------------*/
  const handleUpdateAccount = async (code: string) => {
    ////only show err after trying to submit. Code has 6 characters while otp state hasn't added 6th one. async
    if (!OTP_REGEX.test(code)) return setIsInvalidOTP(true);

    // const formData = new FormData();

    // if (profilePic.uri) {
    //   formData.append("profilePic", profilePic as unknown as File);
    // }

    // formData.append("username", data.username);

    // formData.append("email", data.email);

    // formData.append("phoneNumber", phoneNumber);

    // await updateUser(formData);
  };

  //resend otp feedback
  useEffect(() => {
    if (isOTPError) Toast.show({ type: "error", text1: error as string });
    return () => Toast.hide();
  }, [isOTPError, otpError]);

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

  //update feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) Toast.show({ type: "success", text1: "Updated" });
  }, [isError, isSuccess, data, error]);

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
        onCodeFilled={(code) => handleUpdateAccount(code)}
        editable
      />

      {isInvalidOTP && <Text className="text-red">Invalid code</Text>}

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

/**------------------------------------------------------------------------------------------
  ACCOUNT
 ---------------------------------------------------------------------------------------------*/
const Account = () => {
  const [formValues, setFormValues] = useState<AccountInputs>(
    {} as AccountInputs
  );

  const handleValuesChange = (values: AccountInputs) => {
    setFormValues(values);
  };

  const [isSent, setIsSent] = useState(false);

  const handleStatusChange = () => {
    setIsSent(true);
  };

  const { data: user, isFetching } = useGetUserQuery(undefined, {
    // pollingInterval: 15000,
    // refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (!user)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <KeyboardAwareScrollView className="flex-1 p-4 ">
      {isSent ? (
        <VerifyPinForm formValues={formValues} />
      ) : (
        <AccountForm
          user={user!}
          handleValuesChange={handleValuesChange}
          handleStatusChange={handleStatusChange}
        />
      )}
    </KeyboardAwareScrollView>
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

export default Account;
