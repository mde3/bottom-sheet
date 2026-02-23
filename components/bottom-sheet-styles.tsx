import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SNAP_POINTS = [0.45, 0.9]; // 45% & 90%

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheetStyles({
  visible,
  onClose,
  children,
}: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const currentSnapIndex = useRef(0);
  const lastTranslateY = useRef(SCREEN_HEIGHT);

  const getSnapPosition = useCallback((snapPercent: number) => {
    return SCREEN_HEIGHT * (1 - snapPercent);
  }, []);

  const snapTo = useCallback(
    (snapIndex: number, velocity?: number) => {
      const snapPercent = SNAP_POINTS[snapIndex];
      const toValue = getSnapPosition(snapPercent);
      currentSnapIndex.current = snapIndex;
      lastTranslateY.current = toValue;

      const speed = velocity ? Math.min(Math.abs(velocity), 3) : 0;
      const duration = speed > 0.5 ? Math.max(150, 300 - speed * 50) : 300;

      Animated.parallel([
        Animated.timing(translateY, {
          toValue,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.15 + snapPercent * 0.45,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [translateY, overlayOpacity, getSnapPosition],
  );

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start(() => {
      currentSnapIndex.current = 0;
      lastTranslateY.current = SCREEN_HEIGHT;
      onClose();
    });
  }, [translateY, overlayOpacity, onClose]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        translateY.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = lastTranslateY.current + gestureState.dy;
        const minY = getSnapPosition(SNAP_POINTS[SNAP_POINTS.length - 1]);
        const clampedY = Math.max(minY, newY);
        translateY.setValue(clampedY);

        const currentPercent = 1 - clampedY / SCREEN_HEIGHT;
        const clampedPercent = Math.max(0, Math.min(1, currentPercent));
        overlayOpacity.setValue(0.15 + clampedPercent * 0.45);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentY = lastTranslateY.current + gestureState.dy;
        const currentPercent = 1 - currentY / SCREEN_HEIGHT;
        const velocity = gestureState.vy;

        if (
          currentPercent < 0.12 ||
          (velocity > 1.5 && currentSnapIndex.current === 0)
        ) {
          dismiss();
          return;
        }

        let targetIndex = 0;

        if (Math.abs(velocity) > 0.5) {
          if (velocity < 0) {
            targetIndex = Math.min(
              currentSnapIndex.current + 1,
              SNAP_POINTS.length - 1,
            );
          } else {
            targetIndex = Math.max(currentSnapIndex.current - 1, 0);
          }
        } else {
          let closestDistance = Infinity;
          SNAP_POINTS.forEach((snap, index) => {
            const distance = Math.abs(currentPercent - snap);
            if (distance < closestDistance) {
              closestDistance = distance;
              targetIndex = index;
            }
          });
        }

        snapTo(targetIndex, velocity);
      },
    }),
  ).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(SCREEN_HEIGHT);
      overlayOpacity.setValue(0);
      setTimeout(() => snapTo(0), 50);
    }
  }, [visible, snapTo, translateY, overlayOpacity]);

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={dismiss}>
        <Animated.View style={[styles.backdrop, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.sheetContainer, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  sheetContainer: {
    position: "absolute" as const,
    left: 0,
    right: 0,
    top: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 16,
      },
      web: {
        boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  handleContainer: {
    alignItems: "center" as const,
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D1D6",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
