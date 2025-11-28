import { Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export default function GestureStyle() {


    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);



    return (
        <View>
            <Text>GestureStyle</Text>
        </View>
    )
}