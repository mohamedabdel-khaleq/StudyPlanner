import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
  },

  loadingTitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  loadingSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
  },

  emptyScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#F8F9FF',
  },

  emptyTitle: {
    marginTop: 18,
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },

  backHomeButton: {
    marginTop: 25,
    paddingHorizontal: 30,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
  },

  backHomeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  header: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#111827',
  },

  taskIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F0EDFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 22,
  },

  taskIdText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '700',
    color: '#6C63FF',
  },

  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 9,
    marginTop: 8,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  input: {
    width: '100%',
    minHeight: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#111827',
    marginBottom: 12,
  },

  descriptionInput: {
    minHeight: 125,
    paddingTop: 15,
  },

  categoryList: {
    gap: 10,
    paddingVertical: 5,
    paddingBottom: 12,
  },

  groupButton: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  groupButtonSelected: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },

  groupButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },

  groupButtonTextSelected: {
    color: '#FFFFFF',
  },

  noCategoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },

  noCategoriesText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },

  dateInput: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 5,
  },

  dateText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },

  helperText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#9CA3AF',
    marginTop: 4,
    marginBottom: 8,
  },

  priorityContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },

  priorityButton: {
    flex: 1,
    minHeight: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  priorityButtonSelected: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },

  priorityButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },

  priorityButtonTextSelected: {
    color: '#FFFFFF',
  },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginTop: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEF0F4',
  },

  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#F8F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusContent: {
    marginLeft: 12,
  },

  statusLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 3,
  },

  statusValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  actionButtonWrapper: {
    marginTop: 10,
  },

  updateButton: {
    minHeight: 54,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  deleteButton: {
    minHeight: 52,
    borderRadius: 15,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  deleteButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '800',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 20,
  },

  datePickerContainer: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 18,
    textAlign: 'center',
  },

  datePickerLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginTop: 8,
    marginBottom: 4,
  },

  dateOptionsList: {
    gap: 8,
    paddingVertical: 8,
  },

  dateOption: {
    minWidth: 48,
    height: 42,
    paddingHorizontal: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  dateOptionSelected: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },

  dateOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },

  dateOptionTextSelected: {
    color: '#FFFFFF',
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 10,

    marginTop: 20,
  },

  cancelButton: {
    flex: 1,

    minHeight: 48,

    borderRadius: 13,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#F3F4F6',
  },

  cancelButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '700',
  },

  confirmButton: {
    flex: 1,

    minHeight: 48,

    borderRadius: 13,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#6C63FF',
  },

  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default styles;