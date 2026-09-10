import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';

import {
  getTaskById,
  completeTask,
  undoTask,
  deleteTask,
} from '../services/taskService';

const TaskDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { token } = useAuth();

  const { taskId } = route.params || {};

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // =========================
  // Load Task Details
  // =========================
  const loadTask = async () => {
    if (!token || !taskId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getTaskById(token, taskId);

      setTask(data);
    } catch (error) {
      console.log('Get task details error:', error);

      Alert.alert(
        'Error',
        'Could not load task details.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [token, taskId]);

  // =========================
  // Complete / Undo
  // =========================
  const handleToggleComplete = async () => {
    if (!token || !task) return;

    try {
      setActionLoading(true);

      if (task.completed) {
        await undoTask(token, task.id);

        setTask((prev) => ({
          ...prev,
          completed: false,
        }));
      } else {
        await completeTask(token, task.id);

        setTask((prev) => ({
          ...prev,
          completed: true,
        }));
      }
    } catch (error) {
      console.log('Toggle task error:', error);

      Alert.alert(
        'Error',
        'Could not update task status.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // Delete Task
  // =========================
  const handleDelete = () => {
    if (!task) return;

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
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    if (!token || !task) return;

    try {
      setActionLoading(true);

      await deleteTask(token, task.id);

      Alert.alert(
        'Success',
        'Task deleted successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log('Delete task error:', error);

      Alert.alert(
        'Error',
        'Could not delete the task.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // Edit Task
  // =========================
  const handleEdit = () => {
    if (!task) return;

    navigation.navigate('EditTask', {
      taskId: task.id,
    });
  };

  // =========================
  // Format Date
  // =========================
  const formatDate = (dateString) => {
    if (!dateString) {
      return 'No due date';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // =========================
  // Priority Color
  // =========================
  const getPriorityColor = (priority) => {
    const value = String(priority || '').toLowerCase();

    if (value === 'high') {
      return '#E53E3E';
    }

    if (value === 'medium') {
      return '#D69E2E';
    }

    if (value === 'low') {
      return '#3182CE';
    }

    return '#718096';
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#6600FF"
        />

        <Text style={styles.loadingText}>
          Loading task...
        </Text>
      </View>
    );
  }

  // =========================
  // No Task
  // =========================
  if (!task) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons
          name="error-outline"
          size={60}
          color="#A0AEC0"
        />

        <Text style={styles.errorText}>
          Task not found
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const category =
    task.category_name ||
    task.category ||
    'No Category';

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
        style={styles.gradient}
      >

        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerIcon}
          >
            <MaterialIcons
              name="arrow-back"
              size={26}
              color="#1A202C"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Task Details
          </Text>

          <TouchableOpacity
            onPress={handleEdit}
            style={styles.headerIcon}
          >
            <MaterialIcons
              name="edit"
              size={23}
              color="#1A202C"
            />
          </TouchableOpacity>
        </View>

        {/* ================= CONTENT ================= */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >

          {/* Main Card */}

          <View style={styles.mainCard}>

            {/* Category */}

            <View style={styles.categoryRow}>
              <View style={styles.categoryIcon}>
                <MaterialIcons
                  name="folder"
                  size={20}
                  color="#6600FF"
                />
              </View>

              <Text style={styles.categoryText}>
                {category}
              </Text>
            </View>

            {/* Title */}

            <Text style={styles.title}>
              {task.title || 'Untitled Task'}
            </Text>

            {/* Description */}

            <Text style={styles.sectionTitle}>
              Description
            </Text>

            <Text style={styles.description}>
              {task.description?.trim()
                ? task.description
                : 'No description provided.'}
            </Text>

            {/* Divider */}

            <View style={styles.divider} />

            {/* Due Date */}

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialIcons
                  name="calendar-today"
                  size={20}
                  color="#6600FF"
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  Due Date
                </Text>

                <Text style={styles.infoValue}>
                  {formatDate(task.due_date)}
                </Text>
              </View>
            </View>

            {/* Priority */}

            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIcon,
                  {
                    backgroundColor:
                      `${getPriorityColor(task.priority)}20`,
                  },
                ]}
              >
                <MaterialIcons
                  name="flag"
                  size={20}
                  color={getPriorityColor(task.priority)}
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  Priority
                </Text>

                <Text
                  style={[
                    styles.infoValue,
                    {
                      color: getPriorityColor(
                        task.priority
                      ),
                    },
                  ]}
                >
                  {task.priority || 'Not specified'}
                </Text>
              </View>
            </View>

            {/* Status */}

            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIcon,
                  {
                    backgroundColor: task.completed
                      ? '#E9D8FF'
                      : '#E4F0FF',
                  },
                ]}
              >
                <MaterialIcons
                  name={
                    task.completed
                      ? 'check-circle'
                      : 'radio-button-unchecked'
                  }
                  size={20}
                  color={
                    task.completed
                      ? '#6600FF'
                      : '#3182CE'
                  }
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  Status
                </Text>

                <Text
                  style={[
                    styles.infoValue,
                    {
                      color: task.completed
                        ? '#6600FF'
                        : '#3182CE',
                    },
                  ]}
                >
                  {task.completed
                    ? 'Completed'
                    : 'To-do'}
                </Text>
              </View>
            </View>

          </View>

          {/* ================= ACTIONS ================= */}

          <View style={styles.actionsCard}>

            <TouchableOpacity
              style={[
                styles.completeButton,
                task.completed &&
                  styles.undoButton,
              ]}
              onPress={handleToggleComplete}
              disabled={actionLoading}
              activeOpacity={0.8}
            >
              {actionLoading ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <MaterialIcons
                    name={
                      task.completed
                        ? 'undo'
                        : 'check'
                    }
                    size={20}
                    color="#FFFFFF"
                  />

                  <Text
                    style={styles.actionButtonText}
                  >
                    {task.completed
                      ? 'Mark as To-do'
                      : 'Mark as Completed'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEdit}
              disabled={actionLoading}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="edit"
                size={20}
                color="#FFFFFF"
              />

              <Text
                style={styles.actionButtonText}
              >
                Edit Task
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={actionLoading}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="delete-outline"
                size={20}
                color="#FFFFFF"
              />

              <Text
                style={styles.actionButtonText}
              >
                Delete Task
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },

  gradient: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#718096',
  },

  errorText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
  },

  backButton: {
    marginTop: 20,
    backgroundColor: '#6600FF',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 18,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  categoryIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#F0E6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#718096',
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#1A202C',
    lineHeight: 32,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 22,
  },

  divider: {
    height: 1,
    backgroundColor: '#EDF2F7',
    marginVertical: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F0E6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: '#A0AEC0',
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A202C',
  },

  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  completeButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6600FF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },

  undoButton: {
    backgroundColor: '#3182CE',
  },

  editButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#4A5568',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },

  deleteButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
};

export default TaskDetailsScreen;