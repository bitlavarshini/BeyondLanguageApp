import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const FlashCard = ({ word, translation }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const flipAnimation = new Animated.Value(0);

  const flipCard = () => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 180,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      setIsFlipped(!isFlipped);
    });
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <TouchableOpacity onPress={flipCard} activeOpacity={1}>
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, styles.frontCard, frontAnimatedStyle]}>
          <Text style={styles.word}>{word}</Text>
        </Animated.View>
        <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
          <Text style={styles.translation}>{translation}</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 200,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: '90%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    backfaceVisibility: 'hidden',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c87449',
  },
  frontCard: {
    backgroundColor: '#efd8cc',
  },
  backCard: {
    backgroundColor: '#c87449',
    transform: [{ rotateY: '180deg' }],
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  translation: {
    fontSize: 16,
    color: 'white',
  },
});

export default FlashCard;
