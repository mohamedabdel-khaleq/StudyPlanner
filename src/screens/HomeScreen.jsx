import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Feather,
  Ionicons,
} from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import {
  getTasks,
  getTodayTasks,
} from '../services/taskService';
import BottomNav from '../screens/BottomNav';

const HomeScreen = ({ navigation }) => {
  const { user, token, getMe } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHomeData = async (isRefresh = false) => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Get current user
      try {
        await getMe();
      } catch (error) {
        console.log(
          'Get user error:',
          error?.response?.data ||
            error?.message ||
            error
        );
      }

      // Get all tasks
      const allTasksResponse = await getTasks(token);

      // Get today's tasks
      const todayTasksResponse =
        await getTodayTasks(token);

      const allTasks = Array.isArray(
        allTasksResponse
      )
        ? allTasksResponse
        : allTasksResponse?.tasks || [];

      const today = Array.isArray(
        todayTasksResponse
      )
        ? todayTasksResponse
        : todayTasksResponse?.tasks || [];

      setTasks(allTasks);
      setTodayTasks(today);

      console.log(
        'Home - All Tasks:',
        allTasks
      );

      console.log(
        'Home - Today Tasks:',
        today
      );
    } catch (error) {
      console.log(
        'Home load error:',
        error?.response?.data ||
          error?.message ||
          error
      );

      Alert.alert(
        'Error',
        'Could not load your tasks.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [token])
  );

  const activeTasks = tasks.filter(
    (task) => !task.completed
  );

  const completedTasks = tasks.filter(
    (task) => task.completed
  );

  const totalTasks = tasks.length;
  const progress = 85;
  const getUserName = () => {
    return (
      user?.name ||
      user?.username ||
      user?.email?.split('@')[0] ||
      'USER'
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#5B2DE8"
          />

          <Text style={styles.loadingText}>
            Loading your tasks...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenWrapper}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshing={refreshing}
          onRefresh={() =>
            loadHomeData(true)
          }
        >

          <View style={styles.header}>
            <View style={styles.userProfileRow}>
              <View style={styles.avatarContainer}>
                <Ionicons
                  name="person"
                  size={20}
                  color="#777"
                />
              </View>

              <View>
                <Text style={styles.hello}>
                  Hello!
                </Text>

                <Text
                  style={styles.username}
                  numberOfLines={1}
                >
                  {getUserName()}
                </Text>
              </View>

            </View>

            <Pressable
              style={styles.notificationButton}
            >
              <Ionicons
                name="notifications"
                size={18}
                color="#1A1A1A"
              />
            </Pressable>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressLeft}>

              <Text
                style={styles.progressSubtitle}
              >
                Your Today is
              </Text>

              <Text
                style={styles.progressTitle}
              >
                Almost Done!
              </Text>

              <Pressable
                style={styles.viewTasksButton}
                onPress={() =>
                  navigation.navigate(
                    'PlannerScreen'
                  )
                }
              >
                <Text
                  style={styles.viewTasksText}
                >
                  View Tasks
                </Text>
              </Pressable>

            </View>

            <View
              style={
                styles.progressCircleContainer
              }
            >

              <View
                style={
                  styles.progressCircleOuter
                }
              >

                <View
                  style={
                    styles.progressCircleInner
                  }
                >

                  <Text
                    style={
                      styles.progressPercentage
                    }
                  >
                    {progress}%
                  </Text>
                </View>
              </View>
            </View>
          </View>


          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>
              In Progress{' '}
              <Text style={styles.pinkBadge}>
                •
              </Text>
            </Text>

          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              styles.horizontalScrollContent
            }
          >

            {activeTasks.length === 0 ? (

              <View
                style={
                  styles.emptyHorizontalCard
                }
              >
                <Text style={styles.emptyText}>
                  No tasks in progress
                </Text>
              </View>

            ) : (

              activeTasks.map(
                (task, index) => (

                  <Pressable
                    key={
                      task.id || index
                    }
                    style={[
                      styles.inProgressCard,
                      {
                        backgroundColor:
                          index % 2 === 0
                            ? '#EBE8FC'
                            : '#FFEDE8',
                      },
                    ]}
                    onPress={() =>
                      navigation.navigate(
                        'TaskDetailsScreen',
                        {
                          taskId: task.id,
                        }
                      )
                    }
                  >

                    <Text
                      style={
                        styles.cardCategory
                      }
                    >
                      {task.category_name ||
                        'No Category'}
                    </Text>

                    <Text
                      style={styles.cardTitle}
                      numberOfLines={2}
                    >
                      {task.title ||
                        task.name ||
                        'Untitled Task'}
                    </Text>
                  </Pressable>
                )
              )
            )}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Task Groups{' '}
              <Text style={styles.pinkBadge}>
                •
              </Text>
            </Text>

          </View>

          <View style={styles.groupsContainer}>
            <Pressable
              style={styles.groupCard}
              onPress={() =>
                navigation.navigate(
                  'CategoryScreen'
                )
              }
            >

              <View
                style={[
                  styles.groupIcon,
                  {
                    backgroundColor:
                      '#FFEBF0',
                  },
                ]}
              >

                <Feather
                  name="briefcase"
                  size={18}
                  color="#FF6B81"
                />

              </View>

              <View style={styles.groupInfo}>

                <Text
                  style={styles.groupTitle}
                >
                  Office Project
                </Text>

                <Text
                  style={styles.groupSubtitle}
                >
                  23 Tasks
                </Text>

              </View>

            </Pressable>

            {/* PERSONAL */}

            <Pressable
              style={styles.groupCard}
              onPress={() =>
                navigation.navigate(
                  'CategoryScreen'
                )
              }
            >

              <View
                style={[
                  styles.groupIcon,
                  {
                    backgroundColor:
                      '#EBF3FF',
                  },
                ]}
              >

                <Feather
                  name="user"
                  size={18}
                  color="#3B82F6"
                />

              </View>

              <View style={styles.groupInfo}>

                <Text
                  style={styles.groupTitle}
                >
                  Personal Project
                </Text>

                <Text
                  style={styles.groupSubtitle}
                >
                  30 Tasks
                </Text>

              </View>

            </Pressable>

            {/* STUDY */}

            <Pressable
              style={styles.groupCard}
              onPress={() =>
                navigation.navigate(
                  'CategoryScreen'
                )
              }
            >

              <View
                style={[
                  styles.groupIcon,
                  {
                    backgroundColor:
                      '#FFF5E5',
                  },
                ]}
              >

                <Feather
                  name="book-open"
                  size={18}
                  color="#F59E0B"
                />

              </View>

              <View style={styles.groupInfo}>

                <Text
                  style={styles.groupTitle}
                >
                  Daily Study
                </Text>

                <Text
                  style={styles.groupSubtitle}
                >
                  15 Tasks
                </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>

        <BottomNav
          navigation={navigation}
          activeScreen="HomeScreen"
        />

      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },

  screenWrapper: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  userProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,

    backgroundColor: '#EAEAEA',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  hello: {
    fontSize: 12,
    color: '#8A8A8A',
  },

  username: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },

  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,

    backgroundColor: '#FFFFFF',

    alignItems: 'center',
    justifyContent: 'center',
  },

  progressCard: {
    backgroundColor: '#5B2DE8',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  progressLeft: {
    flex: 1,
  },

  progressSubtitle: {
    color: '#D4C5FF',
    fontSize: 13,
  },

  progressTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',

    marginBottom: 15,
  },

  viewTasksButton: {
    backgroundColor: '#FFFFFF',

    paddingHorizontal: 16,
    paddingVertical: 8,

    borderRadius: 12,

    alignSelf: 'flex-start',
  },

  viewTasksText: {
    color: '#5B2DE8',
    fontSize: 12,
    fontWeight: '700',
  },

  progressCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressCircleOuter: {
    width: 72,
    height: 72,

    borderRadius: 36,

    borderWidth: 6,
    borderColor: '#7F57F1',

    alignItems: 'center',
    justifyContent: 'center',
  },

  progressCircleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressPercentage: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F1F1F',
  },

  pinkBadge: {
    color: '#FF6B81',
  },

  horizontalScrollContent: {
    paddingRight: 10,
    marginBottom: 25,
  },

  inProgressCard: {
    width: 160,
    height: 110,
    borderRadius: 18,
    padding: 14,
    marginRight: 12,
    justifyContent: 'space-between',
  },

  cardCategory: {
    fontSize: 11,
    color: '#8A8A8A',
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  emptyHorizontalCard: {
    width: 200,
    height: 100,

    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    color: '#AAA',
  },

  groupsContainer: {
    marginBottom: 10,
  },

  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  groupInfo: {
    flex: 1,
  },

  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  groupSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: '#777',
  },

});