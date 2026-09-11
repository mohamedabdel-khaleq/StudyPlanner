import React, { useCallback, useMemo, useState } from 'react';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import {
  getTasks,
  deleteTask as deleteTaskAPI,
} from '../services/taskService';

const TodayScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);


  // Date Helpers
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

  // Load Tasks
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
      Alert.alert('Error', 'Could not load your tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [token])
  );

  // Week Days Slider
  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = -2; i <= 2; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, []);


  // Filter Tasks
  const filteredTasks = useMemo(() => {
    const selectedDateISO = formatDateToISO(selectedDate);
    return tasks.filter((task) => {
      const taskDate = task.due_date || task.date;
      if (!taskDate) return true; 
      if (taskDate.split('T')[0] !== selectedDateISO) return false;
      if (activeFilter === 'All') return true;
      if (activeFilter === 'To do') return !task.completed;
      if (activeFilter === 'In Progress') return !task.completed;
      if (activeFilter === 'Completed') return task.completed;
      return true;
    });
  }, [tasks, activeFilter, selectedDate]);

  // Actions
  const handleEdit = (taskId) => {
    navigation.navigate('EditTask', { taskId });
  };

  const handleDeletePress = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete === null || !token) {
      setShowDeleteModal(false);
      return;
    }

    try {
      await deleteTaskAPI(token, taskToDelete);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => String(task.id) !== String(taskToDelete))
      );
    } catch (error) {
      console.log('Delete task error:', error);
      Alert.alert('Error', 'Could not delete the task.');
    } finally {
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const monthNames = ['May', 'May', 'May', 'May', 'May'];
  const dayNames = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="keyboard-backspace" size={24} color="#1A202C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Today's Tasks</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={18} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        <View style={styles.dateContainer}>
          {weekDays.map((date, index) => {
            const isSelected = isSameDay(date, selectedDate);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateCard,
                  isSelected && styles.dateCardSelected,
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dateMonth, isSelected && styles.dateTextSelected]}>
                  {monthNames[index]}
                </Text>
                <Text style={[styles.dateDay, isSelected && styles.dateTextSelected]}>
                  {23 + index}
                </Text>
                <Text style={[styles.dateWeekday, isSelected && styles.dateTextSelected]}>
                  {dayNames[index]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {['All', 'To do', 'In Progress', 'Completed'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === filter && styles.filterButtonTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          contentContainerStyle={styles.tasksContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#5B2DE8" />
              <Text style={styles.emptyText}>Loading tasks...</Text>
            </View>
          ) : (
            <>
              <View style={styles.taskCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.taskProject}>Grocery Shopping app design</Text>
                  <View style={styles.badgeIcon}>
                    <Feather name="bookmark" size={14} color="#FF7A8A" />
                  </View>
                </View>
                <Text style={styles.taskTitle}>Market Research</Text>
                <View style={styles.timeRow}>
                  <Feather name="clock" size={12} color="#8A8A8A" />
                  <Text style={styles.timeText}>02:00 AM</Text>
                </View>

                <View style={styles.taskButtons}>
                  <TouchableOpacity
                    style={[styles.taskButton, styles.editTaskButton]}
                    onPress={() => handleEdit('1')}
                  >
                    <Text style={styles.taskButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.taskButton, styles.deleteTaskButton]}
                    onPress={() => handleDeletePress('1')}
                  >
                    <Text style={styles.taskButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.taskCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.taskProject}>Grocery Shopping app design</Text>
                  <View style={styles.badgeIcon}>
                    <Feather name="bookmark" size={14} color="#FF7A8A" />
                  </View>
                </View>
                <Text style={styles.taskTitle}>Competitive Analysis</Text>
                <View style={styles.timeRow}>
                  <Feather name="clock" size={12} color="#8A8A8A" />
                  <Text style={styles.timeText}>12:00 PM</Text>
                </View>

                <View style={styles.taskButtons}>
                  <TouchableOpacity style={[styles.taskButton, styles.editTaskButton]}>
                    <Text style={styles.taskButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.taskButton, styles.deleteTaskButton]}>
                    <Text style={styles.taskButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.taskCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.taskProject}>Uber Eats redesign challenge</Text>
                  <View style={styles.badgeIcon}>
                    <Feather name="bookmark" size={14} color="#8B5CF6" />
                  </View>
                </View>
                <Text style={styles.taskTitle}>Create Low-fidelity Wireframe</Text>
                <View style={styles.timeRow}>
                  <Feather name="clock" size={12} color="#8A8A8A" />
                  <Text style={styles.timeText}>07:00 PM</Text>
                </View>

                <View style={styles.taskButtons}>
                  <TouchableOpacity style={[styles.taskButton, styles.editTaskButton]}>
                    <Text style={styles.taskButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.taskButton, styles.deleteTaskButton]}>
                    <Text style={styles.taskButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.bottomNavContainer}>
          <View style={styles.bottomNav}>
            <Pressable style={styles.navItem} onPress={() => navigation.navigate('Home')}>
              <Ionicons name="home-outline" size={22} color="#A0A0A0" />
            </Pressable>

            <Pressable style={styles.navItem}>
              <Feather name="calendar" size={22} color="#5B2DE8" />
            </Pressable>

            <View style={{ width: 40 }} />
            <Pressable style={styles.navItem}>
              <Feather name="grid" size={22} color="#A0A0A0" />
            </Pressable>

            <Pressable style={styles.navItem}>
              <Feather name="settings" size={22} color="#A0A0A0" />
            </Pressable>
          </View>

          <Pressable style={styles.fabButton} onPress={() => navigation.navigate('AddProject')}>
            <Feather name="plus" size={28} color="#FFFFFF" />
          </Pressable>
        </View>

        <Modal
          visible={showDeleteModal}
          transparent
          animationType="fade"
          onRequestClose={cancelDelete}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Are You Sure ?</Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonYes]}
                  onPress={confirmDelete}
                >
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonNo]}
                  onPress={cancelDelete}
                >
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default TodayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justify: 'center',
  },

  // DATE SLIDER
  dateContainer: {
    flexDirection: 'row',
    justify: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateCard: {
    width: 54,
    height: 70,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justify: 'center',
  },
  dateCardSelected: {
    backgroundColor: '#5B2DE8',
  },
  dateMonth: {
    fontSize: 10,
    color: '#8A8A8A',
  },
  dateDay: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F1F1F',
    marginVertical: 2,
  },
  dateWeekday: {
    fontSize: 10,
    color: '#8A8A8A',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },

  // FILTERS
  filterScroll: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#5B2DE8',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#8A8A8A',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },

  // TASKS LIST
  tasksContainer: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  taskProject: {
    fontSize: 11,
    color: '#A0A0A0',
  },
  badgeIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#FFF0F2',
    alignItems: 'center',
    justify: 'center',
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  timeText: {
    fontSize: 11,
    color: '#8A8A8A',
    marginLeft: 4,
  },
  taskButtons: {
    flexDirection: 'row',
    justify: 'space-between',
  },
  taskButton: {
    flex: 0.48,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justify: 'center',
  },
  editTaskButton: {
    backgroundColor: '#5B2DE8',
  },
  deleteTaskButton: {
    backgroundColor: '#D32F2F',
  },
  taskButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  bottomNavContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bottomNav: {
    width: '100%',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flexDirection: 'row',
    justify: 'space-around',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  navItem: {
    alignItems: 'center',
    justify: 'center',
  },
  fabButton: {
    position: 'absolute',
    top: -22,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B2DE8',
    alignItems: 'center',
    justify: 'center',
    elevation: 8,
    shadowColor: '#5B2DE8',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justify: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justify: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 0.47,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justify: 'center',
  },
  modalButtonYes: {
    backgroundColor: '#D32F2F',
  },
  modalButtonNo: {
    backgroundColor: '#5B2DE8',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    marginTop: 10,
    color: '#8A8A8A',
  },
});