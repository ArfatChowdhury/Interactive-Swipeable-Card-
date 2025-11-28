import { Text, View, StyleSheet, Button } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useEffect, useState } from "react";

// Individual Card Component
const SwipeableCard = ({ card, isTopCard, onSwipeComplete }) => {
    // Each card gets its OWN shared values
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);
    const rotateZ = useSharedValue(0);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);
    const entranceTranslateY = useSharedValue(50);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    useEffect(() => {
        // Staggered entrance based on card position
        const delay = card.id * 200;
        setTimeout(() => {
            opacity.value = withTiming(1, { duration: 600 });
            scale.value = withSpring(1, { friction: 7 });
            entranceTranslateY.value = withTiming(0, { duration: 500 });
        }, delay);
    }, []);

    const SWIPE_THRESHOLD = 150;

    const gesture = Gesture.Pan()
        .enabled(isTopCard) // Only top card is draggable
        .onStart(() => {
            offsetX.value = translateX.value;
            offsetY.value = translateY.value;
        })
        .onUpdate((event) => {
            if (!isTopCard) return;

            translateX.value = offsetX.value + event.translationX;
            translateY.value = offsetY.value + event.translationY;

            const rotationAmount = event.translationX / 10;
            rotateZ.value = Math.max(Math.min(rotationAmount, 15), -15);

            const opacityAmount = 1 - Math.abs(event.translationX) / 300;
            opacity.value = Math.max(opacityAmount, 0.3);
        })
        .onEnd((event) => {
            if (!isTopCard) return;

            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                // Swipe away
                translateX.value = withTiming(
                    event.translationX > 0 ? 500 : -500,
                    { duration: 300 }
                );
                opacity.value = withTiming(0, { duration: 300 }, () => {
                    runOnJS(onSwipeComplete)(card.id);
                });
            } else {
                // Spring back
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                rotateZ.value = withSpring(0);
                opacity.value = withSpring(1);
            }
        });

    const style = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value + entranceTranslateY.value },
                { rotateZ: `${rotateZ.value}deg` },
                { scale: scale.value }
            ],
            opacity: opacity.value,
            zIndex: isTopCard ? 100 : 1,
        };
    });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                style={[
                    styles.card,
                    style,
                    {
                        backgroundColor: card.color,
                    }
                ]}
            >
                <Text style={styles.cardText}>{card.text}</Text>
                {!isTopCard && <View style={styles.nonInteractiveOverlay} />}
            </Animated.View>
        </GestureDetector>
    );
};

export default function GestureStyle() {
    const [cards, setCards] = useState([
        { id: 1, text: "Card 1", color: "#ff6b6b" },
        { id: 2, text: "Card 2", color: "#4ecdc4" },
        { id: 3, text: "Card 3", color: "#45b7d1" },
        { id: 4, text: "Card 4", color: "#96ceb4" },
        { id: 5, text: "Card 5", color: "#feca57" }
    ]);

    const handleSwipeComplete = (swipedCardId) => {
        // Remove the swiped card
        setCards(prevCards => prevCards.filter(card => card.id !== swipedCardId));
    };

    const resetCards = () => {
        // Reset all cards
        setCards([
            { id: 1, text: "Card 1", color: "#ff6b6b" },
            { id: 2, text: "Card 2", color: "#4ecdc4" },
            { id: 3, text: "Card 3", color: "#45b7d1" },
            { id: 4, text: "Card 4", color: "#96ceb4" },
            { id: 5, text: "Card 5", color: "#feca57" }
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Swipeable Cards</Text>

            <View style={styles.cardsContainer}>
                {cards.map((card, index) => (
                    <SwipeableCard
                        key={card.id}
                        card={card}
                        isTopCard={index === 0}
                        onSwipeComplete={handleSwipeComplete}
                    />
                )).reverse()}
            </View>

            <Button title="Reset Cards" onPress={resetCards} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
        marginTop: '10%'
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    cardsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: 'relative',
    },
    card: {
        width: 300,
        height: 400,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        position: 'absolute',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    nonInteractiveOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
});