import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import Svg, { Ellipse, Path, Rect } from "react-native-svg";

type ProgressBarProps = {
  progress: number;
};
const ProgressBar = ({ progress }: ProgressBarProps) => {
  const barWidth = 230;
  const progressWidth = (progress / 100) * barWidth;
  

  return (
    <View style={styles.container}>
      <Svg width={barWidth} height={7}>
        <Rect width={barWidth} height={"100%"} fill="#eee" />
        <Rect width={progressWidth} height={"100%"} fill="#10b981" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
  },
});

export default ProgressBar;
