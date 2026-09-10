import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';

import {
  getTasks,
  getTodayTasks,
  completeTask,
} from '../services/taskService';

const HomeScreen = ({ navigation }) => {
  const { user, token, getMe } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =========================
  // LOAD HOME DATA
  // =========================

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
        console.log('Get user error:', error);
      }

      // Get all tasks
      const allTasksResponse = await getTasks(token);

      // Get today's tasks
      const todayTasksResponse = await getTodayTasks(token);

      console.log('All Tasks:', allTasksResponse);
      console.log("Today's Tasks:", todayTasksResponse);

      // =========================
      // NORMALIZE ALL TASKS
      // =========================

      let allTasks = [];

      if (Array.isArray(allTasksResponse)) {
        allTasks = allTasksResponse;
      } else if (Array.isArray(allTasksResponse?.tasks)) {
        allTasks = allTasksResponse.tasks;
      }

      // =========================
      // NORMALIZE TODAY TASKS
      // =========================

      let today = [];

      if (Array.isArray(todayTasksResponse)) {
        today = todayTasksResponse;
      } else if (Array.isArray(todayTasksResponse?.tasks)) {
        today = todayTasksResponse.tasks;
      }

      setTasks(allTasks);
      setTodayTasks(today);
    } catch (error) {
      console.log('Load Home error:', error);

      Alert.alert(
        'Error',
        'Could not load your tasks. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================
  // LOAD WHEN SCREEN OPENS
  // =========================

  useFocusEffect(
    useCallback(() => {
      loadHomeData();

      return undefined;
    }, [token])
  );

  // =========================
  // TASK COUNTS
  // =========================

  const activeTasks = tasks.filter(
    (task) => task.completed !== true
  );

  const completedTasks = tasks.filter(
    (task) => task.completed === true
  );

  const totalTasks = tasks.length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks.length / totalTasks) * 100
        );

  // =========================
  // COMPLETE TASK
  // =========================

  const handleCompleteTask = async (taskId) => {
    if (!token) return;

    try {
      await completeTask(token, taskId);

      // Update all tasks locally
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          String(task.id) === String(taskId)
            ? {
                ...task,
                completed: true,
              }
            : task
        )
      );

      // Update today's tasks locally
      setTodayTasks((currentTasks) =>
        currentTasks.map((task) =>
          String(task.id) === String(taskId)
            ? {
                ...task,
                completed: true,
              }
            : task
        )
      );
    } catch (error) {
      console.log('Complete task error:', error);

      Alert.alert(
        'Error',
        'Could not complete this task.'
      );
    }
  };

  // =========================
  // USER NAME
  // =========================

  const getUserName = () => {
    if (user?.name) {
      return user.name;
    }

    if (user?.username) {
      return user.username;
    }

    if (user?.email) {
      return user.email.split('@')[0];
    }

    return 'USER';
  };

  // =========================
  // TASK TITLE
  // =========================

  const getTaskTitle = (task) => {
    return (
      task?.title ||
      task?.name ||
      'Untitled Task'
    );
  };

  // =========================
  // TASK CATEGORY
  // =========================

  const getTaskCategory = (task) => {
    if (task?.category_name) {
      return task.category_name;
    }

    if (typeof task?.category === 'string') {
      return task.category;
    }

    if (task?.category?.name) {
      return task.category.name;
    }

    return 'Task';
  };

  // =========================
  // PRIORITY
  // =========================

  const getPriorityText = (priority) => {
    if (!priority) {
      return 'LOW';
    }

    return String(priority).toUpperCase();
  };

  const getPriorityStyle = (priority) => {
    const normalizedPriority =
      String(priority || 'low').toLowerCase();

    if (normalizedPriority === 'high') {
      return styles.highPriority;
    }

    if (normalizedPriority === 'medium') {
      return styles.mediumPriority;
    }

    return styles.lowPriority;
  };

  // =========================
  // DATE FORMAT
  // =========================

  const formatDate = (date) => {
    if (!date) {
      return '';
    }

    try {
      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return date;
      }

      return parsedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return date;
    }
  };

  // =========================
  // LOADING
  // =========================

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

  // =========================
  // UI
  // =========================

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshing={refreshing}
        onRefresh={() => loadHomeData(true)}
      >

        {/* ================= HEADER ================= */}

        <View style={styles.header}>
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

          <Pressable
            style={styles.notificationButton}
            onPress={() =>
              Alert.alert(
                'Notifications',
                'No new notifications.'
              )
            }
          >
            <Text style={styles.notificationIcon}>
              🔔
            </Text>
          </Pressable>
        </View>

        {/* ================= PROGRESS CARD ================= */}

        <View style={styles.progressCard}>
          <View style={styles.progressTopRow}>
            <View>
              <Text style={styles.progressTitle}>
                Your Progress
              </Text>

              <Text style={styles.progressSubtitle}>
                Keep going, you're doing great!
              </Text>
            </View>

            <Text style={styles.progressText}>
              {progress}%
            </Text>
          </View>

          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>

          <View style={styles.progressBottomRow}>
            <Text style={styles.progressSmallText}>
              {completedTasks.length} completed
            </Text>

            <Text style={styles.progressSmallText}>
              {activeTasks.length} remaining
            </Text>
          </View>
        </View>

        {/* ================= TODAY'S TASKS ================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Today's Tasks
          </Text>

          <Pressable
            onPress={() =>
              navigation.navigate('PlannerScreen')
            }
          >
            <Text style={styles.seeAll}>
              See All
            </Text>
          </Pressable>
        </View>

        {todayTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              🎉
            </Text>

            <Text style={styles.emptyTitle}>
              No tasks for today
            </Text>

            <Text style={styles.emptyText}>
              Enjoy your day or add a new task.
            </Text>
          </View>
        ) : (
          <View>
            {todayTasks.slice(0, 5).map((task, index) => (
              <Pressable
                key={task.id || index}
                style={[
                  styles.todayTaskCard,
                  task.completed &&
                    styles.completedTaskCard,
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
                <View style={styles.taskLeft}>
                  <View
                    style={[
                      styles.taskCircle,
                      task.completed &&
                        styles.taskCircleCompleted,
                    ]}
                  >
                    {task.completed && (
                      <Text style={styles.checkMark}>
                        ✓
                      </Text>
                    )}
                  </View>

                  <View style={styles.taskInfo}>
                    <Text style={styles.cardCategory}>
                      {getTaskCategory(task)}
                    </Text>

                    <Text
                      style={[
                        styles.cardTitle,
                        task.completed &&
                          styles.completedTaskTitle,
                      ]}
                      numberOfLines={1}
                    >
                      {getTaskTitle(task)}
                    </Text>

                    {task.due_date && (
                      <Text style={styles.dateText}>
                        {formatDate(task.due_date)}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.taskRight}>
                  <View
                    style={[
                      styles.priorityBadge,
                      getPriorityStyle(task.priority),
                    ]}
                  >
                    <Text style={styles.priorityText}>
                      {getPriorityText(task.priority)}
                    </Text>
                  </View>

                  {!task.completed && (
                    <Pressable
                      style={styles.completeButton}
                      onPress={(event) => {
                        event.stopPropagation();
                        handleCompleteTask(task.id);
                      }}
                    >
                      <Text style={styles.completeButtonText}>
                        ✓
                      </Text>
                    </Pressable>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* ================= IN PROGRESS ================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            In Progress
          </Text>

          <Pressable
            onPress={() =>
              navigation.navigate('PlannerScreen')
            }
          >
            <Text style={styles.seeAll}>
              See All
            </Text>
          </Pressable>
        </View>

        {activeTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              ✅
            </Text>

            <Text style={styles.emptyTitle}>
              All tasks completed
            </Text>

            <Text style={styles.emptyText}>
              Great job! You have nothing left to do.
            </Text>
          </View>
        ) : (
          activeTasks.slice(0, 5).map((task, index) => (
            <Pressable
              key={task.id || index}
              style={styles.taskCard}
              onPress={() =>
                navigation.navigate(
                  'TaskDetailsScreen',
                  {
                    taskId: task.id,
                  }
                )
              }
            >
              <View style={styles.taskCardTop}>
                <Text style={styles.cardCategory}>
                  {getTaskCategory(task)}
                </Text>

                <View
                  style={[
                    styles.priorityBadge,
                    getPriorityStyle(task.priority),
                  ]}
                >
                  <Text style={styles.priorityText}>
                    {getPriorityText(task.priority)}
                  </Text>
                </View>
              </View>

              <Text
                style={styles.cardTitle}
                numberOfLines={2}
              >
                {getTaskTitle(task)}
              </Text>

              {task.description ? (
                <Text
                  style={styles.descriptionText}
                  numberOfLines={2}
                >
                  {task.description}
                </Text>
              ) : null}

              {task.due_date && (
                <Text style={styles.dateText}>
                  Due: {formatDate(task.due_date)}
                </Text>
              )}

              <Pressable
                style={styles.markCompleteButton}
                onPress={(event) => {
                  event.stopPropagation();
                  handleCompleteTask(task.id);
                }}
              >
                <Text
                  style={styles.markCompleteText}
                >
                  Mark Complete
                </Text>
              </Pressable>
            </Pressable>
          ))
        )}

        {/* ================= TASK GROUPS ================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Task Groups
          </Text>
        </View>

        <View style={styles.groupsContainer}>

          {/* ALL TASKS */}

          <Pressable
            style={styles.groupCard}
            onPress={() =>
              navigation.navigate('PlannerScreen')
            }
          >
            <View style={styles.groupIcon}>
              <Text style={styles.groupIconText}>
                📋
              </Text>
            </View>

            <View style={styles.groupInfo}>
              <Text style={styles.groupTitle}>
                All Tasks
              </Text>

              <Text style={styles.groupSubtitle}>
                All your tasks
              </Text>
            </View>

            <Text style={styles.groupNumber}>
              {totalTasks}
            </Text>
          </Pressable>

          {/* IN PROGRESS */}

          <Pressable
            style={styles.groupCard}
            onPress={() =>
              navigation.navigate('PlannerScreen')
            }
          >
            <View style={styles.groupIcon}>
              <Text style={styles.groupIconText}>
                ⏳
              </Text>
            </View>

            <View style={styles.groupInfo}>
              <Text style={styles.groupTitle}>
                In Progress
              </Text>

              <Text style={styles.groupSubtitle}>
                Tasks to finish
              </Text>
            </View>

            <Text style={styles.groupNumber}>
              {activeTasks.length}
            </Text>
          </Pressable>

          {/* COMPLETED */}

          <Pressable
            style={styles.groupCard}
            onPress={() =>
              navigation.navigate('CompletedScreen')
            }
          >
            <View style={styles.groupIcon}>
              <Text style={styles.groupIconText}>
                ✅
              </Text>
            </View>

            <View style={styles.groupInfo}>
              <Text style={styles.groupTitle}>
                Completed
              </Text>

              <Text style={styles.groupSubtitle}>
                Finished tasks
              </Text>
            </View>

            <Text style={styles.groupNumber}>
              {completedTasks.length}
            </Text>
          </Pressable>

        </View>

        {/* ================= ADD TASK ================= */}

        <Pressable
          style={styles.addTaskButton}
          onPress={() =>
            navigation.navigate('AddTask')
          }
        >
          <Text style={styles.addTaskIcon}>
            +
          </Text>

          <Text style={styles.addTaskText}>
            Add New Task
          </Text>
        </Pressable>

        {/* ================= BOTTOM NAV ================= */}

        <View style={styles.bottomNav}>

          <Pressable style={styles.navItem}>
            <Text style={styles.activeNavIcon}>
              🏠
            </Text>

            <Text style={styles.activeNavText}>
              Home
            </Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() =>
              navigation.navigate('PlannerScreen')
            }
          >
            <Text style={styles.navIcon}>
              📅
            </Text>

            <Text style={styles.navText}>
              Planner
            </Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() =>
              navigation.navigate('CompletedScreen')
            }
          >
            <Text style={styles.navIcon}>
              ✓
            </Text>

            <Text style={styles.navText}>
              Completed
            </Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() =>
              navigation.navigate('CategoryScreen')
            }
          >
            <Text style={styles.navIcon}>
              📁
            </Text>

            <Text style={styles.navText}>
              Categories
            </Text>
          </Pressable>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FC',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },

  // ================= HEADER =================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  hello: {
    fontSize: 15,
    color: '#777',
    marginBottom: 3,
  },

  username: {
    fontSize: 26,
    fontWeight: '700',
    color: '#171717',
    maxWidth: 250,
  },

  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  notificationIcon: {
    fontSize: 20,
  },

  // ================= PROGRESS =================

  progressCard: {
    backgroundColor: '#5B2DE8',
    borderRadius: 22,
    padding: 20,
    marginBottom: 28,
    elevation: 4,
    shadowColor: '#5B2DE8',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  progressSubtitle: {
    color: '#E9E3FF',
    fontSize: 12,
    marginTop: 5,
  },

  progressText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
  },

  progressBarBackground: {
    height: 9,
    backgroundColor: '#8C6EF0',
    borderRadius: 10,
    marginTop: 20,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },

  progressBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  progressSmallText: {
    color: '#E9E3FF',
    fontSize: 12,
  },

  // ================= SECTIONS =================

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
  },

  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B2DE8',
  },

  // ================= TODAY TASK =================

  todayTaskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  completedTaskCard: {
    opacity: 0.65,
  },

  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },

  taskCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  taskCircleCompleted: {
    backgroundColor: '#5B2DE8',
    borderColor: '#5B2DE8',
  },

  checkMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  taskInfo: {
    flex: 1,
  },

  cardCategory: {
    fontSize: 11,
    color: '#8A8A8A',
    marginBottom: 3,
    textTransform: 'uppercase',
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  completedTaskTitle: {
    textDecorationLine: 'line-through',
  },

  dateText: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
  },

  taskRight: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },

  priorityBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  priorityText: {
    fontSize: 9,
    fontWeight: '800',
  },

  highPriority: {
    backgroundColor: '#FFE1E1',
  },

  mediumPriority: {
    backgroundColor: '#FFF0D2',
  },

  lowPriority: {
    backgroundColor: '#E5F7EA',
  },

  completeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#5B2DE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7,
  },

  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // ================= IN PROGRESS =================

  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 13,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  taskCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },

  descriptionText: {
    color: '#777',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },

  markCompleteButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    backgroundColor: '#F0EBFF',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 10,
  },

  markCompleteText: {
    color: '#5B2DE8',
    fontSize: 11,
    fontWeight: '700',
  },

  // ================= EMPTY =================

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  emptyIcon: {
    fontSize: 30,
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  emptyText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
  },

  // ================= GROUPS =================

  groupsContainer: {
    marginBottom: 20,
  },

  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  groupIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#F0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  groupIconText: {
    fontSize: 20,
  },

  groupInfo: {
    flex: 1,
  },

  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },

  groupSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 3,
  },

  groupNumber: {
    fontSize: 21,
    fontWeight: '800',
    color: '#5B2DE8',
  },

  // ================= ADD TASK =================

  addTaskButton: {
    height: 55,
    backgroundColor: '#5B2DE8',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 25,
  },

  addTaskIcon: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '300',
    marginRight: 9,
  },

  addTaskText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // ================= BOTTOM NAV =================

  bottomNav: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 65,
  },

  navIcon: {
    fontSize: 18,
    marginBottom: 4,
    opacity: 0.55,
  },

  activeNavIcon: {
    fontSize: 18,
    marginBottom: 4,
  },

  navText: {
    fontSize: 10,
    color: '#999',
  },

  activeNavText: {
    fontSize: 10,
    color: '#5B2DE8',
    fontWeight: '700',
  },

  // ================= LOADING =================

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: '#777',
    fontSize: 14,
  },
});