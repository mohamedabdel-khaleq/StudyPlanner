import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { TaskProvider } from './src/context/TaskContext';
import Add from './src/screens/Add';
import Edit from './src/screens/Edit';
import Today from './src/screens/Today';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TodayStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TodayMain" component={Today} />
      <Stack.Screen name="Edit" component={Edit} />
    </Stack.Navigator>
  );
}

function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F9FF' }}>
      <Text style={{ fontSize: 24, fontWeight: '700', color: '#6600FF' }}>{title}</Text>
      <Text style={{ fontSize: 16, color: '#718096', marginTop: 8 }}>Coming Soon</Text>
    </View>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              display: route.name === 'Add' || route.name === 'Edit' ? 'none' : 'flex',
              backgroundColor: '#F0E6FF',
              borderTopWidth: 0,
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              height: 70,
              paddingBottom: 10,
              paddingTop: 10,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
          })}
        >
          <Tab.Screen
            name="Home"
            component={TodayStack}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons 
                  name="home" 
                  size={28} 
                  color={focused ? '#AF93FF' : '#CBD5E0'} 
                />
              ),
            }}
          />
          <Tab.Screen
            name="Calendar"
            component={() => <PlaceholderScreen title="Calendar" />}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons 
                  name="calendar-today" 
                  size={28} 
                  color={focused ? '#6600FF' : '#CBD5E0'} 
                />
              ),
            }}
          />
          <Tab.Screen
            name="Add"
            component={Add}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: '#6600FF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: -30,
                  shadowColor: '#6600FF',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}>
                  <MaterialIcons name="add" size={32} color="#FFFFFF" />
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Notes"
            component={() => <PlaceholderScreen title="Notes" />}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons 
                  name="description" 
                  size={28} 
                  color={focused ? '#AF93FF' : '#CBD5E0'} 
                />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={() => <PlaceholderScreen title="Profile" />}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons 
                  name="person" 
                  size={28} 
                  color={focused ? '#AF93FF' : '#CBD5E0'} 
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
}