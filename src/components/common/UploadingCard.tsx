import { VibrancyView, BlurView } from "@react-native-community/blur";
import React from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import ProgressBar from "./ProgressBar";

type UploadingCardProps = {
  image: string;
  video: string;
  progress: number;
};

const UploadingCard = ({ image, video, progress }: UploadingCardProps) => {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        },
      ]}
    >
      <VibrancyView
        blurType="materialDark"
        blurAmount={2}
        style={StyleSheet.absoluteFill}
      />

      <BlurView
        style={{
          width: "70%",
          height: 200,
          alignItems: "center",
          paddingVertical: 16,
          rowGap: 12,
          borderRadius: 14,
        }}
        blurType="light"
      >
        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: 100,
              height: 100,
              resizeMode: "contain",
              borderRadius: 6,
            }}
          />
        )}

        {video && (
          <Video
            source={{
              uri: video,
            }}
            videoStyle={{}}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={ResizeMode.CONTAIN}
            // shouldPlay
            // is Looping
            style={{ width: 200, height: 200 }}
            // useNativeControls
          />
        )}

        <Text style={{ fontSize: 12 }}>Uploading...</Text>
        <ProgressBar progress={progress} />
        <View
          style={{
            height: 1,
            borderWidth: StyleSheet.hairlineWidth,
            width: "100%",
            borderColor: "#00000020",
          }}
        />
      </BlurView>
    </View>
  );
};

export default UploadingCard;
