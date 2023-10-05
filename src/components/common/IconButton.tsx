import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

type IconButtonProps = {
  children: React.ReactNode;
  label?: string;
  onPress?: () => void;
};

export default function IconButton({  label, onPress, children }: IconButtonProps) {
  return (
    <Pressable style={[styles.iconButton, {}]} onPress={onPress}>
      {children}
      <Text style={styles.iconButtonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonLabel: {
    color: "#fff",
    marginTop: 12,
  },
});
