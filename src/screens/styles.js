import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 3,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 9,
    marginTop: 15,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  addGroupText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C63FF',
  },

  input: {
    width: '100%',
    minHeight: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#111827',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 3,

    elevation: 1,
  },

  descriptionInput: {
    minHeight: 120,
    paddingTop: 15,
    paddingBottom: 15,
  },

  groupButton: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
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

  dateInput: {
    width: '100%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },

  dateText: {
    fontSize: 15,
    color: '#374151',
  },

  priorityContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },

  priorityButton: {
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  priorityButtonSelected: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },

  priorityButtonTextSelected: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  addButton: {
    height: 55,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6C63FF',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  datePickerContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    maxHeight: '80%',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },

  datePickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    marginBottom: 4,
  },

  dateOption: {
    minWidth: 48,
    height: 42,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dateOptionSelected: {
    backgroundColor: '#6C63FF',
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
    gap: 12,
    marginTop: 22,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  addGroupModal: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
  },
});

export default styles;