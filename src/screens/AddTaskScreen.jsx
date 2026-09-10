import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '../context/AuthContext';
import { createTask } from '../services/taskService';

const AddTaskScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();

  const [taskGroups, setTaskGroups] = useState([
    'Work',
    'Study',
    'Personal',
  ]);

  const [selectedGroup, setSelectedGroup] = useState('Work');
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');

  const [startDate, setStartDate] = useState(new Date());

  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  );

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [saving, setSaving] = useState(false);

  // =========================
  // MONTHS
  // =========================

  const months = useMemo(
    () => [
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
    ],
    []
  );

  // =========================
  // YEARS
  // =========================

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return Array.from(
      { length: 10 },
      (_, index) => currentYear + index
    );
  }, []);

  // =========================
  // START DATE DAYS
  // =========================

  const startDays = useMemo(() => {
    const daysInMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    ).getDate();

    return Array.from(
      { length: daysInMonth },
      (_, index) => index + 1
    );
  }, [startDate]);

  // =========================
  // END DATE DAYS
  // =========================

  const endDays = useMemo(() => {
    const daysInMonth = new Date(
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      0
    ).getDate();

    return Array.from(
      { length: daysInMonth },
      (_, index) => index + 1
    );
  }, [endDate]);

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // =========================
  // FORMAT DATE FOR API
  // =========================

  const formatDateToISO = (date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // =========================
  // ADD GROUP
  // =========================

  const handleAddGroup = () => {
    const groupName = newGroupName.trim();

    if (!groupName) {
      Alert.alert(
        'Error',
        'Please enter a group name.'
      );
      return;
    }

    const alreadyExists = taskGroups.some(
      (group) =>
        group.toLowerCase() ===
        groupName.toLowerCase()
    );

    if (alreadyExists) {
      Alert.alert(
        'Error',
        'This group already exists.'
      );
      return;
    }

    setTaskGroups((currentGroups) => [
      ...currentGroups,
      groupName,
    ]);

    setSelectedGroup(groupName);
    setNewGroupName('');
    setShowAddGroupModal(false);
    setShowGroupDropdown(false);
  };

  // =========================
  // ADD PROJECT
  // =========================

  const handleAddProject = async () => {
    if (!token) {
      Alert.alert(
        'Error',
        'You are not logged in.'
      );
      return;
    }

    const finalName = projectName.trim();

    if (!finalName) {
      Alert.alert(
        'Required',
        'Please enter a project name.'
      );
      return;
    }

    if (endDate < startDate) {
      Alert.alert(
        'Invalid Date',
        'End date cannot be earlier than start date.'
      );
      return;
    }

    try {
      setSaving(true);

      // Backend TaskCreate currently supports:
      // title
      // description
      // due_date

      const taskData = {
        title: finalName,
        description: description.trim(),
        due_date: formatDateToISO(startDate),
      };

      console.log(
        'Creating task:',
        taskData
      );

      const createdTask = await createTask(
        token,
        taskData
      );

      console.log(
        'Created task:',
        createdTask
      );

      Alert.alert(
        'Success',
        'Project has been added successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log(
        'Create task error:',
        error
      );

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        'Could not add the project. Please try again.';

      Alert.alert(
        'Error',
        String(message)
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CHANGE START DATE
  // =========================

  const changeStartDate = (type, value) => {
    const newDate = new Date(startDate);

    if (type === 'month') {
      newDate.setMonth(value);
    }

    if (type === 'year') {
      newDate.setFullYear(value);
    }

    if (type === 'day') {
      newDate.setDate(value);
    }

    setStartDate(newDate);
  };

  // =========================
  // CHANGE END DATE
  // =========================

  const changeEndDate = (type, value) => {
    const newDate = new Date(endDate);

    if (type === 'month') {
      newDate.setMonth(value);
    }

    if (type === 'year') {
      newDate.setFullYear(value);
    }

    if (type === 'day') {
      newDate.setDate(value);
    }

    setEndDate(newDate);
  };

  // =========================
  // UI
  // =========================

  return (
    <LinearGradient
      colors={[
        '#F8F5FF',
        '#FFFFFF',
      ]}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>

        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            <MaterialIcons
              name="arrow-back"
              size={28}
              color="#1A202C"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Add Project
          </Text>

          <View style={{ width: 28 }} />
        </View>

        {/* ================= CONTENT ================= */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.scrollContent
          }
        >

          {/* ================= TASK GROUP ================= */}

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              setShowGroupDropdown(true)
            }
            disabled={saving}
          >
            <View style={styles.cardContent}>

              <View style={styles.iconWork}>
                <MaterialIcons
                  name="work-outline"
                  size={23}
                  color="#6600FF"
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
                name="keyboard-arrow-down"
                size={24}
                color="#718096"
              />

            </View>
          </TouchableOpacity>

          {/* ================= PROJECT NAME ================= */}

          <View style={styles.card}>
            <View style={styles.cardContent}>

              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="assignment"
                  size={23}
                  color="#6600FF"
                />
              </View>

              <View style={styles.textContainer}>

                <Text style={styles.label}>
                  Project Name
                </Text>

                <TextInput
                  value={projectName}
                  onChangeText={setProjectName}
                  placeholder="Enter project name"
                  placeholderTextColor="#A0AEC0"
                  style={styles.inputField}
                  editable={!saving}
                />

              </View>

            </View>
          </View>

          {/* ================= DESCRIPTION ================= */}

          <View style={styles.card}>
            <View style={styles.cardContent}>

              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="description"
                  size={23}
                  color="#6600FF"
                />
              </View>

              <View style={styles.textContainer}>

                <Text style={styles.label}>
                  Description
                </Text>

                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter description"
                  placeholderTextColor="#A0AEC0"
                  multiline
                  style={[
                    styles.inputField,
                    styles.textArea,
                  ]}
                  editable={!saving}
                />

              </View>

            </View>
          </View>

          {/* ================= START DATE ================= */}

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              setShowStartDatePicker(true)
            }
            disabled={saving}
          >
            <View style={styles.cardContent}>

              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="calendar-today"
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
                name="keyboard-arrow-right"
                size={24}
                color="#718096"
              />

            </View>
          </TouchableOpacity>

          {/* ================= END DATE ================= */}

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              setShowEndDatePicker(true)
            }
            disabled={saving}
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
                name="keyboard-arrow-right"
                size={24}
                color="#718096"
              />

            </View>
          </TouchableOpacity>

          {/* ================= INFO ================= */}

          <View
            style={[
              styles.card,
              styles.statusCard,
            ]}
          >
            <View style={styles.cardContent}>

              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="info-outline"
                  size={22}
                  color="#6600FF"
                />
              </View>

              <View style={styles.textContainer}>

                <Text style={styles.label}>
                  Task Group
                </Text>

                <Text
                  style={styles.descriptionValue}
                >
                  {selectedGroup}
                </Text>

              </View>

            </View>
          </View>

          {/* ================= ADD BUTTON ================= */}

          <TouchableOpacity
            style={[
              styles.addButton,
              saving &&
                styles.addButtonDisabled,
            ]}
            onPress={handleAddProject}
            activeOpacity={0.8}
            disabled={saving}
          >
            {saving ? (
              <View
                style={styles.loadingContainer}
              >
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

                <Text
                  style={styles.addButtonText}
                >
                  Adding...
                </Text>
              </View>
            ) : (
              <Text
                style={styles.addButtonText}
              >
                Add Project
              </Text>
            )}
          </TouchableOpacity>

        </ScrollView>

        {/* ================================================= */}
        {/* GROUP DROPDOWN MODAL */}
        {/* ================================================= */}

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
              onStartShouldSetResponder={() => true}
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
                      group === 'Work'
                        ? 'work-outline'
                        : group === 'Study'
                        ? 'school'
                        : 'person-outline'
                    }
                    size={22}
                    color="#6600FF"
                  />

                  <Text
                    style={
                      styles.dropdownOptionText
                    }
                  >
                    {group}
                  </Text>

                  {selectedGroup === group && (
                    <MaterialIcons
                      name="check"
                      size={22}
                      color="#6600FF"
                      style={{
                        marginLeft: 'auto',
                      }}
                    />
                  )}

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
                  name="add"
                  size={22}
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

        {/* ================================================= */}
        {/* ADD GROUP MODAL */}
        {/* ================================================= */}

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
                onPress={() => {
                  setShowAddGroupModal(false);
                  setNewGroupName('');
                }}
              >
                <MaterialIcons
                  name="close"
                  size={20}
                  color="#718096"
                />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>
                Add New Group
              </Text>

              <TextInput
                value={newGroupName}
                onChangeText={setNewGroupName}
                placeholder="Group name"
                placeholderTextColor="#A0AEC0"
                style={styles.modalInput}
                autoFocus
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

        {/* ================================================= */}
        {/* START DATE MODAL */}
        {/* ================================================= */}

        <Modal
          visible={showStartDatePicker}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setShowStartDatePicker(false)
          }
        >
          <View
            style={styles.datePickerOverlay}
          >
            <View
              style={styles.datePickerContainer}
            >

              <View
                style={styles.datePickerHeader}
              >

                <Text
                  style={styles.datePickerTitle}
                >
                  Start Date
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setShowStartDatePicker(false)
                  }
                >
                  <MaterialIcons
                    name="close"
                    size={24}
                    color="#718096"
                  />
                </TouchableOpacity>

              </View>

              <View
                style={styles.datePickerColumns}
              >

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
                    style={
                      styles.datePickerScroll
                    }
                    showsVerticalScrollIndicator={
                      false
                    }
                  >
                    {months.map(
                      (month, index) => (
                        <TouchableOpacity
                          key={month}
                          style={[
                            styles.datePickerOption,
                            startDate.getMonth() ===
                              index &&
                              styles.datePickerOptionSelected,
                          ]}
                          onPress={() =>
                            changeStartDate(
                              'month',
                              index
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.datePickerOptionText,
                              startDate.getMonth() ===
                                index &&
                                styles.datePickerOptionTextSelected,
                            ]}
                          >
                            {month.substring(0, 3)}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </ScrollView>
                </View>

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
                    style={
                      styles.datePickerScroll
                    }
                    showsVerticalScrollIndicator={
                      false
                    }
                  >
                    {startDays.map((day) => (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.datePickerOption,
                          startDate.getDate() ===
                            day &&
                            styles.datePickerOptionSelected,
                        ]}
                        onPress={() =>
                          changeStartDate(
                            'day',
                            day
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.datePickerOptionText,
                            startDate.getDate() ===
                              day &&
                              styles.datePickerOptionTextSelected,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
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
                    style={
                      styles.datePickerScroll
                    }
                    showsVerticalScrollIndicator={
                      false
                    }
                  >
                    {years.map((year) => (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.datePickerOption,
                          startDate.getFullYear() ===
                            year &&
                            styles.datePickerOptionSelected,
                        ]}
                        onPress={() =>
                          changeStartDate(
                            'year',
                            year
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.datePickerOptionText,
                            startDate.getFullYear() ===
                              year &&
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
                  setShowStartDatePicker(false)
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

        {/* ================================================= */}
        {/* END DATE MODAL */}
        {/* ================================================= */}

        <Modal
          visible={showEndDatePicker}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setShowEndDatePicker(false)
          }
        >
          <View
            style={styles.datePickerOverlay}
          >
            <View
              style={styles.datePickerContainer}
            >

              <View
                style={styles.datePickerHeader}
              >

                <Text
                  style={styles.datePickerTitle}
                >
                  End Date
                </Text>

                {/* CLOSE BUTTON */}

                <TouchableOpacity
                  onPress={() =>
                    setShowEndDatePicker(false)
                  }
                >
                  <MaterialIcons
                    name="close"
                    size={24}
                    color="#718096"
                  />
                </TouchableOpacity>

              </View>

              <View
                style={styles.datePickerColumns}
              >

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
                    style={
                      styles.datePickerScroll
                    }
                    showsVerticalScrollIndicator={
                      false
                    }
                  >
                    {months.map(
                      (month, index) => (
                        <TouchableOpacity
                          key={month}
                          style={[
                            styles.datePickerOption,
                            endDate.getMonth() ===
                              index &&
                              styles.datePickerOptionSelected,
                          ]}
                          onPress={() =>
                            changeEndDate(
                              'month',
                              index
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.datePickerOptionText,
                              endDate.getMonth() ===
                                index &&
                                styles.datePickerOptionTextSelected,
                            ]}
                          >
                            {month.substring(0, 3)}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </ScrollView>
                </View>

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
                    style={
                      styles.datePickerScroll
                    }
                    showsVerticalScrollIndicator={
                      false
                    }
                  >
                    {endDays.map((day) => (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.datePickerOption,
                          endDate.getDate() ===
                            day &&
                            styles.datePickerOptionSelected,
                        ]}
                        onPress={() =>
                          changeEndDate(
                            'day',
                            day
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.datePickerOptionText,
                            endDate.getDate() ===
                              day &&
                              styles.datePickerOptionTextSelected,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
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
                    style={
                      styles.datePickerScroll
                    }
                    showsVerticalScrollIndicator={
                      false
                    }
                  >
                    {years.map((year) => (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.datePickerOption,
                          endDate.getFullYear() ===
                            year &&
                            styles.datePickerOptionSelected,
                        ]}
                        onPress={() =>
                          changeEndDate(
                            'year',
                            year
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.datePickerOptionText,
                            endDate.getFullYear() ===
                              year &&
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
                  setShowEndDatePicker(false)
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

      </View>
    </LinearGradient>
  );
};

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  gradientContainer: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A202C',
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWork: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fedcf9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E9D8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#718096',
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
  },

  inputField: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
  },

  descriptionValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#4A5568',
    lineHeight: 20,
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  statusCard: {
    backgroundColor: '#E9D8FF',
  },

  addButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#6600FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,

    shadowColor: '#6600FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  addButtonDisabled: {
    opacity: 0.7,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,

    position: 'relative',
  },

  modalCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 16,
    marginTop: 8,
  },

  modalInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },

  modalButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#6600FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  dropdownModalOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: 200,
  },

  dropdownModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    marginHorizontal: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },

  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  dropdownOptionText: {
    fontSize: 16,
    color: '#1A202C',
    marginLeft: 12,
  },

  addGroupOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F0E6FF',
    marginTop: 4,
  },

  addGroupText: {
    fontSize: 16,
    color: '#6600FF',
    fontWeight: '600',
    marginLeft: 12,
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },

  datePickerOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },

  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },

  datePickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
  },

  datePickerColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },

  datePickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },

  datePickerColumnLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    textAlign: 'center',
    marginBottom: 8,
  },

  datePickerScroll: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },

  datePickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },

  datePickerOptionSelected: {
    backgroundColor: '#F0E6FF',
  },

  datePickerOptionText: {
    fontSize: 14,
    color: '#4A5568',
  },

  datePickerOptionTextSelected: {
    color: '#6600FF',
    fontWeight: '600',
  },

  datePickerConfirmButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#6600FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  datePickerConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

});

export default AddTaskScreen;