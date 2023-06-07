import React, {FC, useRef, useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type KeyValue = {key: string; value: string};

interface Props {
  label: string;
  data: Array<KeyValue>;
  onSelect: (item: KeyValue) => void;
}

const Dropdown: FC<Props> = ({label, data, onSelect}) => {
  const [visible, setVisible] = useState(false);
  const DropdownButton = useRef<TouchableOpacity | undefined>();
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [selected, setSelected] = useState<KeyValue | undefined>(undefined);

  const toggleDropdown = () => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = (): void => {
    if (DropdownButton !== undefined && DropdownButton.current !== undefined) {
      DropdownButton.current.measure((_fx, _fy, _w, h, px, py) => {
        setDropdownTop(py + h);
        setDropdownLeft(px);
      });
      setVisible(true);
    }
  };

  const renderItem = ({item}: {item: KeyValue}) => {
    return (
      <TouchableOpacity
        testID={`dropdown_item_${item.key}`}
        style={styles.item}
        onPress={() => onItemPress(item)}>
        <Text>{item.value}</Text>
      </TouchableOpacity>
    );
  };

  const onItemPress = (item: KeyValue): void => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  const renderDropdown = () => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}>
          <View
            style={[styles.dropdown, {top: dropdownTop, left: dropdownLeft}]}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      testID={`dropdown_${label}`}
      ref={DropdownButton}
      style={styles.button}
      onPress={toggleDropdown}>
      {renderDropdown()}
      <Text style={styles.buttonText}>
        {(selected && selected.value) || label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    height: 50,
    width: '90%',
    paddingHorizontal: 10,
    zIndex: 1,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '50%',
    height: '30%',
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: {height: 4, width: 0},
    shadowOpacity: 0.5,
  },
  overlay: {
    width: '100%',
    height: '100%',
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
});

export default Dropdown;
