import React, { useEffect, useMemo, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import {
  getTasks,
  deleteTask as deleteTaskAPI,
  completeTask as completeTaskAPI,
  undoTask as undoTaskAPI,
} from '../services/taskService';

import styles from './styles';

const TodayScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('All');

  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // =========================
  // Date Helpers
  // =========================

  const formatDateToISO = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // =========================
  // Load Tasks
  // =========================

  const loadTasks = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getTasks(token);

      const tasksArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : [];

      setTasks(tasksArray);
    } catch (error) {
      console.log('Today tasks error:', error);

      Alert.alert(
        'Error',
        'Could not load your tasks. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [token]);

  // =========================
  // Week Days
  // =========================

  const weekDays = useMemo(() => {
    const days = [];

    for (let i = -3; i <= 3; i++) {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() + i);
      days.push(date);
    }

    return days;
  }, [selectedDate]);

  // =========================
  // Convert API Status
  // =========================

  const getTaskStatus = (task) => {
    if (task.completed === true) {
      return 'Done';
    }

    // لو الـ backend عنده status بالفعل
    if (
      task.status === 'In Progress' ||
      task.status === 'To-do' ||
      task.status === 'Done'
    ) {
      return task.status;
    }

    return 'To-do';
  };

  // =========================
  // Filter Tasks
  // =========================

  const filteredTasks = useMemo(() => {
    const selectedDateISO = formatDateToISO(selectedDate);

    return tasks.filter((task) => {
      const taskDate = task.due_date || task.date;

      if (!taskDate) {
        return false;
      }

      if (taskDate.split('T')[0] !== selectedDateISO) {
        return false;
      }

      const status = getTaskStatus(task);

      if (activeFilter === 'All') {
        return true;
      }

      return status === activeFilter;
    });
  }, [tasks, activeFilter, selectedDate]);

  // =========================
  // Edit
  // =========================

  const handleEdit = (taskId) => {
    navigation.navigate('EditTask', {
      taskId,
    });
  };

  // =========================
  // Delete
  // =========================

  const handleDeletePress = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete === null || !token) {
      return;
    }

    try {
      await deleteTaskAPI(token, taskToDelete);

      setTasks((prevTasks) =>
        prevTasks.filter(
          (task) => String(task.id) !== String(taskToDelete)
        )
      );

      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch (error) {
      console.log('Delete task error:', error);

      Alert.alert(
        'Error',
        'Could not delete the task.'
      );

      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  // =========================
  // Complete / Undo
  // =========================

  const handleToggleComplete = async (task) => {
    if (!token) {
      return;
    }

    try {
      if (task.completed) {
        await undoTaskAPI(token, task.id);
      } else {
        await completeTaskAPI(token, task.id);
      }

      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          String(item.id) === String(task.id)
            ? {
                ...item,
                completed: !item.completed,
              }
            : item
        )
      );
    } catch (error) {
      console.log('Complete task error:', error);

      Alert.alert(
        'Error',
        'Could not update the task status.'
      );
    }
  };

  // =========================
  // Status Colors
  // =========================

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done':
        return '#E9D8FF';

      case 'In Progress':
        return '#FFE4E4';

      case 'To-do':
        return '#E4F0FF';

      default:
        return '#F0F0F0';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Done':
        return '#6600FF';

      case 'In Progress':
        return '#E53E3E';

      case 'To-do':
        return '#3182CE';

      default:
        return '#000000';
    }
  };

  // =========================
  // Month / Day Names
  // =========================

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const dayNames = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];

  // =========================
  // UI
  // =========================

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          '#F0F9FF',
          '#E6F3FF',
          '#F0E6FF',
          '#FFF5F0',
        ]}
        locations={[0, 0.33, 0.66, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons
              name="keyboard-backspace"
              size={28}
              color="#1A202C"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Today's Tasks
          </Text>

          <TouchableOpacity>
            <MaterialIcons
              name="notifications"
              size={24}
              color="#1A202C"
            />
          </TouchableOpacity>
        </View>

        {/* ================= DATE ================= */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateScroll}
        >
          {weekDays.map((date, index) => {
            const isSelected = isSameDay(
              date,
              selectedDate
            );

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateCard,
                  isSelected &&
                    styles.dateCardSelected,
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text
                  style={[
                    styles.dateMonth,
                    isSelected &&
                      styles.dateMonthSelected,
                  ]}
                >
                  {monthNames[date.getMonth()]}
                </Text>

                <Text
                  style={[
                    styles.dateDay,
                    isSelected &&
                      styles.dateDaySelected,
                  ]}
                >
                  {date.getDate()}
                </Text>

                <Text
                  style={[
                    styles.dateWeekday,
                    isSelected &&
                      styles.dateWeekdaySelected,
                  ]}
                >
                  {dayNames[date.getDay()]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ================= FILTERS ================= */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {[
            'All',
            'To-do',
            'In Progress',
            'Done',
          ].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter &&
                  styles.filterButtonActive,
              ]}
              onPress={() =>
                setActiveFilter(filter)
              }
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === filter &&
                    styles.filterButtonTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ================= TASKS ================= */}

        <ScrollView
          contentContainerStyle={styles.tasksContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator
                size="large"
                color="#6600FF"
              />

              <Text style={styles.emptyText}>
                Loading tasks...
              </Text>
            </View>
          ) : filteredTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons
                name="event-busy"
                size={64}
                color="#A0AEC0"
              />

              <Text style={styles.emptyText}>
                No tasks for this day
              </Text>

              <Text style={styles.emptySubtext}>
                Add a task to get started
              </Text>
            </View>
          ) : (
            filteredTasks.map((task) => {
              const status = getTaskStatus(task);

              return (
                <View
                  key={task.id}
                  style={styles.taskCard}
                >
                  {/* ================= TASK HEADER ================= */}

                  <View style={styles.taskHeader}>
                    <Text style={styles.taskProject}>
                      {task.category_name ||
                        task.category ||
                        task.project ||
                        'Task'}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        handleToggleComplete(task)
                      }
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            getStatusColor(status),
                        },
                      ]}
                    >
                      <MaterialIcons
                        name={
                          status === 'Done'
                            ? 'check-circle'
                            : status === 'In Progress'
                            ? 'access-time'
                            : 'radio-button-unchecked'
                        }
                        size={16}
                        color={getStatusTextColor(
                          status
                        )}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* ================= TITLE ================= */}

                  <Text style={styles.taskTitle}>
                    {task.title}
                  </Text>

                  {/* ================= DESCRIPTION ================= */}

                  {task.description ? (
                    <Text
                      style={styles.taskDescription}
                      numberOfLines={2}
                    >
                      {task.description}
                    </Text>
                  ) : null}

                  {/* ================= PRIORITY ================= */}

                  {task.priority ? (
                    <Text
                      style={{
                        marginTop: 8,
                        fontSize: 12,
                        color:
                          task.priority
                            .toLowerCase() === 'high'
                            ? '#E53E3E'
                            : task.priority
                                .toLowerCase() ===
                              'medium'
                            ? '#D69E2E'
                            : '#3182CE',
                      }}
                    >
                      Priority: {task.priority}
                    </Text>
                  ) : null}

                  {/* ================= BUTTONS ================= */}

                  <View style={styles.taskButtons}>
                    <TouchableOpacity
                      style={[
                        styles.taskButton,
                        styles.editTaskButton,
                      ]}
                      onPress={() =>
                        handleEdit(task.id)
                      }
                      activeOpacity={0.8}
                    >
                      <Text
                        style={
                          styles.taskButtonText
                        }
                      >
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.taskButton,
                        styles.deleteTaskButton,
                      ]}
                      onPress={() =>
                        handleDeletePress(task.id)
                      }
                      activeOpacity={0.8}
                    >
                      <Text
                        style={
                          styles.taskButtonText
                        }
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* ================= DELETE MODAL ================= */}

        <Modal
          visible={showDeleteModal}
          transparent
          animationType="fade"
          onRequestClose={cancelDelete}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Are You Sure?
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.modalButtonYes,
                  ]}
                  onPress={confirmDelete}
                  activeOpacity={0.8}
                >
                  <Text
                    style={styles.modalButtonText}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.modalButtonNo,
                  ]}
                  onPress={cancelDelete}
                  activeOpacity={0.8}
                >
                  <Text
                    style={styles.modalButtonText}
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

export default TodayScreen;