import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function tabs() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => (
            <Entypo name="home" size={24} color="lightblue" />
          ),
          tabBarLabelStyle: {
            fontSize: 12, // Adjust font size for visibility
            color: 'lightblue', // Set label color
          },
        }}
      />
      <Tabs.Screen
        name="PromotionScreen"
        options={{
          title: 'Promotions',
          tabBarIcon: () => (
            <MaterialIcons name="discount" size={24} color="lightblue" />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            color: 'lightblue',
          },
        }}
      />
      <Tabs.Screen
        name="PostScreen"
        options={{
          title: 'Post',
          tabBarIcon: () => (
            <FontAwesome name="plus-square" size={24} color="lightblue" />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            color: 'lightblue',
          },
        }}
      />
      <Tabs.Screen
        name="NewsFeedScreen"
        options={{
          title: 'NewsFeed',
          tabBarIcon: () => (
            <Entypo name="open-book" size={24} color="lightblue" />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            color: 'lightblue',
          },
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: 'Profile',
          tabBarIcon: () => (
            <MaterialIcons name="account-circle" size={24} color="lightblue" />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            color: 'lightblue',
          },
        }}
      />
    </Tabs>
  );
}
