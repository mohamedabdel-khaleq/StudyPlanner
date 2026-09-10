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
  completeTask,
} from '../services/taskService';

const HomeScreen = ({ navigation }) => {
  const { user, token } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = async (isRefresh = false) => {
    if (!token) {
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getTasks(token);

      console.log('Tasks:', data);

      if (Array.isArray(data)) {
        setTasks(data);
      } else if (Array.isArray(data?.tasks)) {
        setTasks(data.tasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.log('Get tasks error:', error);

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
      loadTasks();
    }, [token])
  );

  const activeTasks = tasks.filter(
    (task) => !task.completed
  );

  const completedTasks = tasks.filter(
    (task) => task.completed
  );

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks.length / tasks.length) * 100
        );

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(token, taskId);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? { ...task, completed: true }
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

  const getPriorityStyle = (priority) => {
    if (priority === 'high') {
      return styles.highPriority;
    }

    if (priority === 'medium') {
      return styles.mediumPriority;
    }

    return styles.lowPriority;
  };

  const getPriorityText = (priority) => {
    if (!priority) {
      return 'LOW';
    }

    return priority.toUpperCase();
  };

  const getTaskTitle = (task) => {
    return (
      task.title ||
      task.name ||
      'Untitled Task'
    );
  };

  const getTaskCategory = (task) => {
    if (typeof task.category === 'string') {
      return task.category;
    }

    if (task.category?.name) {
      return task.category.name;
    }

    return 'Task';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshing={refreshing}
        onRefresh={() => loadTasks(true)}
      >

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.profile}>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                👤
              </Text>
            </View>

            <View>
              <Text style={styles.hello}>
                Hello!
              </Text>

              <Text style={styles.username}>
                {user?.name || 'USER'}
              </Text>
            </View>

          </View>

          <Text style={styles.notification}>
            🔔
          </Text>
        </View>


        {/* TODAY CARD */}
        <View style={styles.todayCard}>

          <View>
            <Text style={styles.todayText}>
              Your Today is
            </Text>

            <Text style={styles.todayText}>
              Almost Done!
            </Text>

            <Pressable
              style={styles.viewButton}
              onPress={() =>
                navigation.navigate('PlannerScreen')
              }
            >
              <Text style={styles.viewButtonText}>
                View Tasks
              </Text>
            </Pressable>
          </View>


          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>
              {progress}%
            </Text>
          </View>

        </View>


        {/* IN PROGRESS */}
        <View style={styles.sectionRow}>

          <Text style={styles.sectionTitle}>
            In Progress
          </Text>

          <Text style={styles.smallPurple}>
            •
          </Text>

        </View>


        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color="#5B2DE8"
            />

            <Text style={styles.loadingText}>
              Loading tasks...
            </Text>
          </View>
        ) : activeTasks.length === 0 ? (

          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              No active tasks
            </Text>

            <Text style={styles.emptyText}>
              Add a new task to get started.
            </Text>
          </View>

        ) : (

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >

            {activeTasks.slice(0, 5).map((task, index) => (

              <Pressable
                key={task.id || index}
                style={[
                  styles.progressCard,
                  index % 2 === 1 &&
                    styles.progressCard2,
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

                <View style={styles.cardHeader}>

                  <Text style={styles.cardCategory}>
                    {getTaskCategory(task)}
                  </Text>

                  <Text>
                    📚
                  </Text>

                </View>

                <Text
                  style={styles.cardTitle}
                  numberOfLines={2}
                >
                  {getTaskTitle(task)}
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

              </Pressable>

            ))}

          </ScrollView>
        )}


        {/* TASK GROUPS */}
        <View style={styles.sectionRow}>

          <Text style={styles.sectionTitle}>
            Task Groups
          </Text>

          <Text style={styles.groupNumber}>
            {tasks.length}
          </Text>

        </View>


        {/* TOTAL TASKS */}
        <Pressable
          style={styles.taskGroup}
          onPress={() =>
            navigation.navigate('CategoryScreen')
          }
        >

          <View
            style={[
              styles.groupIcon,
              styles.purple,
            ]}
          >
            <Text>📋</Text>
          </View>

          <View style={styles.groupTextContainer}>

            <Text style={styles.groupTitle}>
              All Tasks
            </Text>

            <Text style={styles.taskNumber}>
              {tasks.length} Tasks
            </Text>

          </View>

        </Pressable>


        {/* ACTIVE TASKS */}
        <Pressable
          style={styles.taskGroup}
          onPress={() =>
            navigation.navigate('PlannerScreen')
          }
        >

          <View
            style={[
              styles.groupIcon,
              styles.orange,
            ]}
          >
            <Text>📚</Text>
          </View>

          <View style={styles.groupTextContainer}>

            <Text style={styles.groupTitle}>
              In Progress
            </Text>

            <Text style={styles.taskNumber}>
              {activeTasks.length} Tasks
            </Text>

          </View>

        </Pressable>


        {/* COMPLETED */}
        <Pressable
          style={styles.taskGroup}
          onPress={() =>
            navigation.navigate('CompletedScreen')
          }
        >

          <View
            style={[
              styles.groupIcon,
              styles.yellow,
            ]}
          >
            <Text>✅</Text>
          </View>

          <View style={styles.groupTextContainer}>

            <Text style={styles.groupTitle}>
              Completed
            </Text>

            <Text style={styles.taskNumber}>
              {completedTasks.length} Tasks
            </Text>

          </View>

        </Pressable>


        {/* ADD TASK */}
        <Pressable
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('AddTask')
          }
        >
          <Text style={styles.plus}>
            +
          </Text>
        </Pressable>

      </ScrollView>


      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>

        <Pressable>
          <Text style={styles.navIcon}>
            ⌂
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            navigation.navigate('PlannerScreen')
          }
        >
          <Text style={styles.navIcon}>
            ▣
          </Text>
        </Pressable>

        <View style={{ width: 50 }} />

        <Pressable
          onPress={() =>
            navigation.navigate('CompletedScreen')
          }
        >
          <Text style={styles.navIcon}>
            ▤
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            navigation.navigate('CategoryScreen')
          }
        >
          <Text style={styles.navIcon}>
            ♣
          </Text>
        </Pressable>

      </View>

    </SafeAreaView>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#D9F1F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  avatarText: {
    fontSize: 22,
  },

  hello: {
    fontSize: 11,
    color: '#333',
    fontWeight: '600',
  },

  username: {
    fontSize: 14,
    color: '#222',
    fontWeight: '800',
    marginTop: 2,
  },

  notification: {
    fontSize: 19,
  },

  todayCard: {
    height: 128,
    marginTop: 20,
    borderRadius: 19,
    backgroundColor: '#5B2DE8',
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  todayText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },

  viewButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 8,
    marginTop: 13,
    alignSelf: 'flex-start',
  },

  viewButtonText: {
    color: '#5B2DE8',
    fontSize: 11,
    fontWeight: '700',
  },

  progressCircle: {
    width: 65,
    height: 65,
    borderRadius: 33,
    borderWidth: 5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#222',
  },

  smallPurple: {
    color: '#5B2DE8',
    marginLeft: 5,
  },

  groupNumber: {
    color: '#5B2DE8',
    fontWeight: '800',
    marginLeft: 5,
  },

  progressCard: {
    width: 175,
    height: 110,
    backgroundColor: '#E7F4FC',
    borderRadius: 13,
    padding: 12,
    marginRight: 10,
  },

  progressCard2: {
    backgroundColor: '#FFF0EC',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardCategory: {
    fontSize: 9,
    color: '#888',
  },

  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
  },

  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 7,
  },

  highPriority: {
    backgroundColor: '#FFE0E0',
  },

  mediumPriority: {
    backgroundColor: '#FFF0C9',
  },

  lowPriority: {
    backgroundColor: '#DFF5E5',
  },

  priorityText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#555',
  },

  loadingContainer: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 11,
    color: '#999',
    marginTop: 7,
  },

  emptyCard: {
    height: 100,
    backgroundColor: '#F7F4FF',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#444',
  },

  emptyText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },

  taskGroup: {
    height: 61,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  groupIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  purple: {
    backgroundColor: '#EEE4FF',
  },

  orange: {
    backgroundColor: '#FFEBD9',
  },

  yellow: {
    backgroundColor: '#FFF5C9',
  },

  groupTextContainer: {
    flex: 1,
  },

  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },

  taskNumber: {
    fontSize: 9,
    color: '#999',
    marginTop: 3,
  },

  addButton: {
    position: 'absolute',
    bottom: 39,
    alignSelf: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#5B2DE8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 7,
  },

  plus: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 61,
    backgroundColor: '#F0E9FF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
  },

  navIcon: {
    fontSize: 22,
    color: '#5B2DE8',
  },

});