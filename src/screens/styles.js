import { StyleSheet } from 'react-native';

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

  statusIconContainer: {
    backgroundColor: '#D6CCFF',
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

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },

  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  editButton: {
    backgroundColor: '#6600FF',
  },

  deleteButton: {
    backgroundColor: '#E53E3E',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

  modalButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },

  modalButtonYes: {
    backgroundColor: '#E53E3E',
  },

  modalButtonNo: {
    backgroundColor: '#6600FF',
  },

  dropdownModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

export default styles;