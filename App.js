import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import PlannerScreen from './src/screens/PlannerScreen';
import TaskDetailsScreen from './src/screens/TaskDetailsScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import CompletedTasksScreen from './src/screens/CompletedTasksScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import EditTaskScreen from './src/screens/EditTaskScreen';
import AIChatScreen from './src/screens/AIChatScreen';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TaskProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="SplashScreen"
              screenOptions={{
                headerShown: false,
              }}
            >

              <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
              />

              <Stack.Screen
                name="WelcomeScreen"
                component={WelcomeScreen}
              />

              <Stack.Screen
                name="SignUpScreen"
                component={SignUpScreen}
              />

              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
              />

              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
              />

              <Stack.Screen
                name="PlannerScreen"
                component={PlannerScreen}
              />

              <Stack.Screen
                name="TaskDetailsScreen"
                component={TaskDetailsScreen}
              />

              <Stack.Screen
                name="CategoryScreen"
                component={CategoriesScreen}
              />

              <Stack.Screen
                name="CompletedScreen"
                component={CompletedTasksScreen}
              />

              <Stack.Screen
                name="AddTask"
                component={AddTaskScreen}
              />

              <Stack.Screen
                name="EditTask"
                component={EditTaskScreen}
              />

              <Stack.Screen
                name="AIChatScreen"
                component={AIChatScreen}
              />

            </Stack.Navigator>
          </NavigationContainer>
        </TaskProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;