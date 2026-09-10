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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
  },
  
  // Date Picker
  dateScroll: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  dateCard: {
    width: 56,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dateCardSelected: {
    backgroundColor: '#6600FF',
    shadowColor: '#6600FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '500',
    color: '#718096',
    marginBottom: 2,
  },
  dateMonthSelected: {
    color: '#FFFFFF',
  },
  dateDay: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 2,
  },
  dateDaySelected: {
    color: '#FFFFFF',
  },
  dateWeekday: {
    fontSize: 10,
    fontWeight: '500',
    color: '#718096',
  },
  dateWeekdaySelected: {
    color: '#FFFFFF',
  },

  // Filter Buttons
  filterScroll: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#6600FF',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },

  // Tasks List
  tasksContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#A0AEC0',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CBD5E0',
    marginTop: 8,
    fontWeight: '400',
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskProject: {
    fontSize: 12,
    fontWeight: '500',
    color: '#718096',
    flex: 1,
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 12,
    lineHeight: 18,
  },
  taskButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  taskButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editTaskButton: {
    backgroundColor: '#6600FF',
  },
  deleteTaskButton: {
    backgroundColor: '#E53E3E',
  },
  taskButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Modal
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonYes: {
    backgroundColor: '#E53E3E',
  },
  modalButtonNo: {
    backgroundColor: '#6600FF',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default styles;