import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ExpBarProps {
  currentExp: number;
}

const ExpBar: React.FC<ExpBarProps> = ({ currentExp }) => {
  const level = Math.floor(currentExp / 100);
  const expToNextLevel = currentExp % 100;
  const expPercentage = (expToNextLevel / 100) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.levelContainer}>
        <View style={styles.levelIcon}>
          <Text style={styles.levelText}>{(level + 1)}</Text>
        </View>
      </View>

      <View style={styles.barContainer}>
        <Animated.View
          style={[
            styles.filledBar,
            { width: `${expPercentage}%` },
          ]}
        />
        <Text style={styles.experienceTextInside}>
          {(expToNextLevel)}/100 EXP
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  levelIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'lightblue',
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  barContainer: {
    width: 200,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
  },
  filledBar: {
    height: '100%',
    backgroundColor: 'lightblue',
    borderRadius: 10,
  },
  experienceTextInside: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }],
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -10,
  },
});

export default ExpBar;
