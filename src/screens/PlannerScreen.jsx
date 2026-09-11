import React, { useCallback, useMemo, useState } from 'react';

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
  getDailyTasks,
  deleteTask,
  completeTask,
  undoTask,
} from '../services/taskService';

import BottomNav from '../screens/BottomNav';

const PlannerScreen = ({ navigation }) => {
  const { token } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // FORMAT DATE FOR API
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');
    const day = String(
      date.getDate()
    ).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // DAY NAME
  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
    });
  };

  // MONTH NAME
  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
    });
  };

  // ========================================
  // LOAD DAILY TASKS
  // ========================================

  const loadDailyTasks = async (
    date = selectedDate,
    isRefresh = false
  ) => {
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

      const formattedDate =
        formatDateForAPI(date);

      console.log(
        'Planner date:',
        formattedDate
      );

      const data = await getDailyTasks(
        token,
        formattedDate
      );

      console.log(
        'Daily Planner Tasks:',
        data
      );

      if (Array.isArray(data)) {
        setTasks(data);
      } else if (Array.isArray(data?.tasks)) {
        setTasks(data.tasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.log(
        'Daily planner error:',
        error?.response?.data ||
          error?.message ||
          error
      );

      Alert.alert(
        'Error',
        'Could not load planner tasks.'
      );

      setTasks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ========================================
  // LOAD WHEN SCREEN OPENS
  // ========================================

  useFocusEffect(
    useCallback(() => {
      loadDailyTasks();

      return undefined;
    }, [token, selectedDate])
  );

  const dates = useMemo(() => {
    const result = [];
    for (let i = -2; i <= 2; i++) {
      const date = new Date(selectedDate);
      date.setDate(
        selectedDate.getDate() + i
      );
      result.push(date);
    }
    return result;
  }, [selectedDate]);

  const filteredTasks = useMemo(() => {
    if (selectedFilter === 'All') {
      return tasks;
    }

    if (selectedFilter === 'Completed') {
      return tasks.filter(
        (task) => task.completed === true
      );
    }

    if (
      selectedFilter === 'To do' ||
      selectedFilter === 'In Progress'
    ) {
      return tasks.filter(
        (task) => task.completed !== true
      );
    }

    return tasks;
  }, [tasks, selectedFilter]);

  const handleToggleComplete = async (
    task
  ) => {
    if (!token || !task?.id) {
      return;
    }

    try {
      if (task.completed) {
        await undoTask(
          token,
          task.id
        );

        setTasks((currentTasks) =>
          currentTasks.map((item) =>
            item.id === task.id
              ? {
                  ...item,
                  completed: false,
                }
              : item
          )
        );
      } else {
        await completeTask(
          token,
          task.id
        );

        setTasks((currentTasks) =>
          currentTasks.map((item) =>
            item.id === task.id
              ? {
                  ...item,
                  completed: true,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.log(
        'Toggle task error:',
        error?.response?.data ||
          error?.message ||
          error
      );

      Alert.alert(
        'Error',
        'Could not update task status.'
      );
    }
  };


  const handleDelete = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            try {
              await deleteTask(
                token,
                taskId
              );

              setTasks(
                (currentTasks) =>
                  currentTasks.filter(
                    (task) =>
                      task.id !== taskId
                  )
              );

              Alert.alert(
                'Success',
                'Task deleted successfully.'
              );
            } catch (error) {
              console.log(
                'Delete task error:',
                error?.response?.data ||
                  error?.message ||
                  error
              );

              Alert.alert(
                'Error',
                'Could not delete this task.'
              );
            }
          },
        },
      ]
    );
  };

  const getPriorityStyle = (
    priority
  ) => {
    const value = String(
      priority || ''
    ).toLowerCase();

    if (value === 'high') {
      return styles.highPriority;
    }

    if (value === 'medium') {
      return styles.mediumPriority;
    }

    return styles.lowPriority;
  };


  const getPriorityText = (
    priority
  ) => {
    return String(
      priority || 'low'
    ).toUpperCase();
  };

  const getStatusText = (task) => {
    if (task.completed) {
      return 'Completed';
    }

    return 'To do';
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedFilter('All');
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'bottom']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshing={refreshing}
        onRefresh={() =>
          loadDailyTasks(
            selectedDate,
            true
          )
        }
      >

        {/* ================= HEADER ================= */}

        <View style={styles.header}>

          <Pressable
            onPress={() =>
              navigation.goBack()
            }
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ‹
            </Text>
          </Pressable>

          <View>
            <Text style={styles.headerTitle}>
              Planner
            </Text>

            <Text
              style={styles.headerSubtitle}
            >
              Plan your day
            </Text>
          </View>

          <Pressable
            onPress={() =>
              navigation.navigate(
                'AddTask'
              )
            }
            style={styles.headerAddButton}
          >
            <Text
              style={styles.headerAddText}
            >
              +
            </Text>
          </Pressable>

        </View>

        {/* ================= MONTH ================= */}

        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>
            {selectedDate.toLocaleDateString(
              'en-US',
              {
                month: 'long',
                year: 'numeric',
              }
            )}
          </Text>
        </View>

        {/* ================= DATES ================= */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.dateList
          }
        >
          {dates.map((date) => {
            const isSelected =
              formatDateForAPI(date) ===
              formatDateForAPI(
                selectedDate
              );

            return (
              <Pressable
                key={formatDateForAPI(
                  date
                )}
                onPress={() =>
                  handleDateSelect(
                    date
                  )
                }
                style={[
                  styles.dateCard,
                  isSelected &&
                    styles.selectedDateCard,
                ]}
              >
                <Text
                  style={[
                    styles.dayName,
                    isSelected &&
                      styles.selectedDayName,
                  ]}
                >
                  {getDayName(date)}
                </Text>

                <Text
                  style={[
                    styles.dayNumber,
                    isSelected &&
                      styles.selectedDayNumber,
                  ]}
                >
                  {date.getDate()}
                </Text>

                <Text
                  style={[
                    styles.monthName,
                    isSelected &&
                      styles.selectedMonthName,
                  ]}
                >
                  {getMonthName(date)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ================= FILTERS ================= */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.filterList
          }
        >
          {[
            'All',
            'To do',
            'In Progress',
            'Completed',
          ].map((filter) => {
            const active =
              selectedFilter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() =>
                  setSelectedFilter(
                    filter
                  )
                }
                style={[
                  styles.filterButton,
                  active &&
                    styles.activeFilterButton,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    active &&
                      styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ================= TASK HEADER ================= */}

        <View style={styles.tasksHeader}>
          <Text style={styles.sectionTitle}>
            {selectedDate.toLocaleDateString(
              'en-US',
              {
                weekday: 'long',
              }
            )}{' '}
            Tasks
          </Text>

          <Text style={styles.taskCount}>
            {filteredTasks.length}
          </Text>
        </View>

        {/* ================= LOADING ================= */}

        {loading ? (
          <View
            style={
              styles.loadingContainer
            }
          >
            <ActivityIndicator
              size="large"
              color="#5B2DE8"
            />

            <Text
              style={styles.loadingText}
            >
              Loading tasks...
            </Text>
          </View>
        ) : filteredTasks.length === 0 ? (

          /* ================= EMPTY ================= */

          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              📋
            </Text>

            <Text
              style={styles.emptyTitle}
            >
              No tasks found
            </Text>

            <Text style={styles.emptyText}>
              You don't have any tasks
              for this day.
            </Text>

            <Pressable
              style={styles.emptyButton}
              onPress={() =>
                navigation.navigate(
                  'AddTask'
                )
              }
            >
              <Text
                style={
                  styles.emptyButtonText
                }
              >
                Add Task
              </Text>
            </Pressable>
          </View>

        ) : (

          /* ================= TASK LIST ================= */

          filteredTasks.map(
            (task, index) => (
              <Pressable
                key={
                  task.id || index
                }
                style={[
                  styles.taskCard,
                  task.completed &&
                    styles.completedCard,
                ]}
                onPress={() =>
                  navigation.navigate(
                    'TaskDetailsScreen',
                    {
                      taskId:
                        task.id,
                    }
                  )
                }
              >

                {/* TOP */}

                <View
                  style={styles.taskTop}
                >
                  <View
                    style={
                      styles.categoryContainer
                    }
                  >
                    <View
                      style={[
                        styles.categoryDot,
                        task.completed &&
                          styles.completedDot,
                      ]}
                    />

                    <Text
                      style={
                        styles.categoryText
                      }
                    >
                      {task.category_name ||
                        'Task'}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.priorityBadge,
                      getPriorityStyle(
                        task.priority
                      ),
                    ]}
                  >
                    <Text
                      style={
                        styles.priorityText
                      }
                    >
                      {getPriorityText(
                        task.priority
                      )}
                    </Text>
                  </View>
                </View>

                {/* TITLE */}

                <Text
                  style={[
                    styles.taskTitle,
                    task.completed &&
                      styles.completedTitle,
                  ]}
                  numberOfLines={2}
                >
                  {task.title ||
                    'Untitled Task'}
                </Text>

                {/* DESCRIPTION */}

                {task.description ? (
                  <Text
                    style={
                      styles.description
                    }
                    numberOfLines={2}
                  >
                    {task.description}
                  </Text>
                ) : null}

                {/* BOTTOM */}

                <View
                  style={
                    styles.taskBottom
                  }
                >

                  {/* STATUS */}

                  <Pressable
                    style={
                      styles.statusContainer
                    }
                    onPress={(event) => {
                      event.stopPropagation();

                      handleToggleComplete(
                        task
                      );
                    }}
                  >
                    <Text
                      style={[
                        styles.statusIcon,
                        task.completed &&
                          styles.completedStatusIcon,
                      ]}
                    >
                      {task.completed
                        ? '✓'
                        : '○'}
                    </Text>

                    <Text
                      style={[
                        styles.statusText,
                        task.completed &&
                          styles.completedStatus,
                      ]}
                    >
                      {getStatusText(
                        task
                      )}
                    </Text>
                  </Pressable>

                  {/* ACTIONS */}

                  <View
                    style={styles.actions}
                  >
                    <Pressable
                      style={
                        styles.editButton
                      }
                      onPress={(event) => {
                        event.stopPropagation();

                        navigation.navigate(
                          'EditTask',
                          {
                            taskId:
                              task.id,
                          }
                        );
                      }}
                    >
                      <Text
                        style={
                          styles.editText
                        }
                      >
                        Edit
                      </Text>
                    </Pressable>

                    <Pressable
                      style={
                        styles.deleteButton
                      }
                      onPress={(event) => {
                        event.stopPropagation();

                        handleDelete(
                          task.id
                        );
                      }}
                    >
                      <Text
                        style={
                          styles.deleteText
                        }
                      >
                        Delete
                      </Text>
                    </Pressable>
                  </View>

                </View>
              </Pressable>
            )
          )
        )}

      </ScrollView>
      <BottomNav
        navigation={navigation}
        activeScreen="PlannerScreen"
      />

    </SafeAreaView>
  );
};

export default PlannerScreen;


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 120,
  },

  // HEADER

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    fontSize: 30,
    color: '#5B2DE8',
    lineHeight: 32,
    marginTop: -3,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#222222',
    textAlign: 'center',
  },

  headerSubtitle: {
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
    marginTop: 2,
  },

  headerAddButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#5B2DE8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerAddText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '300',
    marginTop: -2,
  },

  // MONTH

  monthHeader: {
    marginTop: 22,
    marginBottom: 12,
  },

  monthText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222222',
  },

  // DATES

  dateList: {
    paddingRight: 10,
  },

  dateCard: {
    width: 62,
    height: 78,
    borderRadius: 16,
    backgroundColor: '#F6F3FB',
    marginRight: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedDateCard: {
    backgroundColor: '#5B2DE8',
  },

  dayName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888888',
  },

  selectedDayName: {
    color: '#DDD2FF',
  },

  dayNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333333',
    marginTop: 2,
  },

  selectedDayNumber: {
    color: '#FFFFFF',
  },

  monthName: {
    fontSize: 9,
    color: '#999999',
    marginTop: 1,
  },

  selectedMonthName: {
    color: '#DDD2FF',
  },

  filterList: {
    paddingVertical: 18,
    paddingRight: 10,
  },

  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F0F8',
    marginRight: 8,
  },

  activeFilterButton: {
    backgroundColor: '#5B2DE8',
  },

  filterText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#777777',
  },

  activeFilterText: {
    color: '#FFFFFF',
  },

  tasksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#222222',
  },

  taskCount: {
    marginLeft: 7,
    minWidth: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#EEE6FF',
    color: '#5B2DE8',
    textAlign: 'center',
    lineHeight: 23,
    fontSize: 10,
    fontWeight: '800',
  },

  loadingContainer: {
    minHeight: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 11,
    color: '#999999',
  },

  emptyCard: {
    backgroundColor: '#F8F5FF',
    borderRadius: 18,
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 34,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#333333',
  },

  emptyText: {
    fontSize: 10,
    color: '#999999',
    marginTop: 5,
    textAlign: 'center',
  },

  emptyButton: {
    backgroundColor: '#5B2DE8',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 15,
  },

  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  completedCard: {
    opacity: 0.82,
  },

  taskTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5B2DE8',
    marginRight: 7,
  },

  completedDot: {
    backgroundColor: '#32A852',
  },

  categoryText: {
    fontSize: 10,
    color: '#888888',
    fontWeight: '700',
  },

  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
  },

  highPriority: {
    backgroundColor: '#FFE1E1',
  },

  mediumPriority: {
    backgroundColor: '#FFF0C7',
  },

  lowPriority: {
    backgroundColor: '#DFF4E5',
  },

  priorityText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#555555',
  },

  taskTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#292929',
    marginTop: 11,
    lineHeight: 20,
  },

  completedTitle: {
    color: '#888888',
    textDecorationLine: 'line-through',
  },

  description: {
    fontSize: 10,
    color: '#999999',
    lineHeight: 15,
    marginTop: 5,
  },

  taskBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: '#F1EEF5',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusIcon: {
    fontSize: 16,
    color: '#5B2DE8',
    marginRight: 5,
  },

  completedStatusIcon: {
    color: '#32A852',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#777777',
  },

  completedStatus: {
    color: '#32A852',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  editButton: {
    backgroundColor: '#F0EBFF',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
  },

  editText: {
    fontSize: 9,
    color: '#5B2DE8',
    fontWeight: '800',
  },

  deleteButton: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
  },

  deleteText: {
    fontSize: 9,
    color: '#E74C3C',
    fontWeight: '800',
  },

});