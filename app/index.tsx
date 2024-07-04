import BoardView from "@/components/BoardView";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#57407c",
        flex: 1,
        padding: 20,
      }}
    >
      <BoardView />
      <Text style={styles.infoBtn}>
        به سمت چپ و راست و بالا و پایین بکش تا بتونی اعداد رو جا به جا کنی. زمانی که دو تا عدد یکسان باشن با هم جمع و یکی میشن، وقتی به 2048 رسیدی برنده ای
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  infoBtn: {
    backgroundColor: "#3d2963",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: "auto",
    gap: 10,
    color: "#ffffff80",
    lineHeight:18
  },
});
