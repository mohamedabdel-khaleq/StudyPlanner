import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const CategoriesScreen = ({ navigation }) => {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  const [saving, setSaving] = useState(false);

  // =========================
  // Get Categories
  // =========================
  const loadCategories = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const response = await API.get('/categories/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      // Handle different possible API response shapes
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data?.categories)) {
        setCategories(data.categories);
      } else if (Array.isArray(data?.items)) {
        setCategories(data.items);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.log(
        'Load categories error:',
        error?.response?.data || error.message
      );

      Alert.alert(
        'Error',
        error?.response?.data?.detail ||
          'Could not load categories.'
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Reload whenever screen gets focus
  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories])
  );

  // =========================
  // Open Add Modal
  // =========================
  const openAddModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setModalVisible(true);
  };

  // =========================
  // Open Edit Modal
  // =========================
  const openEditModal = (category) => {
    setEditingCategory(category);
    setCategoryName(category?.name || '');
    setModalVisible(true);
  };

  // =========================
  // Close Modal
  // =========================
  const closeModal = () => {
    if (saving) return;

    setModalVisible(false);
    setEditingCategory(null);
    setCategoryName('');
  };

  // =========================
  // Add / Update Category
  // =========================
  const handleSaveCategory = async () => {
    const name = categoryName.trim();

    if (!name) {
      Alert.alert('Missing name', 'Please enter a category name.');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'You are not logged in.');
      return;
    }

    try {
      setSaving(true);

      if (editingCategory) {
        // =========================
        // UPDATE
        // PUT /categories/{id}
        // =========================
        const response = await API.put(
          `/categories/${editingCategory.id}`,
          {
            name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedCategory = response.data;

        setCategories((prev) =>
          prev.map((category) =>
            category.id === editingCategory.id
              ? {
                  ...category,
                  ...updatedCategory,
                  name,
                }
              : category
          )
        );

        Alert.alert('Success', 'Category updated successfully.');
      } else {
        // =========================
        // CREATE
        // POST /categories/
        // =========================
        const response = await API.post(
          '/categories/',
          {
            name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newCategory = response.data;

        setCategories((prev) => [
          ...prev,
          newCategory,
        ]);

        Alert.alert('Success', 'Category added successfully.');
      }

      closeModal();
    } catch (error) {
      console.log(
        'Save category error:',
        error?.response?.data || error.message
      );

      Alert.alert(
        'Error',
        error?.response?.data?.detail ||
          'Could not save category.'
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Delete Category
  // =========================
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
          onPress: () => deleteCategory(category.id),
        },
      ]
    );
  };

  const deleteCategory = async (categoryId) => {
    if (!token) {
      Alert.alert('Error', 'You are not logged in.');
      return;
    }

    try {
      await API.delete(`/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories((prev) =>
        prev.filter((category) => category.id !== categoryId)
      );

      Alert.alert('Success', 'Category deleted successfully.');
    } catch (error) {
      console.log(
        'Delete category error:',
        error?.response?.data || error.message
      );

      Alert.alert(
        'Error',
        error?.response?.data?.detail ||
          'Could not delete category.'
      );
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <LinearGradient
        colors={['#F8FAFC', '#EEF2FF']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>
              Loading categories...
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <LinearGradient
      colors={['#F8FAFC', '#EEF2FF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="#111827"
            />
          </Pressable>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              Categories
            </Text>

            <Text style={styles.headerSubtitle}>
              Organize your tasks
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

        {/* Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Category Count */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <MaterialIcons
                name="category"
                size={25}
                color="#6366F1"
              />
            </View>

            <View>
              <Text style={styles.summaryNumber}>
                {categories.length}
              </Text>

              <Text style={styles.summaryText}>
                {categories.length === 1
                  ? 'Category'
                  : 'Categories'}
              </Text>
            </View>
          </View>

          {/* Empty State */}
          {categories.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <MaterialIcons
                  name="category"
                  size={48}
                  color="#A5B4FC"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No Categories Yet
              </Text>

              <Text style={styles.emptyText}>
                Create your first category to organize
                your tasks.
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

                <Text style={styles.emptyButtonText}>
                  Add Category
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.list}>
              {categories.map((category, index) => (
                <View
                  key={
                    category.id?.toString() ||
                    index.toString()
                  }
                  style={styles.categoryCard}
                >
                  {/* Left */}
                  <View style={styles.categoryLeft}>
                    <View style={styles.categoryIcon}>
                      <MaterialIcons
                        name="folder"
                        size={24}
                        color="#6366F1"
                      />
                    </View>

                    <View style={styles.categoryInfo}>
                      <Text
                        style={styles.categoryName}
                        numberOfLines={1}
                      >
                        {category.name || 'Unnamed Category'}
                      </Text>

                      <Text style={styles.categoryId}>
                        Category #{category.id}
                      </Text>
                    </View>
                  </View>

                  {/* Actions */}
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
                        color="#6366F1"
                      />
                    </Pressable>

                    <Pressable
                      style={[
                        styles.actionButton,
                        styles.deleteAction,
                      ]}
                      onPress={() =>
                        handleDeleteCategory(category)
                      }
                    >
                      <MaterialIcons
                        name="delete-outline"
                        size={20}
                        color="#EF4444"
                      />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Add / Edit Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>
                    {editingCategory
                      ? 'Edit Category'
                      : 'Add Category'}
                  </Text>

                  <Text style={styles.modalSubtitle}>
                    {editingCategory
                      ? 'Update category name'
                      : 'Create a new category'}
                  </Text>
                </View>

                <Pressable
                  style={styles.closeButton}
                  onPress={closeModal}
                  disabled={saving}
                >
                  <MaterialIcons
                    name="close"
                    size={23}
                    color="#6B7280"
                  />
                </Pressable>
              </View>

              {/* Input */}
              <Text style={styles.inputLabel}>
                Category Name
              </Text>

              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="folder-open"
                  size={21}
                  color="#9CA3AF"
                />

                <TextInput
                  value={categoryName}
                  onChangeText={setCategoryName}
                  placeholder="e.g. Study"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  autoFocus
                  editable={!saving}
                  maxLength={50}
                />
              </View>

              {/* Buttons */}
              <View style={styles.modalButtons}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={closeModal}
                  disabled={saving}
                >
                  <Text style={styles.cancelButtonText}>
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.saveButton}
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
                            ? 'check'
                            : 'add'
                        }
                        size={20}
                        color="#FFFFFF"
                      />

                      <Text style={styles.saveButtonText}>
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
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CategoriesScreen;

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
  },

  // =========================
  // Header
  // =========================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#111827',
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: '#6B7280',
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#6366F1',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  // =========================
  // Content
  // =========================

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  summaryNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },

  summaryText: {
    marginTop: 2,
    fontSize: 13,
    color: '#6B7280',
  },

  // =========================
  // Empty
  // =========================

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 25,
    paddingVertical: 45,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#111827',
  },

  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
    color: '#6B7280',
    maxWidth: 280,
  },

  emptyButton: {
    marginTop: 22,
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  emptyButtonText: {
    marginLeft: 7,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // =========================
  // Category Cards
  // =========================

  list: {
    gap: 12,
  },

  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  categoryLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  categoryInfo: {
    flex: 1,
  },

  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  categoryId: {
    marginTop: 4,
    fontSize: 12,
    color: '#9CA3AF',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },

  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
  },

  deleteAction: {
    backgroundColor: '#FEF2F2',
  },

  // =========================
  // Modal
  // =========================

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
    color: '#111827',
  },

  modalSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },

  inputContainer: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#111827',
  },

  modalButtons: {
    flexDirection: 'row',
    marginTop: 25,
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },

  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  saveButtonText: {
    marginLeft: 7,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});