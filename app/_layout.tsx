import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import React from "react";

import Header from "./components/appDrawer";

export const unstable_settings = {
  anchor: "(tabs)",
};

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
      <Drawer.Screen name="(tabs)" />
      <Drawer.Screen name="index" />
    </Drawer>

  );
}
