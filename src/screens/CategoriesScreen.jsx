import React, { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';
import BottomNav from '../screens/BottomNav';
const CategoriesScreen = ({ navigation }) => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] =
    useState(null);


  const loadCategories = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getCategories(token);

      let categoriesData = [];

      if (Array.isArray(data)) {
        categoriesData = data;
      } else if (Array.isArray(data?.categories)) {
        categoriesData = data.categories;
      } else if (Array.isArray(data?.items)) {
        categoriesData = data.items;
      }

      setCategories(categoriesData);

      console.log(
        'Categories:',
        categoriesData
      );
    } catch (error) {
      console.log(
        'Load Categories Error:',
        error?.response?.data ||
          error?.message ||
          error
      );

      Alert.alert(
        'Error',
        'Failed to load categories.'
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories])
  );
  const openAddModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setModalVisible(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setCategoryName(category?.name || '');
    setModalVisible(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalVisible(false);
    setEditingCategory(null);
    setCategoryName('');
  };
  const handleSaveCategory = async () => {
    const name = categoryName.trim();

    if (!name) {
      Alert.alert(
        'Required',
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
      setSaving(true);


      if (editingCategory) {
        console.log(
          'Updating category:',
          editingCategory.id,
          name
        );

        const updatedCategory =
          await updateCategory(
            token,
            editingCategory.id,
            {
              name,
            }
          );

        setCategories((prev) =>
          prev.map((category) =>
            category.id === editingCategory.id
              ? {
                  ...category,
                  ...(updatedCategory || {}),
                  name:
                    updatedCategory?.name ||
                    name,
                }
              : category
          )
        );

        closeModal();

        Alert.alert(
          'Success',
          'Category updated successfully.'
        );
      }


      else {
        console.log(
          'Creating category:',
          name
        );

        const newCategory =
          await createCategory(
            token,
            {
              name,
            }
          );

        setCategories((prev) => [
          ...prev,
          newCategory,
        ]);

        closeModal();

        Alert.alert(
          'Success',
          'Category added successfully.'
        );
      }
    } catch (error) {
      console.log(
        'Save Category Error:',
        error?.response?.status
      );

      console.log(
        'Save Category Data:',
        error?.response?.data
      );

      Alert.alert(
        'Error',
        'Failed to save category.'
      );
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteCategory = (category) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            if (!token) {
              Alert.alert(
                'Error',
                'You are not authenticated.'
              );
              return;
            }

            try {
              console.log(
                'Deleting category:',
                category.id
              );

              await deleteCategory(
                token,
                category.id
              );

              setCategories((prev) =>
                prev.filter(
                  (item) =>
                    item.id !== category.id
                )
              );

              Alert.alert(
                'Success',
                'Category deleted successfully.'
              );
            } catch (error) {
              console.log(
                'Delete Category Status:',
                error?.response?.status
              );

              console.log(
                'Delete Category Error:',
                error?.response?.data ||
                  error?.message ||
                  error
              );

              Alert.alert(
                'Error',
                'Failed to delete category.'
              );
            }
          },
        },
      ]
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8FAFF', '#EEF3FF']}
        style={styles.gradient}
      >

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Categories
            </Text>

            <Text style={styles.subtitle}>
              Organize your tasks by category
            </Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={openAddModal}
          >
            <MaterialIcons
              name="add"
              size={26}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator
              size="large"
              color="#4F46E5"
            />

            <Text style={styles.loadingText}>
              Loading categories...
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.scrollContent
            }
          >

            {categories.length === 0 ? (
              <View style={styles.emptyContainer}>

                <View style={styles.emptyIcon}>
                  <MaterialIcons
                    name="category"
                    size={42}
                    color="#4F46E5"
                  />
                </View>

                <Text style={styles.emptyTitle}>
                  No Categories Yet
                </Text>

                <Text style={styles.emptyText}>
                  Create your first category to
                  organize your tasks.
                </Text>

                <Pressable
                  style={styles.emptyButton}
                  onPress={openAddModal}
                >
                  <MaterialIcons
                    name="add"
                    size={20}
                    color="#FFFFFF"
                  />

                  <Text
                    style={styles.emptyButtonText}
                  >
                    Add Category
                  </Text>
                </Pressable>

              </View>
            ) : (
              categories.map((category, index) => (

                <View
                  key={
                    category.id ??
                    `category-${index}`
                  }
                  style={styles.categoryCard}
                >

                  {/* ICON */}

                  <View style={styles.categoryIcon}>
                    <MaterialIcons
                      name="folder"
                      size={25}
                      color="#4F46E5"
                    />
                  </View>

                  {/* NAME */}

                  <View style={styles.categoryInfo}>

                    <Text
                      style={styles.categoryName}
                      numberOfLines={1}
                    >
                      {category.name ||
                        'Unnamed Category'}
                    </Text>

                    <Text
                      style={styles.categoryId}
                    >
                      Category #{category.id}
                    </Text>

                  </View>

                  {/* ACTIONS */}

                  <View style={styles.actions}>

                    <Pressable
                      style={styles.actionButton}
                      onPress={() =>
                        openEditModal(category)
                      }
                    >
                      <MaterialIcons
                        name="edit"
                        size={20}
                        color="#4F46E5"
                      />
                    </Pressable>

                    <Pressable
                      style={[
                        styles.actionButton,
                        styles.deleteButton,
                      ]}
                      onPress={() =>
                        handleDeleteCategory(
                          category
                        )
                      }
                    >
                      <MaterialIcons
                        name="delete-outline"
                        size={21}
                        color="#EF4444"
                      />
                    </Pressable>

                  </View>

                </View>

              ))
            )}

          </ScrollView>
        )}

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>

            <View style={styles.modalContainer}>

              {/* MODAL HEADER */}

              <View style={styles.modalHeader}>

                <View>

                  <Text style={styles.modalTitle}>
                    {editingCategory
                      ? 'Edit Category'
                      : 'Add Category'}
                  </Text>

                  <Text
                    style={styles.modalSubtitle}
                  >
                    {editingCategory
                      ? 'Update category name'
                      : 'Create a new category'}
                  </Text>

                </View>

                <Pressable
                  onPress={closeModal}
                  disabled={saving}
                  style={styles.closeButton}
                >
                  <MaterialIcons
                    name="close"
                    size={23}
                    color="#64748B"
                  />
                </Pressable>

              </View>

              {/* INPUT */}

              <Text style={styles.inputLabel}>
                Category Name
              </Text>

              <TextInput
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="Enter category name"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                autoFocus
                editable={!saving}
                maxLength={50}
              />

              {/* BUTTONS */}

              <View style={styles.modalActions}>

                <Pressable
                  style={styles.cancelButton}
                  onPress={closeModal}
                  disabled={saving}
                >
                  <Text
                    style={styles.cancelButtonText}
                  >
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.saveButton,
                    saving &&
                      styles.disabledButton,
                  ]}
                  onPress={handleSaveCategory}
                  disabled={saving}
                >

                  {saving ? (
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />
                  ) : (
                    <>
                      <MaterialIcons
                        name={
                          editingCategory
                            ? 'save'
                            : 'add'
                        }
                        size={20}
                        color="#FFFFFF"
                      />

                      <Text
                        style={styles.saveButtonText}
                      >
                        {editingCategory
                          ? 'Update'
                          : 'Add'}
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <BottomNav
          navigation={navigation}
          activeScreen="CategoryScreen"
        />

      </LinearGradient>
    </SafeAreaView>
  );
};

export default CategoriesScreen;


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },

  gradient: {
    flex: 1,
  },


  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748B',
  },

  addButton: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },

  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  categoryInfo: {
    flex: 1,
    paddingRight: 8,
  },

  categoryName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },

  categoryId: {
    marginTop: 4,
    fontSize: 12,
    color: '#94A3B8',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButton: {
    backgroundColor: '#FEF2F2',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingTop: 80,
  },

  emptyIcon: {
    width: 82,
    height: 82,
    borderRadius: 25,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: '#64748B',
    maxWidth: 300,
  },

  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    height: 46,
    borderRadius: 14,
    marginTop: 22,
    gap: 7,
  },

  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#1E293B',
  },

  modalSubtitle: {
    marginTop: 5,
    fontSize: 13,
    color: '#64748B',
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },

  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },

  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  disabledButton: {
    opacity: 0.6,
  },

});