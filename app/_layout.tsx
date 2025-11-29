import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import React from "react";

import Header from "./components/appDrawer";

export default function RootLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: "slide",
        drawerStyle: {
          width: "80%",
        },
      }}
      drawerContent={(props: DrawerContentComponentProps) => (
        <Header {...props} />
      )}
    >
      {/* 👇 Ensure index loads FIRST */}
      <Drawer.Screen name="index" />

      {/* 👇 Tabs should load AFTER welcome/index page */}
      <Drawer.Screen name="(tabs)" />
    </Drawer>
  );
}
