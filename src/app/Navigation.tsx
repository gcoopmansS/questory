import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";

import { LibraryScreen } from "../screens/LibraryScreen";
import { ReadingScreen } from "../screens/ReadingScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { DiscoverScreen } from "../screens/DiscoverScreen";
import { BookDetailScreen } from "../screens/BookDetailScreen";
import { colors } from "../theme/colors";
import { componentSpacing } from "../theme/spacing";

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  Discover: undefined;
  BookDetail: { bookId: string };
};

export type TabParamList = {
  Library: undefined;
  Reading: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 2,
          height: componentSpacing.tabBarHeight,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 600,
          // Pixel-style text
          textShadowColor: colors.shadow,
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 0,
        },
      }}
    >
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarLabel: "LIBRARY",
          // Using text instead of icons for pixel aesthetic
        }}
      />
      <Tab.Screen
        name="Reading"
        component={ReadingScreen}
        options={{
          tabBarLabel: "READING",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "PROFILE",
        }}
      />
    </Tab.Navigator>
  );
};

export const Navigation: React.FC = () => {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.accent1,
        },
        fonts: {
          regular: {
            fontFamily: "System",
            fontWeight: "normal",
          },
          medium: {
            fontFamily: "System",
            fontWeight: "500",
          },
          light: {
            fontFamily: "System",
            fontWeight: "300",
          },
          thin: {
            fontFamily: "System",
            fontWeight: "100",
          },
          heavy: {
            fontFamily: "System",
            fontWeight: "700",
          },
        },
      }}
    >
      <StatusBar style="light" backgroundColor={colors.background} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
          name="Discover"
          component={DiscoverScreen}
          options={{
            headerShown: true,
            title: "Discover Books",
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
          }}
        />
        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{
            headerShown: true,
            title: "Book Details",
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
