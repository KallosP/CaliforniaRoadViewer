import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import UncheckedBox from '../../assets/checkbox-unchecked.svg';
import CheckedBox from '../../assets/checkbox-checked.svg';

const CheckboxComponent = ({ isChecked, onPress, label }: {isChecked: boolean, onPress: () => void, label: string}) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={isChecked ? [styles.baseBoxContainer, styles.checkedBoxContainer]: styles.baseBoxContainer}>
      {isChecked 
        ? <CheckedBox width={20} height={20} style={styles.checkbox}/> 
        : <UncheckedBox width={20} height={20} style={styles.checkbox}/>}
      <Text style={styles.description}>{label}</Text>
    </TouchableOpacity>
  );
};

CheckboxComponent.name = 'CheckboxComponent';

const styles = StyleSheet.create({
  baseBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
    width: '100%',
    padding: 5,
  },
  checkedBoxContainer: {
    backgroundColor: '#E5E5E5',
  },
  description: {
    fontSize: 15,
    padding: 10,
  },
  checkbox: {
    margin: 8,
  },
});

export default CheckboxComponent;
