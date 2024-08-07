import { StyleSheet } from 'react-native';
import { DARK_THEME_COLOR, GREEN_THEME_COLOR } from '../constants/theme-colors';

const lightModal = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: GREEN_THEME_COLOR,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

const darkModal = StyleSheet.create({
  modalBackground: {
    ...lightModal.modalBackground,
  },
  modalContainer: {
    ...lightModal.modalContainer,
    backgroundColor: DARK_THEME_COLOR,
  },
  title: {
    ...lightModal.title,
    color: 'white',
  },
  message: {
    ...lightModal.message,
    color: 'white',
  },
  buttonContainer: {
    ...lightModal.buttonContainer,
  },
  button: {
    ...lightModal.button,
  },
  buttonText: {
    ...lightModal.buttonText,
  },
});

const PermissionsModalStyle = { lightModal, darkModal };
export default PermissionsModalStyle;