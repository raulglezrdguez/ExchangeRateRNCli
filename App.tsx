import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';

import Exchange from './src/screens/Exchange';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scroll}>
        <Exchange />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  scroll: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});
