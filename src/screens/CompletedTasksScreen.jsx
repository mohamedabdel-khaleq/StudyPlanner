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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import {
  getCompletedTasks,
  undoTask,
} from '../services/taskService';
import BottomNav from '../screens/BottomNav';

const CompletedTasksScreen = ({ navigation }) => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const loadCompletedTasks = async () => {
    if (!token) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await getCompletedTasks(token);

      console.log(
        'Completed Tasks API Response:',
        response
      );

      let completedTasks = [];

      if (Array.isArray(response)) {
        completedTasks = response;
      } else if (Array.isArray(response?.tasks)) {
        completedTasks = response.tasks;
      } else if (Array.isArray(response?.items)) {
        completedTasks = response.items;
      }

      // Show only completed tasks
      completedTasks = completedTasks.filter(
        (task) => task?.completed === true
      );

      setTasks(completedTasks);
    } catch (error) {
      console.log(
        'Completed tasks error:',
        error?.response?.data || error
      );

      console.log(
        'Completed tasks status:',
        error?.response?.status
      );

      Alert.alert(
        'Error',
        'Could not load completed tasks.'
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCompletedTasks();

      return undefined;
    }, [token])
  );

  const handleUndoTask = async (taskId) => {
    if (!token || actionLoading) {
      return;
    }

    try {
      setActionLoading(true);

      console.log(
        'Undoing task:',
        taskId
      );

      const response = await undoTask(
        token,
        taskId
      );

      console.log(
        'Undo API Response:',
        response
      );

      // Remove task from completed list
      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) =>
            String(task.id) !==
            String(taskId)
        )
      );

      Alert.alert(
        'Success',
        'Task moved back to To-do.'
      );
    } catch (error) {
      console.log(
        'Undo task error:',
        error?.response?.data || error
      );

      console.log(
        'Undo task status:',
        error?.response?.status
      );

      Alert.alert(
        'Error',
        'Could not move the task back.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const confirmUndo = (taskId) => {
    Alert.alert(
      'Move Task Back',
      'Do you want to move this task back to To-do?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () =>
            handleUndoTask(taskId),
        },
      ]
    );
  };

  const getTaskTitle = (task) => {
    return (
      task?.title ||
      task?.name ||
      'Untitled Task'
    );
  };

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

  const formatDate = (date) => {
    if (!date) {
      return '';
    }

    try {
      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return String(date);
      }

      return parsedDate.toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }
      );
    } catch {
      return String(date);
    }
  };

  const getPriorityStyle = (priority) => {
    const normalized =
      String(priority || 'low').toLowerCase();

    if (normalized === 'high') {
      return styles.highPriority;
    }

    if (normalized === 'medium') {
      return styles.mediumPriority;
    }

    return styles.lowPriority;
  };

  const getPriorityText = (priority) => {
    return String(
      priority || 'low'
    ).toUpperCase();
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
            Loading completed tasks...
          </Text>
        </View>

        <BottomNav
          navigation={navigation}
          activeScreen="CompletedScreen"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() =>
                navigation.goBack()
              }
            >
              <Text style={styles.backIcon}>
                ‹
              </Text>
            </Pressable>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>
                Completed Tasks
              </Text>

              <Text style={styles.headerSubtitle}>
                {tasks.length} completed
              </Text>
            </View>

            <View style={styles.headerRight}>
              <Text style={styles.headerCheck}>
                ✓
              </Text>
            </View>
          </View>

          <View style={styles.summaryCard}>

            <View style={styles.summaryIcon}>
              <Text style={styles.summaryIconText}>
                ✓
              </Text>
            </View>

            <View style={styles.summaryInfo}>

              <Text style={styles.summaryTitle}>
                Great job! 🎉
              </Text>

              <Text style={styles.summaryText}>
                You have completed{' '}
                {tasks.length}{' '}
                {tasks.length === 1
                  ? 'task'
                  : 'tasks'}
                .
              </Text>

            </View>

            <Text style={styles.summaryNumber}>
              {tasks.length}
            </Text>
          </View>


          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Finished Tasks
            </Text>
          </View>
          {tasks.length === 0 ? (

            <View style={styles.emptyCard}>

              <View
                style={
                  styles.emptyIconContainer
                }
              >
                <Text style={styles.emptyIcon}>
                  ✓
                </Text>
              </View>

              <Text style={styles.emptyTitle}>
                No completed tasks
              </Text>

              <Text style={styles.emptyText}>
                Complete your tasks and they
                will appear here.
              </Text>

              <Pressable
                style={styles.goPlannerButton}
                onPress={() =>
                  navigation.navigate(
                    'PlannerScreen'
                  )
                }
              >
                <Text style={styles.goPlannerText}>
                  Go to Planner
                </Text>
              </Pressable>
            </View>
          ) : (


            tasks.map((task, index) => (

              <Pressable
                key={
                  task?.id
                    ? String(task.id)
                    : String(index)
                }
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
                <View style={styles.taskTop}>

                  <View
                    style={
                      styles.categoryContainer
                    }
                  >

                    <View
                      style={
                        styles.categoryDot
                      }
                    />

                    <Text
                      style={
                        styles.categoryText
                      }
                    >
                      {getTaskCategory(task)}
                    </Text>

                  </View>

                  <View
                    style={
                      styles.completedBadge
                    }
                  >
                    <Text
                      style={
                        styles.completedBadgeText
                      }
                    >
                      ✓ Done
                    </Text>
                  </View>

                </View>

                {/* TITLE */}

                <Text
                  style={styles.taskTitle}
                  numberOfLines={2}
                >
                  {getTaskTitle(task)}
                </Text>

                {/* DESCRIPTION */}

                {task?.description ? (
                  <Text
                    style={styles.description}
                    numberOfLines={2}
                  >
                    {task.description}
                  </Text>
                ) : null}

                {/* INFO */}

                <View style={styles.infoRow}>

                  {task?.due_date ? (
                    <View
                      style={
                        styles.dateContainer
                      }
                    >

                      <Text
                        style={styles.infoIcon}
                      >
                        📅
                      </Text>

                      <Text
                        style={styles.dateText}
                      >
                        {formatDate(
                          task.due_date
                        )}
                      </Text>

                    </View>
                  ) : (
                    <View />
                  )}

                  <View
                    style={[
                      styles.priorityBadge,
                      getPriorityStyle(
                        task?.priority
                      ),
                    ]}
                  >
                    <Text
                      style={
                        styles.priorityText
                      }
                    >
                      {getPriorityText(
                        task?.priority
                      )}
                    </Text>
                  </View>

                </View>

                {/* ACTIONS */}

                <View style={styles.actionsRow}>

                  {/* DETAILS */}

                  <Pressable
                    style={
                      styles.detailsButton
                    }
                    onPress={(event) => {

                      event.stopPropagation();

                      navigation.navigate(
                        'TaskDetailsScreen',
                        {
                          taskId: task.id,
                        }
                      );

                    }}
                  >
                    <Text
                      style={
                        styles.detailsButtonText
                      }
                    >
                      View Details
                    </Text>
                  </Pressable>

                  {/* UNDO */}

                  <Pressable
                    style={[
                      styles.undoButton,
                      actionLoading &&
                        styles.disabledButton,
                    ]}
                    disabled={actionLoading}
                    onPress={(event) => {

                      event.stopPropagation();

                      confirmUndo(task.id);

                    }}
                  >
                    {actionLoading ? (
                      <ActivityIndicator
                        size="small"
                        color="#FFFFFF"
                      />
                    ) : (
                      <Text
                        style={
                          styles.undoButtonText
                        }
                      >
                        Undo
                      </Text>
                    )}
                  </Pressable>

                </View>

              </Pressable>

            ))
          )}

        </ScrollView>

        <BottomNav
          navigation={navigation}
          activeScreen="CompletedScreen"
        />

      </View>
    </SafeAreaView>
  );
};

