import { Text, View, StyleSheet, Button } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";



export default function AnimatedStyle() {

    const width = useSharedValue(100);
    const height = useSharedValue(100);

    const style = useAnimatedStyle(() => {
        return {
            width: withTiming(width.value, { duration: 1000 }),
            height: withTiming(height.value, { duration: 5000 }),
        }
    })


    return (
        <View style={styles.container}>
            <Text>AnimatedStyle</Text>
            <Animated.View style={[style, styles.box]} />
            <Button
                title="Animate"
                onPress={() => {
                    width.value = 200;
                    height.value = 200;
                }}
            />

            <Button title='reset' onPress={() => { width.value = 100; height.value = 100 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: "red",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})
