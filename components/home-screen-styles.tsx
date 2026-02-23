import BottomSheet from "@/components/bottom-sheet";
import { Image } from "expo-image";
import { Clock, MapPin, MessageSquare, Phone } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AVATAR_URL =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face";

export default function HomeScreenStyles() {
  const [sheetVisible, setSheetVisible] = useState<boolean>(false);

  const openSheet = useCallback(() => {
    setSheetVisible(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <TouchableOpacity
          style={styles.openButton}
          onPress={openSheet}
          activeOpacity={0.85}
          testID="open-bottom-sheet"
        >
          <Text style={styles.openButtonText}>Open Bottom Sheet</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet visible={sheetVisible} onClose={closeSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          style={styles.sheetScroll}
        >
          <View style={styles.profileRow}>
            <Image
              source={{ uri: AVATAR_URL }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Cliff Rogers</Text>
              <Text style={styles.profileRole}>Delivery guy</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <MessageSquare size={18} color="#3C3C43" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <Phone size={18} color="#3C3C43" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Clock size={16} color="#8E8E93" />
              <Text style={styles.detailLabel}>Estimated time</Text>
            </View>
            <Text style={styles.detailValue}>30mins</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <MapPin size={16} color="#8E8E93" />
              <Text style={styles.detailLabel}>Deliver to</Text>
            </View>
            <Text style={styles.detailValue}>Home</Text>
          </View>

          <TouchableOpacity
            style={styles.moreDetailsButton}
            activeOpacity={0.7}
          >
            <Text style={styles.moreDetailsText}>More details</Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  openButton: {
    backgroundColor: "#1B5E3B",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 50,
    width: "100%",
    alignItems: "center",
  },
  openButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600" as const,
    letterSpacing: 0.3,
  },
  sheetScroll: {
    flex: 1,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E5EA",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: "#1C1C1E",
    letterSpacing: -0.2,
  },
  profileRole: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E5EA",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  detailLabel: {
    fontSize: 15,
    color: "#3C3C43",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: "#1C1C1E",
  },
  moreDetailsButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    alignItems: "center",
  },
  moreDetailsText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#1C1C1E",
  },
});
