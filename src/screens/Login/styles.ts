import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  gradientContainer: {
    flex: 1,
  },
  
  welcomeSection: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
  },
  
  welcomeSub: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5F5F5F',
  },
  
  whiteContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: -80,
    paddingHorizontal: 24,
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  
  loginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#AF93FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  loginTextContainer: {
    flex: 1,
  },
  
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 4,
  },
  
  sectionSub: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5F5F5F',
    marginBottom: 20,
  },
  
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#5F5F5F',
    marginBottom: 50,
  },
  
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 40,
  },
  
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#AF93FF',
    borderRadius: 12,
    backgroundColor: '#D5C9FF',
    height: 56,
  },
  
  inputIcon: {
    marginLeft: 16,
    marginRight: 8,
  },
  
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    paddingRight: 16,
    fontWeight: '500',
  },
  
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#6600FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    shadowColor: '#6600FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default styles;