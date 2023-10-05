import { Text } from "react-native";

type MonoTextProps = Text["props"];//how you get types for RN core components

export function MonoText(props: MonoTextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "SpaceMono" }]} />;
}
