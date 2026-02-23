import BottomSheet from "@/components/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, MessageSquare, Phone } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [sheetVisible, setSheetVisible] = useState<boolean>(false);

  const openSheet = useCallback(() => {
    setSheetVisible(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  return (
    <View className="flex-1">
      <View className="flex-1 justify-center items-center px-7">
        <Button onPress={openSheet} testID="open-bottom-sheet">
          Open Bottom Sheet
        </Button>
      </View>

      <BottomSheet visible={sheetVisible} onClose={closeSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          className="flex-1"
          scrollEventThrottle={16}
        >
          <View className="flex-row items-center mb-4 mt-1">
            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold dark:text-white tracking-tighter">
                Cliff Rogers
              </Text>
              <Text className="text-xs text-muted-foreground mt-0.5">
                Delivery guy
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-700 items-center justify-center"
                activeOpacity={0.7}
              >
                <MessageSquare size={18} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-700 items-center justify-center"
                activeOpacity={0.7}
              >
                <Phone size={18} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="h-px bg-border mb-4" />

          <View className="flex-row justify-between items-center py-2.5">
            <View className="flex-row items-center gap-2.5">
              <Clock size={16} color="#8E8E93" />
              <Text className="text-sm dark:text-white">Estimated time</Text>
            </View>
            <Text className="text-sm font-medium dark:text-white">30mins</Text>
          </View>

          <View className="flex-row justify-between items-center py-2.5">
            <View className="flex-row items-center gap-2.5">
              <MapPin size={16} color="#8E8E93" />
              <Text className="text-sm dark:text-white">Deliver to</Text>
            </View>
            <Text className="text-sm font-medium dark:text-white">Home</Text>
          </View>

          <TouchableOpacity
            className="mt-5 py-3.5 rounded-xl border border-border items-center"
            activeOpacity={0.7}
          >
            <Text className="text-sm font-semibold dark:text-white">
              More details
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>
    </View>
  );
}
