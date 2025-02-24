import {
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Cell from "./Cell";
import Tile from "./Tile";
import { Board } from "../helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GameOverlay from "./GameOverlay";

const BoardView = () => {
  const [board, setBoard] = useState(new Board());
  const [direction, setDirection] = useState<number | null>(null);
  const [highScore, setHighScore] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const direction = determineSwipeDirection(gestureState);
        switch (direction) {
          case "left":
            setDirection(0);
            break;

          case "right":
            setDirection(2);
            break;

          case "up":
            setDirection(1);
            break;

          case "down":
            setDirection(3);
            break;
        }
      },
    })
  ).current;

  const cells = board.cells.map((row, rowIndex) => {
    return (
      <View key={rowIndex}>
        {row.map((col, colIndex) => {
          return <Cell key={rowIndex * board.size + colIndex} />;
        })}
      </View>
    );
  });

  const tiles = board.tiles
    .filter((tile) => tile.value !== 0)
    .map((t, index) => {
      return <Tile tile={t} key={index} />;
    });

  const determineSwipeDirection = (gestureState: PanResponderGestureState) => {
    const { dx, dy } = gestureState;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy) {
      if (dx > 0) {
        return "right";
      } else {
        return "left";
      }
    } else {
      if (dy > 0) {
        return "down";
      } else {
        return "up";
      }
    }
  };


  const onHandleSwipe = () => {
    if (board.hasWon()) {
      return;
    }

    if (direction === null) {
      return;
    }

    let boardClone = Object.assign(
      Object.create(Object.getPrototypeOf(board)),
      board
    );

    let newBoard = boardClone.move(direction);
    setBoard(newBoard);
    setDirection(null);
  };

  useEffect(() => {
    onHandleSwipe();
  }, [direction]);

  const storeHighScore = async () => {
    try {
      await AsyncStorage.setItem("highScore", board.score.toString());
    } catch (e) {
      console.log(e);
    }
  };

  const getHighScore = async () => {
    try {
      const value = await AsyncStorage.getItem("highScore");
      if (value !== null) {
        setHighScore(Number(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (board.score > highScore) {
      storeHighScore();
    }
    getHighScore();
  }, [board.score]);

  const resetGame = () => {
    setBoard(new Board());
  };

  return (
    <View>
      <View style={styles.optionsBox}>
        <View style={styles.newGameBtn}>
          <Text style={styles.newGameText}>بیشترین امتیاز : {highScore}</Text>
        </View>
        <TouchableOpacity style={styles.newGameBtn} onPress={resetGame}>
          <Text style={styles.newGameText}>بازی دوباره</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.scoreText}>{board.score}</Text>
      <View style={styles.boardViewStyle} {...panResponder.panHandlers}>
        <View style={{ flexDirection: "row" }}>
          {cells}
          {tiles}
          <GameOverlay onRestart={resetGame} board={board} />
        </View>
      </View>
    </View>
  );
};

export default BoardView;

const styles = StyleSheet.create({
  boardViewStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    height: 320,
    width: 320,
    alignSelf: "center",
  },

  optionsBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  newGameBtn: {
    backgroundColor: "#3d2963",
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "auto",
    borderRadius: 8,
  },
  newGameText: {
    color: "#ffffff80",
    fontSize: 20,
  },

  scoreText: {
    color: "#ffffff80",
    fontSize: 40,
    textAlign: "center",
    marginVertical: 50,
  },
});
