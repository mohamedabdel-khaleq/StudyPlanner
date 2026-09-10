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

import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import {
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI,
} from '../services/taskService';

import styles from './styles';

const EditScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { tasks, updateTask: updateTaskLocal, deleteTask: deleteTaskLocal } =
    useTasks();

  const { token } = useAuth();

  const taskId = route.params?.taskId;

  const task = tasks.find(
    (t) => String(t.id) === String(taskId)
  );

  const [taskGroups, setTaskGroups] = useState([
    'Work',
    'Study',
    'Personal',
  ]);

  const [selectedGroup, setSelectedGroup] = useState(
    task?.project || 'Work'
  );

  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  const [projectName, setProjectName] = useState(
    task?.title || ''
  );

  const [description, setDescription] = useState(
    task?.description || ''
  );

  /*
   * Backend uses due_date.
   * We support due_date first, and date as fallback
   * in case the local TaskContext still uses date.
   */
  const taskDate = task?.due_date || task?.date;

  const getInitialDate = () => {
    if (taskDate) {
      const date = new Date(taskDate);

      if (!Number.isNaN(date.getTime())) {
        return {
          day: date.getUTCDate(),
          month: date.getUTCMonth() + 1,
          year: date.getUTCFullYear(),
        };
      }
    }

    const now = new Date();

    return {
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  };

  const getInitialEndDate = () => {
    if (task?.endDate) {
      const date = new Date(task.endDate);

      if (!Number.isNaN(date.getTime())) {
        return {
          day: date.getUTCDate(),
          month: date.getUTCMonth() + 1,
          year: date.getUTCFullYear(),
        };
      }
    }

    const now = new Date();
    now.setDate(now.getDate() + 1);

    return {
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  };

  const [startDate, setStartDate] = useState(getInitialDate);
  const [endDate, setEndDate] = useState(getInitialEndDate);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: 10 },
    (_, i) => currentYear + i
  );

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const startDays = useMemo(() => {
    return Array.from(
      {
        length: getDaysInMonth(
          startDate.year,
          startDate.month
        ),
      },
      (_, i) => i + 1
    );
  }, [startDate.year, startDate.month]);

  const endDays = useMemo(() => {
    return Array.from(
      {
        length: getDaysInMonth(
          endDate.year,
          endDate.month
        ),
      },
      (_, i) => i + 1
    );
  }, [endDate.year, endDate.month]);

  const formatDate = (date) => {
    return `${date.day} ${months[date.month - 1]}, ${date.year}`;
  };

  const formatDateToISO = (date) => {
    return `${date.year}-${String(date.month).padStart(
      2,
      '0'
    )}-${String(date.day).padStart(2, '0')}`;
  };

  const updateStartDay = (day, month, year) => {
    const maxDays = getDaysInMonth(year, month);

    const adjustedDay =
      day > maxDays ? maxDays : day;

    setStartDate({
      day: adjustedDay,
      month,
      year,
    });
  };

  const updateEndDay = (day, month, year) => {
    const maxDays = getDaysInMonth(year, month);

    const adjustedDay =
      day > maxDays ? maxDays : day;

    setEndDate({
      day: adjustedDay,
      month,
      year,
    });
  };

  const handleAddGroup = () => {
    const groupName = newGroupName.trim();

    if (!groupName) {
      Alert.alert(
        'Error',
        'Please enter a group name'
      );
      return;
    }

    if (taskGroups.includes(groupName)) {
      Alert.alert(
        'Error',
        'This group already exists!'
      );
      return;
    }

    setTaskGroups((prev) => [
      ...prev,
      groupName,
    ]);

    setSelectedGroup(groupName);
    setNewGroupName('');
    setShowAddGroupModal(false);

    Alert.alert(
      'Success',
      `Group "${groupName}" added!`
    );
  };

  /*
   * EDIT TASK
   *
   * Backend TaskUpdate supports:
   * title
   * description
   * due_date
   * priority
   * completed
   * category_id
   *
   * We DON'T send:
   * project
   * group
   * endDate
   *
   * because these are not part of TaskUpdate.
   */
  const handleEdit = async () => {
    if (
      taskId === undefined ||
      taskId === null
    ) {
      Alert.alert(
        'Error',
        'Task ID is missing.'
      );
      return;
    }

    if (!projectName.trim()) {
      Alert.alert(
        'Error',
        'Please enter a project name.'
      );
      return;
    }

    if (!token) {
      Alert.alert(
        'Error',
        'You are not logged in.'
      );
      return;
    }

    try {
      setIsSaving(true);

      const updatedTask = {
        title: projectName.trim(),
        description: description.trim(),
        due_date: formatDateToISO(startDate),
      };

      /*
       * Send priority only if the task already has it.
       */
      if (task?.priority !== undefined) {
        updatedTask.priority = task.priority;
      }

      /*
       * Send completed only if the task already has it.
       */
      if (task?.completed !== undefined) {
        updatedTask.completed = task.completed;
      }

      /*
       * Send category_id only when the task already
       * has a real category ID from the backend.
       */
      if (task?.category_id !== undefined && task?.category_id !== null) {
        updatedTask.category_id = task.category_id;
      }

      /*
       * 1. Update Backend
       */
      const updatedFromAPI = await updateTaskAPI(
        token,
        taskId,
        updatedTask
      );

      /*
       * 2. Update local TaskContext
       *
       * Keep your UI-specific fields too.
       */
      updateTaskLocal(taskId, {
        ...task,
        ...updatedFromAPI,
        ...updatedTask,

        // Keep compatibility with old local UI
        date: updatedTask.due_date,

        // UI-only
        project: selectedGroup,
        group: selectedGroup,

        // UI-only
        endDate: formatDateToISO(endDate),
      });

      Alert.alert(
        'Success',
        'Task updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log(
        'EDIT TASK ERROR:',
        error?.response?.data || error
      );

      const message =
        error?.response?.data?.detail ||
        'Failed to update task. Please try again.';

      Alert.alert(
        'Error',
        typeof message === 'string'
          ? message
          : 'Failed to update task.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  /*
   * DELETE TASK
   */
  const confirmDelete = async () => {
    if (
      taskId === undefined ||
      taskId === null
    ) {
      setShowDeleteModal(false);

      Alert.alert(
        'Error',
        'Task ID is missing.'
      );

      return;
    }

    if (!token) {
      setShowDeleteModal(false);

      Alert.alert(
        'Error',
        'You are not logged in.'
      );

      return;
    }

    try {
      setIsDeleting(true);

      /*
       * 1. Delete from Backend
       */
      await deleteTaskAPI(
        token,
        taskId
      );

      /*
       * 2. Delete from local context
       */
      deleteTaskLocal(taskId);

      setShowDeleteModal(false);

      Alert.alert(
        'Success',
        'Task deleted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log(
        'DELETE TASK ERROR:',
        error?.response?.data || error
      );

      const message =
        error?.response?.data?.detail ||
        'Failed to delete task. Please try again.';

      Alert.alert(
        'Error',
        typeof message === 'string'
          ? message
          : 'Failed to delete task.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!task) {
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
              Edit Project
            </Text>

            <TouchableOpacity>
              <MaterialIcons
                name="notifications"
                size={24}
                color="#1A202C"
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: '#718096',
              }}
            >
              Task not found
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

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
        {/* HEADER */}
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
            Edit Project
          </Text>

          <TouchableOpacity>
            <MaterialIcons
              name="notifications"
              size={24}
              color="#1A202C"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
        >
          {/* TASK GROUP */}
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              setShowGroupDropdown(true)
            }
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconWork}>
                <MaterialIcons
                  name="business"
                  size={22}
                  color="#ff6bd3"
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.label}>
                  Task Group
                </Text>

                <Text style={styles.value}>
                  {selectedGroup}
                </Text>
              </View>

              <MaterialIcons
                name="arrow-drop-down"
                size={28}
                color="#1A202C"
              />
            </View>
          </TouchableOpacity>

          {/* PROJECT NAME */}
          <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.label}>
                Project Name
              </Text>

              <TextInput
                style={styles.inputField}
                value={projectName}
                onChangeText={setProjectName}
                placeholder="Enter project name..."
                placeholderTextColor="#A0AEC0"
              />
            </View>
          </View>

          {/* DESCRIPTION */}
          <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.label}>
                Description
              </Text>

              <TextInput
                style={[
                  styles.descriptionValue,
                  styles.textArea,
                ]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                placeholder="Describe your task..."
                placeholderTextColor="#A0AEC0"
              />
            </View>
          </View>

          {/* START / DUE DATE */}
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              setShowStartPicker(true)
            }
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="event"
                  size={22}
                  color="#6600FF"
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.label}>
                  Start Date
                </Text>

                <Text style={styles.value}>
                  {formatDate(startDate)}
                </Text>
              </View>

              <MaterialIcons
                name="arrow-drop-down"
                size={28}
                color="#1A202C"
              />
            </View>
          </TouchableOpacity>

          {/* END DATE - UI ONLY */}
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              setShowEndPicker(true)
            }
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="event"
                  size={22}
                  color="#6600FF"
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.label}>
                  End Date
                </Text>

                <Text style={styles.value}>
                  {formatDate(endDate)}
                </Text>
              </View>

              <MaterialIcons
                name="arrow-drop-down"
                size={28}
                color="#1A202C"
              />
            </View>
          </TouchableOpacity>

          {/* BUTTONS */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.editButton,
                isSaving && { opacity: 0.6 },
              ]}
              onPress={handleEdit}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {isSaving ? 'Saving...' : 'Edit'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.deleteButton,
                isDeleting && { opacity: 0.6 },
              ]}
              onPress={handleDelete}
              disabled={isDeleting}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* GROUP DROPDOWN */}
        <Modal
          visible={showGroupDropdown}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setShowGroupDropdown(false)
          }
        >
          <TouchableOpacity
            style={styles.dropdownModalOverlay}
            activeOpacity={1}
            onPress={() =>
              setShowGroupDropdown(false)
            }
          >
            <View
              style={styles.dropdownModalContent}
            >
              {taskGroups.map((group) => (
                <TouchableOpacity
                  key={group}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedGroup(group);
                    setShowGroupDropdown(false);
                  }}
                >
                  <MaterialIcons
                    name={
                      group === selectedGroup
                        ? 'check-circle'
                        : 'circle'
                    }
                    size={20}
                    color={
                      group === selectedGroup
                        ? '#6600FF'
                        : '#A0AEC0'
                    }
                  />

                  <Text
                    style={
                      styles.dropdownOptionText
                    }
                  >
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.addGroupOption}
                onPress={() => {
                  setShowGroupDropdown(false);
                  setShowAddGroupModal(true);
                }}
              >
                <MaterialIcons
                  name="add-circle"
                  size={20}
                  color="#6600FF"
                />

                <Text
                  style={styles.addGroupText}
                >
                  Add Group
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* ADD GROUP */}
        <Modal
          visible={showAddGroupModal}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setShowAddGroupModal(false)
          }
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() =>
                  setShowAddGroupModal(false)
                }
              >
                <MaterialIcons
                  name="close"
                  size={20}
                  color="#1A202C"
                />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>
                Add New Group
              </Text>

              <TextInput
                style={styles.modalInput}
                value={newGroupName}
                onChangeText={setNewGroupName}
                placeholder="Enter group name..."
                placeholderTextColor="#A0AEC0"
              />

              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleAddGroup}
              >
                <Text
                  style={styles.modalButtonText}
                >
                  Add Group
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* DELETE CONFIRMATION */}
        <Modal
          visible={showDeleteModal}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setShowDeleteModal(false)
          }
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
                  disabled={isDeleting}
                  activeOpacity={0.8}
                >
                  <Text
                    style={styles.modalButtonText}
                  >
                    {isDeleting ? 'Deleting...' : 'Yes'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.modalButtonNo,
                  ]}
                  onPress={() =>
                    setShowDeleteModal(false)
                  }
                  disabled={isDeleting}
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

        {/* START DATE PICKER */}
        <Modal
          visible={showStartPicker}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setShowStartPicker(false)
          }
        >
          <View style={styles.datePickerOverlay}>
            <View
              style={styles.datePickerContainer}
            >
              <View style={styles.datePickerHeader}>
                <Text
                  style={styles.datePickerTitle}
                >
                  Select Start Date
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setShowStartPicker(false)
                  }
                >
                  <MaterialIcons
                    name="close"
                    size={24}
                    color="#1A202C"
                  />
                </TouchableOpacity>
              </View>

              <View
                style={styles.datePickerColumns}
              >
                {/* DAY */}
                <View
                  style={styles.datePickerColumn}
                >
                  <Text
                    style={
                      styles.datePickerColumnLabel
                    }
                  >
                    Day
                  </Text>

                  <ScrollView
                    style={styles.datePickerScroll}
                  >
                    {startDays.map((day) => (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.datePickerOption,
                          day === startDate.day &&
                            styles.datePickerOptionSelected,
                        ]}
                        onPress={() =>
                          updateStartDay(
                            day,
                            startDate.month,
                            startDate.year
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.datePickerOptionText,
                            day === startDate.day &&
                              styles.datePickerOptionTextSelected,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* MONTH */}
                <View
                  style={styles.datePickerColumn}
                >
                  <Text
                    style={
                      styles.datePickerColumnLabel
                    }
                  >
                    Month
                  </Text>

                  <ScrollView
                    style={styles.datePickerScroll}
                  >
                    {months.map(
                      (month, index) => (
                        <TouchableOpacity
                          key={month}
                          style={[
                            styles.datePickerOption,
                            index + 1 ===
                              startDate.month &&
                              styles.datePickerOptionSelected,
                          ]}
                          onPress={() =>
                            updateStartDay(
                              startDate.day,
                              index + 1,
                              startDate.year
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.datePickerOptionText,
                              index + 1 ===
                                startDate.month &&
                                styles.datePickerOptionTextSelected,
                            ]}
                          >
                            {month}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </ScrollView>
                </View>

                {/* YEAR */}
                <View
                  style={styles.datePickerColumn}
                >
                  <Text
                    style={
                      styles.datePickerColumnLabel
                    }
                  >
                    Year
                  </Text>

                  <ScrollView
                    style={styles.datePickerScroll}
                  >
                    {years.map((year) => (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.datePickerOption,
                          year === startDate.year &&
                            styles.datePickerOptionSelected,
                        ]}
                        onPress={() =>
                          updateStartDay(
                            startDate.day,
                            startDate.month,
                            year
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.datePickerOptionText,
                            year === startDate.year &&
                              styles.datePickerOptionTextSelected,
                          ]}
                        >
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <TouchableOpacity
                style={
                  styles.datePickerConfirmButton
                }
                onPress={() =>
                  setShowStartPicker(false)
                }
              >
                <Text
                  style={
                    styles.datePickerConfirmButtonText
                  }
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* END DATE PICKER */}
        <Modal
          visible={showEndPicker}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setShowEndPicker(false)
          }
        >
          <View style={styles.datePickerOverlay}>
            <View
              style={styles.datePickerContainer}
            >
              <View style={styles.datePickerHeader}>
                <Text
                  style={styles.datePickerTitle}
                >
                  Select End Date
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setShowEndPicker(false)
                  }
                >
                  <MaterialIcons
                    name="close"
                    size={24}
                    color="#1A202C"
                  />
                </TouchableOpacity>
              </View>

              <View
                style={styles.datePickerColumns}
              >
                {/* DAY */}
                <View
                  style={styles.datePickerColumn}
                >
                  <Text
                    style={
                      styles.datePickerColumnLabel
                    }
                  >
                    Day
                  </Text>

                  <ScrollView
                    style={styles.datePickerScroll}
                  >
                    {endDays.map((day) => (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.datePickerOption,
                          day === endDate.day &&
                            styles.datePickerOptionSelected,
                        ]}
                        onPress={() =>
                          updateEndDay(
                            day,
                            endDate.month,
                            endDate.year
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.datePickerOptionText,
                            day === endDate.day &&
                              styles.datePickerOptionTextSelected,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* MONTH */}
                <View
                  style={styles.datePickerColumn}
                >
                  <Text
                    style={
                      styles.datePickerColumnLabel
                    }
                  >
                    Month
                  </Text>

                  <ScrollView
                    style={styles.datePickerScroll}
                  >
                    {months.map(
                      (month, index) => (
                        <TouchableOpacity
                          key={month}
                          style={[
                            styles.datePickerOption,
                            index + 1 ===
                              endDate.month &&
                              styles.datePickerOptionSelected,
                          ]}
                          onPress={() =>
                            updateEndDay(
                              endDate.day,
                              index + 1,
                              endDate.year
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.datePickerOptionText,
                              index + 1 ===
                                endDate.month &&
                                styles.datePickerOptionTextSelected,
                            ]}
                          >
                            {month}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </ScrollView>
                </View>

                {/* YEAR */}
                <View
                  style={styles.datePickerColumn}
                >
                  <Text
                    style={
                      styles.datePickerColumnLabel
                    }
                  >
                    Year
                  </Text>

                  <ScrollView
                    style={styles.datePickerScroll}
                  >
                    {years.map((year) => (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.datePickerOption,
                          year === endDate.year &&
                            styles.datePickerOptionSelected,
                        ]}
                        onPress={() =>
                          updateEndDay(
                            endDate.day,
                            endDate.month,
                            year
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.datePickerOptionText,
                            year === endDate.year &&
                              styles.datePickerOptionTextSelected,
                          ]}
                        >
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <TouchableOpacity
                style={
                  styles.datePickerConfirmButton
                }
                onPress={() =>
                  setShowEndPicker(false)
                }
              >
                <Text
                  style={
                    styles.datePickerConfirmButtonText
                  }
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

export default EditScreen;