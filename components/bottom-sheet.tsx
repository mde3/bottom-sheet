import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SNAP_POINTS = [0.35, 0.75, 0.9]; // 35%, 75% & 90%

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({
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

  const shadowStyle = Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    android: {
      elevation: 16,
    },
  });

  return (
    <View className="absolute inset-0 z-[1000] pointer-events-box-none">
      <TouchableWithoutFeedback onPress={dismiss}>
        <Animated.View
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        className="absolute inset-x-0 top-0 bg-white dark:bg-zinc-900 rounded-t-3xl overflow-hidden"
        style={[
          { height: SCREEN_HEIGHT, transform: [{ translateY }] },
          shadowStyle,
        ]}
        {...panResponder.panHandlers}
      >
        <View className="items-center pt-2.5 pb-1.5">
          <View className="w-10 h-1 rounded bg-zinc-700" />
        </View>
        <View className="flex-1 overflow-hidden px-5 pt-2">{children}</View>
      </Animated.View>
    </View>
  );
}
