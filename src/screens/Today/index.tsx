import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { TaskStatus, useTasks } from '../../context/TaskContext';
import styles from './styles';

type FilterType = 'All' | 'To-do' | 'In Progress' | 'Done';

const TodayScreen = () => {
  const navigation = useNavigation<any>();
  const { tasks, deleteTask } = useTasks();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  function formatDateToISO(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, [selectedDate]);

  const filteredTasks = useMemo(() => {
    const selectedDateISO = formatDateToISO(selectedDate);
    
    return tasks.filter((task) => {
      if (task.date !== selectedDateISO) return false;
      if (activeFilter === 'All') return true;
      return task.status === activeFilter;
    });
  }, [tasks, activeFilter, selectedDate]);

  const handleEdit = (taskId: number) => {
    navigation.navigate('Edit', { taskId });
  };

  const handleDeletePress = (taskId: number) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (taskToDelete !== null) {
      deleteTask(taskToDelete);
    }
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Done': return '#E9D8FF';
      case 'In Progress': return '#FFE4E4';
      case 'To-do': return '#E4F0FF';
      default: return '#F0F0F0';
    }
  };

  const getStatusTextColor = (status: TaskStatus) => {
    switch (status) {
      case 'Done': return '#6600FF';
      case 'In Progress': return '#E53E3E';
      case 'To-do': return '#3182CE';
      default: return '#000000';
    }
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F0F9FF', '#E6F3FF', '#F0E6FF', '#FFF5F0']}
        locations={[0, 0.33, 0.66, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="keyboard-backspace" size={28} color="#1A202C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Today's Tasks</Text>
          <TouchableOpacity>
            <MaterialIcons name="notifications" size={24} color="#1A202C" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateScroll}
        >
          {weekDays.map((date, index) => {
            const isSelected = isSameDay(date, selectedDate);
            
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dateMonth, isSelected && styles.dateMonthSelected]}>
                  {monthNames[date.getMonth()]}
                </Text>
                <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>
                  {date.getDate()}
                </Text>
                <Text style={[styles.dateWeekday, isSelected && styles.dateWeekdaySelected]}>
                  {dayNames[date.getDay()]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {(['All', 'To-do', 'In Progress', 'Done'] as FilterType[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, activeFilter === filter && styles.filterButtonActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterButtonText, activeFilter === filter && styles.filterButtonTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          contentContainerStyle={styles.tasksContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="event-busy" size={64} color="#A0AEC0" />
              <Text style={styles.emptyText}>No tasks for this day</Text>
              <Text style={styles.emptySubtext}>Add a task to get started</Text>
            </View>
          ) : (
            filteredTasks.map((task) => (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskProject}>{task.project}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                    <MaterialIcons
                      name={task.status === 'Done' ? 'check-circle' : task.status === 'In Progress' ? 'access-time' : 'radio-button-unchecked'}
                      size={16}
                      color={getStatusTextColor(task.status)}
                    />
                  </View>
                </View>

                <Text style={styles.taskTitle}>{task.title}</Text>

                {task.description && (
                  <Text style={styles.taskDescription} numberOfLines={2}>
                    {task.description}
                  </Text>
                )}

                <View style={styles.taskButtons}>
                  <TouchableOpacity
                    style={[styles.taskButton, styles.editTaskButton]}
                    onPress={() => handleEdit(task.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.taskButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.taskButton, styles.deleteTaskButton]}
                    onPress={() => handleDeletePress(task.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.taskButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <Modal
          visible={showDeleteModal}
          transparent
          animationType="fade"
          onRequestClose={cancelDelete}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Are You Sure?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonYes]}
                  onPress={confirmDelete}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonNo]}
                  onPress={cancelDelete}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonText}>No</Text>
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