import i18n from "@/src/i18n";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  onPress: () => void;
};

export default function QuestionButton({ onPress }: Props) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>
        {i18n.t("buttons.question")}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    borderRadius: 3
    ,
    backgroundColor: "rgba(4, 0, 0, 0.6)",
    alignItems: "center",
    paddingHorizontal: 1,
    borderWidth: 1,
borderColor: "#666",
  },
  text: {
    color: "#7d7b7b",
    fontSize: 14,
    fontWeight: "400",
  },
});