export default CompletedTasksScreen;


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F7FC',
  },

  screenWrapper: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  backIcon: {
    fontSize: 32,
    color: '#171717',
    lineHeight: 35,
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#171717',
  },

  headerSubtitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },

  headerRight: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#E9E1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCheck: {
    color: '#5B2DE8',
    fontSize: 22,
    fontWeight: '800',
  },

  summaryCard: {
    backgroundColor: '#5B2DE8',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    elevation: 4,
    shadowColor: '#5B2DE8',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  summaryIconText: {
    color: '#5B2DE8',
    fontSize: 25,
    fontWeight: '800',
  },

  summaryInfo: {
    flex: 1,
  },

  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  summaryText: {
    color: '#E9E3FF',
    fontSize: 11,
    marginTop: 4,
  },

  summaryNumber: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },


  sectionHeader: {
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
  },

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

  taskTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5B2DE8',
    marginRight: 7,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
  },

  completedBadge: {
    backgroundColor: '#E5F7EA',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },

  completedBadgeText: {
    color: '#2F855A',
    fontSize: 10,
    fontWeight: '800',
  },

  taskTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#171717',
    lineHeight: 23,
    marginBottom: 7,
  },

  description: {
    color: '#777',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    fontSize: 13,
    marginRight: 5,
  },

  dateText: {
    fontSize: 11,
    color: '#888',
  },

  priorityBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
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

  actionsRow: {
    flexDirection: 'row',
    marginTop: 14,
  },

  detailsButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  detailsButtonText: {
    color: '#5B2DE8',
    fontSize: 12,
    fontWeight: '700',
  },

  undoButton: {
    width: 90,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#5B2DE8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  undoButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  emptyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E9E1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  emptyIcon: {
    color: '#5B2DE8',
    fontSize: 35,
    fontWeight: '800',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  emptyText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 7,
  },

  goPlannerButton: {
    marginTop: 18,
    backgroundColor: '#5B2DE8',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 11,
  },

  goPlannerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

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