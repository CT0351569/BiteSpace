import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="RegistrationScreen" options={{ headerShown: false }}/>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="ReviewScreen" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="ExpScreen" options={{ headerShown: false }} />
      <Stack.Screen name="OtherProfileScreen" options={{ headerShown: false }}/>
      <Stack.Screen name="SettingsScreen" options={{ headerShown: false }} />
      <Stack.Screen name= "InboxScreen" options= {{headerShown: false}}/>
      <Stack.Screen name= "MessageScreen" options= {{headerShown: false}}/>
      <Stack.Screen name= "ComposeMessageScreen" options= {{headerShown: false}}/>
    </Stack>
  );
};

export default RootLayout;
