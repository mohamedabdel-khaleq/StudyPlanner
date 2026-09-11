import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';

import {
  createTask,
} from '../services/taskService';

import {
  getCategories,
  createCategory,
} from '../services/categoryService';

const AddTaskScreen = ({ navigation }) => {
  const { token } = useAuth();
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(
    new Date()
  );
  const [endDate, setEndDate] = useState(
    new Date()
  );
  const [priority, setPriority] = useState('Medium');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState(null);
  const [loadingCategories, setLoadingCategories] =
    useState(true);
  const [saving, setSaving] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] =
    useState(false);
  const [newCategoryName, setNewCategoryName] =
    useState('');
  const [creatingCategory, setCreatingCategory] =
    useState(false);
  const [dateModalVisible, setDateModalVisible] =
    useState(false);

  const [dateType, setDateType] = useState('end');

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

  const formatDateForUI = (date) => {
    if (!date) {
      return 'Select date';
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };


  const loadCategories = async () => {
    if (!token) {
      setLoadingCategories(false);
      return;
    }

    try {
      setLoadingCategories(true);

      console.log(
        'Loading categories for Add Task...'
      );

      const data = await getCategories(token);

      console.log(
        'Categories response:',
        data
      );

      let categoriesData = [];

      if (Array.isArray(data)) {
        categoriesData = data;
      } else if (
        Array.isArray(data?.categories)
      ) {
        categoriesData = data.categories;
      } else if (
        Array.isArray(data?.items)
      ) {
        categoriesData = data.items;
      }

      setCategories(categoriesData);

      // Auto select first category
      if (categoriesData.length > 0) {
        setSelectedCategory(
          categoriesData[0]
        );
      }
    } catch (error) {
      console.log(
        'Load categories error:',
        error
      );

      console.log(
        'Categories status:',
        error?.response?.status
      );

      console.log(
        'Categories response:',
        error?.response?.data
      );

      Alert.alert(
        'Error',
        'Could not load categories.'
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [token]);


  const openDatePicker = (type) => {
    setDateType(type);
    setDateModalVisible(true);
  };

  const changeDate = (days) => {
    const currentDate =
      dateType === 'start'
        ? startDate
        : endDate;

    const newDate = new Date(currentDate);

    newDate.setDate(
      newDate.getDate() + days
    );

    if (dateType === 'start') {
      setStartDate(newDate);

      // Keep end date >= start date
      if (newDate > endDate) {
        setEndDate(new Date(newDate));
      }
    } else {
      setEndDate(newDate);
    }
  };

  const handleCreateCategory = async () => {
    const name =
      newCategoryName.trim();

    if (!name) {
      Alert.alert(
        'Validation',
        'Please enter a category name.'
      );

      return;
    }

    if (!token) {
      Alert.alert(
        'Error',
        'You are not authenticated.'
      );

      return;
    }

    try {
      setCreatingCategory(true);

      console.log(
        'Creating category:',
        name
      );

      const response =
        await createCategory(
          token,
          {
            name,
          }
        );

      console.log(
        'Create category response:',
        response
      );

      const newCategory =
        response?.category ||
        response;

      if (
        !newCategory ||
        !newCategory.id
      ) {
        throw new Error(
          'Invalid category response'
        );
      }

      setCategories((prev) => [
        ...prev,
        newCategory,
      ]);

      setSelectedCategory(
        newCategory
      );

      setNewCategoryName('');

      setCategoryModalVisible(false);

      Alert.alert(
        'Success',
        'Category created successfully.'
      );
    } catch (error) {
      console.log(
        'Create category error:',
        error
      );

      console.log(
        'Create category status:',
        error?.response?.status
      );

      console.log(
        'Create category response:',
        error?.response?.data
      );

      Alert.alert(
        'Error',
        'Could not create category.'
      );
    } finally {
      setCreatingCategory(false);
    }
  };


  const validateForm = () => {
    const finalName =
      taskName.trim();

    if (!finalName) {
      Alert.alert(
        'Validation',
        'Please enter a task title.'
      );

      return false;
    }

    if (!selectedCategory) {
      Alert.alert(
        'Validation',
        'Please select a category.'
      );

      return false;
    }

    if (endDate < startDate) {
      Alert.alert(
        'Validation',
        'Due date cannot be before start date.'
      );

      return false;
    }

    if (!token) {
      Alert.alert(
        'Error',
        'You are not authenticated.'
      );

      return false;
    }

    return true;
  };

  const handleCreateTask = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const finalName =
        taskName.trim();

      const taskData = {
        title: finalName,

        description:
          description.trim(),

        due_date:
          formatDateToISO(endDate),

        priority:
          priority.toLowerCase(),

        category_id:
          selectedCategory.id,
      };

      console.log(
        'Create Task Request:',
        taskData
      );

      const response =
        await createTask(
          token,
          taskData
        );

      console.log(
        'Create Task Response:',
        response
      );

      Alert.alert(
        'Success',
        'Task created successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.log(
        'Create task error:',
        error
      );

      console.log(
        'Create task status:',
        error?.response?.status
      );

      console.log(
        'Create task response:',
        error?.response?.data
      );

      let message =
        'Could not create the task.';

      if (
        error?.response?.data?.detail
      ) {
        message =
          Array.isArray(
            error.response.data.detail
          )
            ? error.response.data.detail
                .map(
                  (item) =>
                    item.msg
                )
                .join('\n')
            : String(
                error.response.data.detail
              );
      }

      Alert.alert(
        'Error',
        message
      );
    } finally {
      setSaving(false);
    }
  };


  const renderCategory = ({
    item,
  }) => {
    const isSelected =
      selectedCategory?.id ===
      item.id;

    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isSelected &&
            styles.categoryItemSelected,
        ]}
        onPress={() =>
          setSelectedCategory(item)
        }
        activeOpacity={0.8}
      >
        <MaterialIcons
          name="folder"
          size={18}
          color={
            isSelected
              ? '#FFFFFF'
              : '#6600FF'
          }
        />

        <Text
          style={[
            styles.categoryItemText,
            isSelected &&
              styles.categoryItemTextSelected,
          ]}
        >
          {item.name}
        </Text>

        {isSelected && (
          <MaterialIcons
            name="check"
            size={18}
            color="#FFFFFF"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'bottom']}
    >
      <LinearGradient
        colors={[
          '#F0F9FF',
          '#E6F3FF',
          '#F0E6FF',
          '#FFF5F0',
        ]}
        locations={[
          0,
          0.33,
          0.66,
          1,
        ]}
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 1,
          y: 1,
        }}
        style={styles.gradient}
      >

        {/* ================= HEADER ================= */}

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() =>
              navigation.goBack()
            }
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="arrow-back"
              size={25}
              color="#1A202C"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Add Task
          </Text>

          <View
            style={styles.headerPlaceholder}
          />

        </View>


        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
        >


          <View style={styles.card}>

            <Text style={styles.label}>
              Task Title
            </Text>

            <TextInput
              value={taskName}
              onChangeText={
                setTaskName
              }
              placeholder="Enter task title"
              placeholderTextColor="#A0AEC0"
              style={styles.input}
              maxLength={100}
            />

          </View>


          <View style={styles.card}>

            <Text style={styles.label}>
              Description
            </Text>

            <TextInput
              value={description}
              onChangeText={
                setDescription
              }
              placeholder="Enter task description"
              placeholderTextColor="#A0AEC0"
              style={[
                styles.input,
                styles.textArea,
              ]}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />

          </View>


          <View style={styles.card}>

            <View
              style={styles.labelRow}
            >

              <Text style={styles.label}>
                Category
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setCategoryModalVisible(
                    true
                  )
                }
              >
                <Text
                  style={
                    styles.addCategoryText
                  }
                >
                  + Add
                </Text>
              </TouchableOpacity>

            </View>

            {loadingCategories ? (

              <View
                style={
                  styles.categoryLoading
                }
              >

                <ActivityIndicator
                  size="small"
                  color="#6600FF"
                />

                <Text
                  style={
                    styles.categoryLoadingText
                  }
                >
                  Loading categories...
                </Text>

              </View>

            ) : categories.length ===
              0 ? (

              <View
                style={
                  styles.emptyCategory
                }
              >

                <MaterialIcons
                  name="folder-off"
                  size={25}
                  color="#A0AEC0"
                />

                <Text
                  style={
                    styles.emptyCategoryText
                  }
                >
                  No categories found
                </Text>

                <TouchableOpacity
                  style={
                    styles.createFirstCategoryButton
                  }
                  onPress={() =>
                    setCategoryModalVisible(
                      true
                    )
                  }
                >

                  <Text
                    style={
                      styles.createFirstCategoryText
                    }
                  >
                    Create Category
                  </Text>

                </TouchableOpacity>

              </View>

            ) : (

              <View
                style={
                  styles.categoriesContainer
                }
              >

                {categories.map((item) => (
                  <View key={item.id}>
                    {renderCategory({ item })}
                  </View>
                ))}

              </View>

            )}

          </View>


          <View style={styles.card}>

            <Text style={styles.label}>
              Start Date
            </Text>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() =>
                openDatePicker(
                  'start'
                )
              }
              activeOpacity={0.8}
            >

              <View
                style={
                  styles.dateIcon
                }
              >
                <MaterialIcons
                  name="calendar-today"
                  size={20}
                  color="#6600FF"
                />
              </View>

              <Text
                style={
                  styles.dateText
                }
              >
                {formatDateForUI(
                  startDate
                )}
              </Text>

              <MaterialIcons
                name="keyboard-arrow-down"
                size={22}
                color="#718096"
              />

            </TouchableOpacity>

            <Text
              style={
                styles.helperText
              }
            >
              Start date is used for
              planning only.
            </Text>

          </View>

          <View style={styles.card}>

            <Text style={styles.label}>
              Due Date
            </Text>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() =>
                openDatePicker(
                  'end'
                )
              }
              activeOpacity={0.8}
            >

              <View
                style={
                  styles.dateIcon
                }
              >
                <MaterialIcons
                  name="event"
                  size={20}
                  color="#6600FF"
                />
              </View>

              <Text
                style={
                  styles.dateText
                }
              >
                {formatDateForUI(
                  endDate
                )}
              </Text>

              <MaterialIcons
                name="keyboard-arrow-down"
                size={22}
                color="#718096"
              />

            </TouchableOpacity>

            <Text
              style={
                styles.helperText
              }
            >
              This is the date saved
              as the task due date.
            </Text>

          </View>
          <View style={styles.card}>

            <Text style={styles.label}>
              Priority
            </Text>

            <View
              style={
                styles.priorityContainer
              }
            >

              {[
                'Low',
                'Medium',
                'High',
              ].map((item) => {

                const isSelected =
                  priority === item;

                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.priorityButton,
                      isSelected &&
                        styles.prioritySelected,
                    ]}
                    onPress={() =>
                      setPriority(
                        item
                      )
                    }
                    activeOpacity={0.8}
                  >

                    <MaterialIcons
                      name="flag"
                      size={17}
                      color={
                        isSelected
                          ? '#FFFFFF'
                          : item ===
                            'High'
                          ? '#E53E3E'
                          : item ===
                            'Medium'
                          ? '#D69E2E'
                          : '#3182CE'
                      }
                    />

                    <Text
                      style={[
                        styles.priorityText,
                        isSelected &&
                          styles.priorityTextSelected,
                      ]}
                    >
                      {item}
                    </Text>

                  </TouchableOpacity>
                );
              })}

            </View>

          </View>


          <TouchableOpacity
            style={[
              styles.createButton,
              saving &&
                styles.createButtonDisabled,
            ]}
            onPress={
              handleCreateTask
            }
            disabled={saving}
            activeOpacity={0.85}
          >

            {saving ? (

              <>
                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                />

                <Text
                  style={
                    styles.createButtonText
                  }
                >
                  Creating...
                </Text>
              </>

            ) : (

              <>
                <MaterialIcons
                  name="add-task"
                  size={21}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.createButtonText
                  }
                >
                  Create Task
                </Text>
              </>

            )}

          </TouchableOpacity>

          <View
            style={
              styles.bottomSpace
            }
          />

        </ScrollView>


        <Modal
          visible={
            categoryModalVisible
          }
          transparent
          animationType="fade"
          onRequestClose={() =>
            setCategoryModalVisible(
              false
            )
          }
        >

          <View
            style={
              styles.modalOverlay
            }
          >

            <View
              style={
                styles.modalContainer
              }
            >

              <View
                style={
                  styles.modalHeader
                }
              >

                <Text
                  style={
                    styles.modalTitle
                  }
                >
                  Add Category
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setNewCategoryName(
                      ''
                    );

                    setCategoryModalVisible(
                      false
                    );
                  }}
                >

                  <MaterialIcons
                    name="close"
                    size={25}
                    color="#1A202C"
                  />

                </TouchableOpacity>

              </View>

              <Text
                style={
                  styles.modalLabel
                }
              >
                Category Name
              </Text>

              <TextInput
                value={
                  newCategoryName
                }
                onChangeText={
                  setNewCategoryName
                }
                placeholder="e.g. University"
                placeholderTextColor="#A0AEC0"
                style={
                  styles.modalInput
                }
                autoFocus
                maxLength={50}
              />

              <TouchableOpacity
                style={[
                  styles.modalCreateButton,
                  creatingCategory &&
                    styles.createButtonDisabled,
                ]}
                onPress={
                  handleCreateCategory
                }
                disabled={
                  creatingCategory
                }
                activeOpacity={0.85}
              >

                {creatingCategory ? (

                  <ActivityIndicator
                    color="#FFFFFF"
                  />

                ) : (

                  <Text
                    style={
                      styles.modalCreateButtonText
                    }
                  >
                    Create Category
                  </Text>

                )}

              </TouchableOpacity>

            </View>

          </View>

        </Modal>

        {/* ================= DATE MODAL ================= */}

        <Modal
          visible={
            dateModalVisible
          }
          transparent
          animationType="fade"
          onRequestClose={() =>
            setDateModalVisible(
              false
            )
          }
        >

          <View
            style={
              styles.modalOverlay
            }
          >

            <View
              style={
                styles.dateModalContainer
              }
            >

              <View
                style={
                  styles.modalHeader
                }
              >

                <Text
                  style={
                    styles.modalTitle
                  }
                >
                  {dateType ===
                  'start'
                    ? 'Start Date'
                    : 'Due Date'}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setDateModalVisible(
                      false
                    )
                  }
                >

                  <MaterialIcons
                    name="close"
                    size={25}
                    color="#1A202C"
                  />

                </TouchableOpacity>

              </View>

              <Text
                style={
                  styles.selectedDateText
                }
              >
                {formatDateForUI(
                  dateType ===
                    'start'
                    ? startDate
                    : endDate
                )}
              </Text>

              <View
                style={
                  styles.dateControls
                }
              >

                <TouchableOpacity
                  style={
                    styles.dateControlButton
                  }
                  onPress={() =>
                    changeDate(
                      -1
                    )
                  }
                >

                  <MaterialIcons
                    name="remove"
                    size={25}
                    color="#6600FF"
                  />

                </TouchableOpacity>

                <Text
                  style={
                    styles.dateControlText
                  }
                >
                  Change Date
                </Text>

                <TouchableOpacity
                  style={
                    styles.dateControlButton
                  }
                  onPress={() =>
                    changeDate(
                      1
                    )
                  }
                >

                  <MaterialIcons
                    name="add"
                    size={25}
                    color="#6600FF"
                  />

                </TouchableOpacity>

              </View>

              <TouchableOpacity
                style={
                  styles.doneDateButton
                }
                onPress={() =>
                  setDateModalVisible(
                    false
                  )
                }
              >

                <Text
                  style={
                    styles.doneDateButtonText
                  }
                >
                  Done
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        </Modal>

      </LinearGradient>
    </SafeAreaView>
  );
};


