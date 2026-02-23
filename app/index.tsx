import { Button } from "@/components/ui/button";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-xl font-semibold dark:text-white">
        Welcome to Nativewind!
      </Text>
      <Button variant={"default"} className="mt-4">
        hello
      </Button>
    </View>
  );
}
