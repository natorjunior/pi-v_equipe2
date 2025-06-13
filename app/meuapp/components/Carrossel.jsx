import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../service/themeService";

export default function GroupRankingCarousel({ group, rankings, rankingLoading }) {
  const { theme } = useTheme();
  const ranking = rankings[group.id] || [];

  if (rankingLoading[group.id]) {
    return (
      <View style={styles.podium}>
        <ActivityIndicator size="small" color={theme.text} />
      </View>
    );
  }

  return (
    <View style={styles.podium}>
      {ranking.length > 0 ? (
        ranking.map((rank, index) => (
          <View key={index} style={styles.podiumItem}>
            <Text style={[styles.podiumPosition, { color: theme.text }]}>
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
            </Text>
            <View style={styles.nameWrapper}>
              <Text
                style={[styles.podiumText, { color: theme.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {rank.name || rank.email}
              </Text>
              {rank.email === group.created_by && (
                <Ionicons
                  name="md-crown"
                  size={20}
                  color={theme.text}
                  style={{ marginLeft: 5 }}
                />
              )}
            </View>
          </View>
        ))
      ) : (
        <Text style={[styles.podiumText, { color: theme.text }]}>
          Ainda não há publicações
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  podium: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  podiumItem: {
    alignItems: "center",
    flex: 1,
  },
  podiumPosition: {
    fontSize: 18,
    fontWeight: "bold",
  },
  podiumText: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  nameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
});
