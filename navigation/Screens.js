import { Dimensions } from "react-native";
import { Header } from "../components";
import { Images, materialTheme } from "../constants/";

import CustomDrawerContent from "./Menu";
import HomeScreen from "../screens/App";
import OnboardingScreen from "../screens/Onboarding";
import SignUpScreen from "../screens/SignUp";
import ProfileScreen from "../screens/Profile";
import LeaderboardScreen from "../screens/Leaderboard";
import StatisticsScreen from "../screens/Statistics";
import DashboardScreen from "../screens/Dashboard";

import ManageEmployeesScreen from "../business/ManageEmployees" 
import SetRemindersScreen from "../business/SetReminders" 

import React from "react";
import SettingsScreen from "../screens/Settings";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const profile = {
  avatar: Images.Profile,
  name: "George Valtas",
  plan: "Pro"
};

function ProfileStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              white
              transparent
              title="Profile"
              scene={scene}
              navigation={navigation}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}


function SignUpStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerLeftLabelVisible: false,
        headerMode: false,
        cardStyle: {
          backgroundColor: 'transparent'
        }
      }}
    >
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
      />
    </Stack.Navigator>
  );
}

function LeaderboardStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Leaderboard"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Statistics"
        component={LeaderboardScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Statistics" scene={scene} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function StatisticsStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Statistics"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Statistics" scene={scene} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Settings" scene={scene} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              tabs
              title="Home"
              navigation={navigation}
              scene={scene}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function DashboardStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              tabs
              title="Dashboard"
              navigation={navigation}
              scene={scene}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}


function ManageEmployeesStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerLeftLabelVisible: false,
      }}
    >
      <Stack.Screen
        name="Manage Employees"
        component={ManageEmployeesScreen}
      />
    </Stack.Navigator>
  );
}

function SetRemindersStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerLeftLabelVisible: false,
      }}
    >
      <Stack.Screen
        name="SetReminders"
        component={SetRemindersScreen}
      />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} profile={profile} />
      )}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8,
      }}
      drawerContentOptions={{
        activeTintColor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: materialTheme.COLORS.ACTIVE,
        inactiveBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.74,
          paddingHorizontal: 12,
          // paddingVertical: 4,
          justifyContent: "center",
          alignContent: "center",
          // alignItems: 'center',
          overflow: "hidden",
        },
        labelStyle: {
          fontSize: 18,
          fontWeight: "normal",
        },
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
      />
      <Drawer.Screen
        name="Sign Up"
        component={SignUpStack}
      />
      <Drawer.Screen
        name="Leaderboard"
        component={LeaderboardStack}
      />
      <Drawer.Screen
        name="Statistics"
        component={StatisticsStack}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
      />
      {/* ////////////////// Business UI  //////////////////*/}
      <Drawer.Screen
        name="Dashboard"
        component={DashboardStack}
      />
      <Drawer.Screen
        name="ManageEmployees"
        component={ManageEmployeesStack}
      />
      <Drawer.Screen
        name="SetReminders"
        component={SetRemindersStack}
      />
    </Drawer.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}