const styles = {

  container: {
    flex: 1,
  },

  gradient: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  headerPlaceholder: {
    width: 42,
    height: 42,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 10,
  },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  addCategoryText: {
    color: '#6600FF',
    fontSize: 14,
    fontWeight: '700',
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1A202C',
    backgroundColor: '#FAFCFF',
  },

  textArea: {
    minHeight: 110,
    paddingTop: 14,
  },

  categoryLoading: {
    minHeight: 55,
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoryLoadingText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#718096',
  },

  categoriesContainer: {
    gap: 9,
  },

  categoryItem: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoryItemSelected: {
    backgroundColor: '#6600FF',
    borderColor: '#6600FF',
  },

  categoryItemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },

  categoryItemTextSelected: {
    color: '#FFFFFF',
  },

  emptyCategory: {
    alignItems: 'center',
    paddingVertical: 15,
  },

  emptyCategoryText: {
    marginTop: 7,
    fontSize: 13,
    color: '#718096',
  },

  createFirstCategoryButton: {
    marginTop: 12,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F0E6FF',
  },

  createFirstCategoryText: {
    color: '#6600FF',
    fontSize: 13,
    fontWeight: '700',
  },

  dateButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFCFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  dateIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F0E6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  dateText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A202C',
  },

  helperText: {
    marginTop: 7,
    fontSize: 11,
    color: '#A0AEC0',
  },

  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  priorityButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFCFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  prioritySelected: {
    backgroundColor: '#6600FF',
    borderColor: '#6600FF',
  },

  priorityText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '700',
    color: '#4A5568',
  },

  priorityTextSelected: {
    color: '#FFFFFF',
  },

  createButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#6600FF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 3,
    marginTop: 2,
  },

  createButtonDisabled: {
    opacity: 0.65,
  },

  createButtonText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  bottomSpace: {
    height: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  modalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },

  dateModalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A202C',
  },

  modalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A5568',
    marginBottom: 8,
  },

  modalInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1A202C',
    backgroundColor: '#FAFCFF',
  },

  modalCreateButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6600FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },

  modalCreateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  selectedDateText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: '#6600FF',
    marginBottom: 25,
  },

  dateControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateControlButton: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#F0E6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateControlText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A5568',
  },

  doneDateButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6600FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },

  doneDateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
};

export default AddTaskScreen;