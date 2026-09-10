import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTasks } from '../../context/TaskContext';
import styles from './styles';

const EditScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { tasks, updateTask, deleteTask } = useTasks();
  const taskId = route.params?.taskId;
  
  const task = tasks.find((t) => t.id === taskId);

  const [taskGroups, setTaskGroups] = useState(['Work', 'Study', 'Personal']);
  const [selectedGroup, setSelectedGroup] = useState(task?.project || 'Work');
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  
  const [projectName, setProjectName] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  
  const [startDate, setStartDate] = useState({ 
    day: task ? new Date(task.date).getDate() : new Date().getDate(), 
    month: task ? new Date(task.date).getMonth() + 1 : new Date().getMonth() + 1, 
    year: task ? new Date(task.date).getFullYear() : new Date().getFullYear() 
  });
  const [endDate, setEndDate] = useState({ 
    day: task?.endDate ? new Date(task.endDate).getDate() : new Date().getDate() + 1, 
    month: task?.endDate ? new Date(task.endDate).getMonth() + 1 : new Date().getMonth() + 1, 
    year: task?.endDate ? new Date(task.endDate).getFullYear() : new Date().getFullYear() 
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

  const startDays = useMemo(() => {
    return Array.from({ length: getDaysInMonth(startDate.year, startDate.month) }, (_, i) => i + 1);
  }, [startDate.year, startDate.month]);

  const endDays = useMemo(() => {
    return Array.from({ length: getDaysInMonth(endDate.year, endDate.month) }, (_, i) => i + 1);
  }, [endDate.year, endDate.month]);

  const formatDate = (date: { day: number; month: number; year: number }): string => {
    return `${date.day} ${months[date.month - 1]}, ${date.year}`;
  };

  const formatDateToISO = (date: { day: number; month: number; year: number }): string => {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  };

  const updateStartDay = (day: number, month: number, year: number) => {
    const maxDays = getDaysInMonth(year, month);
    const adjustedDay = day > maxDays ? maxDays : day;
    setStartDate({ day: adjustedDay, month, year });
  };

  const updateEndDay = (day: number, month: number, year: number) => {
    const maxDays = getDaysInMonth(year, month);
    const adjustedDay = day > maxDays ? maxDays : day;
    setEndDate({ day: adjustedDay, month, year });
  };

  const handleAddGroup = (): void => {
    if (newGroupName.trim()) {
      if (taskGroups.includes(newGroupName.trim())) {
        Alert.alert('Error', 'This group already exists!');
        return;
      }
      setTaskGroups([...taskGroups, newGroupName.trim()]);
      setSelectedGroup(newGroupName.trim());
      setNewGroupName('');
      setShowAddGroupModal(false);
      Alert.alert('Success', `Group "${newGroupName.trim()}" added!`);
    } else {
      Alert.alert('Error', 'Please enter a group name');
    }
  };

  const handleEdit = (): void => {
    if (!taskId) return;
    
    const updatedTask = {
      project: selectedGroup,
      title: projectName,
      date: formatDateToISO(startDate),
      description,
      group: selectedGroup,
      endDate: formatDateToISO(endDate),
    };

    updateTask(taskId, updatedTask);
    Alert.alert('Success', 'Task updated successfully!');
    navigation.goBack();
  };

  const handleDelete = (): void => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (taskId) {
      deleteTask(taskId);
      Alert.alert('Success', 'Task deleted successfully!');
      navigation.goBack();
    }
    setShowDeleteModal(false);
  };

  if (!task) {
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
            <Text style={styles.headerTitle}>Edit Project</Text>
            <TouchableOpacity>
              <MaterialIcons name="notifications" size={24} color="#1A202C" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#718096' }}>Task not found</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Edit Project</Text>
          <TouchableOpacity>
            <MaterialIcons name="notifications" size={24} color="#1A202C" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.card} onPress={() => setShowGroupDropdown(true)} activeOpacity={0.7}>
            <View style={styles.cardContent}>
              <View style={styles.iconWork}>
                <MaterialIcons name="business" size={22} color="#ff6bd3" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Task Group</Text>
                <Text style={styles.value}>{selectedGroup}</Text>
              </View>
              <MaterialIcons name="arrow-drop-down" size={28} color="#1A202C" />
            </View>
          </TouchableOpacity>

          <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Project Name</Text>
              <TextInput style={styles.inputField} value={projectName} onChangeText={setProjectName} placeholder="Enter project name..." placeholderTextColor="#A0AEC0" />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput style={[styles.descriptionValue, styles.textArea]} value={description} onChangeText={setDescription} multiline numberOfLines={4} placeholder="Describe your task..." placeholderTextColor="#A0AEC0" />
            </View>
          </View>

          <TouchableOpacity style={styles.card} onPress={() => setShowStartPicker(true)} activeOpacity={0.7}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="event" size={22} color="#6600FF" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Start Date</Text>
                <Text style={styles.value}>{formatDate(startDate)}</Text>
              </View>
              <MaterialIcons name="arrow-drop-down" size={28} color="#1A202C" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => setShowEndPicker(true)} activeOpacity={0.7}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="event" size={22} color="#6600FF" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>End Date</Text>
                <Text style={styles.value}>{formatDate(endDate)}</Text>
              </View>
              <MaterialIcons name="arrow-drop-down" size={28} color="#1A202C" />
            </View>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal visible={showGroupDropdown} transparent animationType="fade" onRequestClose={() => setShowGroupDropdown(false)}>
          <TouchableOpacity style={styles.dropdownModalOverlay} activeOpacity={1} onPress={() => setShowGroupDropdown(false)}>
            <View style={styles.dropdownModalContent}>
              {taskGroups.map((group) => (
                <TouchableOpacity key={group} style={styles.dropdownOption} onPress={() => { setSelectedGroup(group); setShowGroupDropdown(false); }}>
                  <MaterialIcons name={group === selectedGroup ? 'check-circle' : 'circle'} size={20} color={group === selectedGroup ? '#6600FF' : '#A0AEC0'} />
                  <Text style={styles.dropdownOptionText}>{group}</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.divider} />
              <TouchableOpacity style={styles.addGroupOption} onPress={() => { setShowGroupDropdown(false); setShowAddGroupModal(true); }}>
                <MaterialIcons name="add-circle" size={20} color="#6600FF" />
                <Text style={styles.addGroupText}>Add Group</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal visible={showAddGroupModal} transparent animationType="fade" onRequestClose={() => setShowAddGroupModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowAddGroupModal(false)}>
                <MaterialIcons name="close" size={20} color="#1A202C" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add New Group</Text>
              <TextInput style={styles.modalInput} value={newGroupName} onChangeText={setNewGroupName} placeholder="Enter group name..." placeholderTextColor="#A0AEC0" />
              <TouchableOpacity style={styles.modalButton} onPress={handleAddGroup}>
                <Text style={styles.modalButtonText}>Add Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showDeleteModal} transparent animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Are You Sure?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonYes]} onPress={confirmDelete} activeOpacity={0.8}>
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonNo]} onPress={() => setShowDeleteModal(false)} activeOpacity={0.8}>
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showStartPicker} transparent animationType="fade" onRequestClose={() => setShowStartPicker(false)}>
          <View style={styles.datePickerOverlay}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <Text style={styles.datePickerTitle}>Select Start Date</Text>
                <TouchableOpacity onPress={() => setShowStartPicker(false)}>
                  <MaterialIcons name="close" size={24} color="#1A202C" />
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerColumns}>
                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerColumnLabel}>Day</Text>
                  <ScrollView style={styles.datePickerScroll}>
                    {startDays.map((day) => (
                      <TouchableOpacity key={day} style={[styles.datePickerOption, day === startDate.day && styles.datePickerOptionSelected]} onPress={() => updateStartDay(day, startDate.month, startDate.year)}>
                        <Text style={[styles.datePickerOptionText, day === startDate.day && styles.datePickerOptionTextSelected]}>{day}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerColumnLabel}>Month</Text>
                  <ScrollView style={styles.datePickerScroll}>
                    {months.map((month, index) => (
                      <TouchableOpacity key={month} style={[styles.datePickerOption, index + 1 === startDate.month && styles.datePickerOptionSelected]} onPress={() => updateStartDay(startDate.day, index + 1, startDate.year)}>
                        <Text style={[styles.datePickerOptionText, index + 1 === startDate.month && styles.datePickerOptionTextSelected]}>{month}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerColumnLabel}>Year</Text>
                  <ScrollView style={styles.datePickerScroll}>
                    {years.map((year) => (
                      <TouchableOpacity key={year} style={[styles.datePickerOption, year === startDate.year && styles.datePickerOptionSelected]} onPress={() => updateStartDay(startDate.day, startDate.month, year)}>
                        <Text style={[styles.datePickerOptionText, year === startDate.year && styles.datePickerOptionTextSelected]}>{year}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              <TouchableOpacity style={styles.datePickerConfirmButton} onPress={() => setShowStartPicker(false)}>
                <Text style={styles.datePickerConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showEndPicker} transparent animationType="fade" onRequestClose={() => setShowEndPicker(false)}>
          <View style={styles.datePickerOverlay}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <Text style={styles.datePickerTitle}>Select End Date</Text>
                <TouchableOpacity onPress={() => setShowEndPicker(false)}>
                  <MaterialIcons name="close" size={24} color="#1A202C" />
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerColumns}>
                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerColumnLabel}>Day</Text>
                  <ScrollView style={styles.datePickerScroll}>
                    {endDays.map((day) => (
                      <TouchableOpacity key={day} style={[styles.datePickerOption, day === endDate.day && styles.datePickerOptionSelected]} onPress={() => updateEndDay(day, endDate.month, endDate.year)}>
                        <Text style={[styles.datePickerOptionText, day === endDate.day && styles.datePickerOptionTextSelected]}>{day}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerColumnLabel}>Month</Text>
                  <ScrollView style={styles.datePickerScroll}>
                    {months.map((month, index) => (
                      <TouchableOpacity key={month} style={[styles.datePickerOption, index + 1 === endDate.month && styles.datePickerOptionSelected]} onPress={() => updateEndDay(endDate.day, index + 1, endDate.year)}>
                        <Text style={[styles.datePickerOptionText, index + 1 === endDate.month && styles.datePickerOptionTextSelected]}>{month}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerColumnLabel}>Year</Text>
                  <ScrollView style={styles.datePickerScroll}>
                    {years.map((year) => (
                      <TouchableOpacity key={year} style={[styles.datePickerOption, year === endDate.year && styles.datePickerOptionSelected]} onPress={() => updateEndDay(endDate.day, endDate.month, year)}>
                        <Text style={[styles.datePickerOptionText, year === endDate.year && styles.datePickerOptionTextSelected]}>{year}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              <TouchableOpacity style={styles.datePickerConfirmButton} onPress={() => setShowEndPicker(false)}>
                <Text style={styles.datePickerConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

export default EditScreen;