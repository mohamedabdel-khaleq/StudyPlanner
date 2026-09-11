import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import {
  getTaskById,
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI,
} from '../services/taskService';
import { getCategories } from '../services/categoryService';
import styles from './EditStyles';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log('EditScreen Error:', error);
    console.log('EditScreen Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 30,
            backgroundColor: '#F8F9FF',
          }}
        >
          <MaterialIcons name="error-outline" size={60} color="#EF4444" />
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#111827',
              marginTop: 15,
              textAlign: 'center',
            }}
          >
            Something went wrong
          </Text>
          <Text
            style={{
              marginTop: 10,
              color: '#6B7280',
              textAlign: 'center',
            }}
          >
            Please go back and try again.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}


const EditScreenContent = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { token } = useAuth();
  const { tasks = [] } = useTasks();

  // Route Data
  const taskId = route.params?.taskId;
  const passedTask = route.params?.task || null;

  // Find Task In Context
  const contextTask = useMemo(() => {
    if (!taskId || !Array.isArray(tasks)) {
      return null;
    }
    return tasks.find((item) => String(item.id) === String(taskId)) || null;
  }, [tasks, taskId]);

  // Task State
  const [apiTask, setApiTask] = useState(passedTask || contextTask || null);
  const [loadingTask, setLoadingTask] = useState(true);

  // Form State
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Date State
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Native Date Picker State
  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState('start'); // 'start' | 'end'

  // Action State
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const task = contextTask || apiTask || passedTask || null;

  // Load Task
  useEffect(() => {
    let mounted = true;

    const loadTask = async () => {
      if (contextTask) {
        if (mounted) {
          setApiTask(contextTask);
          setLoadingTask(false);
        }
        return;
      }

      if (passedTask) {
        if (mounted) {
          setApiTask(passedTask);
          setLoadingTask(false);
        }
        return;
      }

      if (!taskId || !token) {
        if (mounted) setLoadingTask(false);
        return;
      }

      try {
        const data = await getTaskById(token, taskId);
        if (mounted) setApiTask(data);
      } catch (error) {
        if (mounted) {
          Alert.alert('Error', 'Could not load this task.');
        }
      } finally {
        if (mounted) setLoadingTask(false);
      }
    };

    loadTask();

    return () => {
      mounted = false;
    };
  }, [taskId, token, contextTask, passedTask]);

  // Load Categories
  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      if (!token) {
        if (mounted) setLoadingCategories(false);
        return;
      }

      try {
        setLoadingCategories(true);
        const data = await getCategories(token);
        const categoriesArray = Array.isArray(data) ? data : [];
        if (mounted) setCategories(categoriesArray);
      } catch (error) {
        console.log('EditScreen Categories Error:', error);
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, [token]);

  // Initialize Form From Task
  useEffect(() => {
    if (!task) return;

    setProjectName(task.title || '');
    setDescription(task.description || '');

    if (task.priority) {
      const normalized = String(task.priority).toLowerCase();
      if (['low', 'medium', 'high'].includes(normalized)) {
        setPriority(normalized.charAt(0).toUpperCase() + normalized.slice(1));
      }
    }

    const taskDate = task.due_date || task.date;
    if (taskDate) {
      const parsedDate = new Date(taskDate);
      if (!Number.isNaN(parsedDate.getTime())) {
        const date = new Date(
          parsedDate.getUTCFullYear(),
          parsedDate.getUTCMonth(),
          parsedDate.getUTCDate()
        );
        setStartDate(date);
        setEndDate(date);
      }
    }
  }, [task]);

  // Select Category
  useEffect(() => {
    if (!task || !categories.length) return;

    if (task.category_id) {
      const categoryById = categories.find(
        (c) => String(c.id) === String(task.category_id)
      );
      if (categoryById) {
        setSelectedCategory(categoryById);
        return;
      }
    }

    if (task.category_name) {
      const categoryByName = categories.find(
        (c) => String(c.name).toLowerCase() === String(task.category_name).toLowerCase()
      );
      if (categoryByName) setSelectedCategory(categoryByName);
    }
  }, [task, categories]);

  // Date Helpers
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateToISO = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Date Picker Handler
  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      if (pickerType === 'start') {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const openDatePicker = (type) => {
    setPickerType(type);
    setShowPicker(true);
  };

  // Update Task
  const handleUpdate = async () => {
    const targetId = task?.id || taskId;

    if (!targetId) {
      Alert.alert('Error', 'Task ID was not found.');
      return;
    }

    const finalName = projectName.trim();
    if (!finalName) {
      Alert.alert('Missing Project Name', 'Please enter a project name.');
      return;
    }

    // شرط التحقق من التواريخ
    if (endDate < startDate) {
      Alert.alert('Date Error', 'End Date cannot be before Start Date.');
      return;
    }

    const updatedTask = {
      title: finalName,
      description: description.trim(),
      due_date: formatDateToISO(startDate),
      priority,
      completed: typeof task?.completed === 'boolean' ? task.completed : false,
    };

    if (selectedCategory?.id) {
      updatedTask.category_id = selectedCategory.id;
    } else if (task?.category_id) {
      updatedTask.category_id = task.category_id;
    }

    try {
      setSaving(true);
      await updateTaskAPI(token, targetId, updatedTask);
      Alert.alert('Success', 'Task updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const detail =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        'Could not update the task.';

      Alert.alert(
        'Error',
        Array.isArray(detail)
          ? detail.map((i) => i?.msg || '').join('\n')
          : String(detail)
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete Task
  const handleDelete = () => {
    const targetId = task?.id || taskId;

    if (!targetId) {
      Alert.alert('Error', 'Task ID was not found.');
      return;
    }

    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            await deleteTaskAPI(token, targetId);
            Alert.alert('Deleted', 'Task deleted successfully.', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          } catch (error) {
            Alert.alert('Error', 'Could not delete the task.');
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  if (loadingTask) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingTitle}>Loading task...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyScreen}>
          <MaterialIcons name="task" size={70} color="#A78BFA" />
          <Text style={styles.emptyTitle}>Task not found</Text>
          <Pressable onPress={() => navigation.goBack()} style={styles.backHomeButton}>
            <Text style={styles.backHomeButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#F8F9FF', '#FFFFFF']} style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#111827" />
            </Pressable>
            <Text style={styles.headerTitle}>Edit Project</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Task ID */}
          <View style={styles.taskIdContainer}>
            <MaterialIcons name="tag" size={18} color="#6C63FF" />
            <Text style={styles.taskIdText}>Task #{task.id}</Text>
          </View>

          {/* Project Name */}
          <Text style={styles.label}>Project Name</Text>
          <TextInput
            value={projectName}
            onChangeText={setProjectName}
            placeholder="Enter project name"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Enter project description"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={[styles.input, styles.descriptionInput]}
          />

          {/* Task Group */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>Task Group</Text>
            {loadingCategories && <ActivityIndicator size="small" color="#6C63FF" />}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {categories.map((category) => {
              const isSelected = selectedCategory?.id === category.id;
              return (
                <Pressable
                  key={category.id}
                  onPress={() => setSelectedCategory(category)}
                  style={[
                    styles.groupButton,
                    isSelected && styles.groupButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.groupButtonText,
                      isSelected && styles.groupButtonTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Start Date */}
          <Text style={styles.label}>Due Date</Text>
          <Pressable onPress={() => openDatePicker('start')} style={styles.dateInput}>
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
            <MaterialIcons name="calendar-today" size={20} color="#6B7280" />
          </Pressable>

          {/* End Date */}
          <Text style={styles.label}>End Date</Text>
          <Pressable onPress={() => openDatePicker('end')} style={styles.dateInput}>
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
            <MaterialIcons name="calendar-today" size={20} color="#6B7280" />
          </Pressable>

          {/* Priority */}
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityContainer}>
            {['Low', 'Medium', 'High'].map((item) => {
              const isSelected = priority === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setPriority(item)}
                  style={[
                    styles.priorityButton,
                    isSelected && styles.priorityButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      isSelected && styles.priorityButtonTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Status */}
          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <MaterialIcons
                name={task.completed ? 'check-circle' : 'pending-actions'}
                size={22}
                color={task.completed ? '#10B981' : '#F59E0B'}
              />
            </View>
            <View style={styles.statusContent}>
              <Text style={styles.statusLabel}>Status</Text>
              <Text style={styles.statusValue}>
                {task.completed ? 'Completed' : 'In Progress'}
              </Text>
            </View>
          </View>

          {/* Update Button */}
          <Pressable
            onPress={handleUpdate}
            disabled={saving || deleting}
            style={[styles.actionButtonWrapper, { opacity: saving || deleting ? 0.6 : 1 }]}
          >
            <LinearGradient
              colors={['#6C63FF', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.updateButton}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="save" size={22} color="#FFFFFF" />
                  <Text style={styles.updateButtonText}>Save Changes</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>

          {/* Delete Button */}
          <Pressable
            onPress={handleDelete}
            disabled={saving || deleting}
            style={[styles.deleteButton, { opacity: saving || deleting ? 0.6 : 1 }]}
          >
            {deleting ? (
              <ActivityIndicator color="#EF4444" />
            ) : (
              <>
                <MaterialIcons name="delete-outline" size={22} color="#EF4444" />
                <Text style={styles.deleteButtonText}>Delete Task</Text>
              </>
            )}
          </Pressable>
        </ScrollView>

        {/* Native Date Picker */}
        {showPicker && (
          <DateTimePicker
            value={pickerType === 'start' ? startDate : endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default function EditScreen() {
  return (
    <ErrorBoundary>
      <EditScreenContent />
    </ErrorBoundary>
  );
}