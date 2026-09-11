import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

const BottomNav = ({ navigation, activeScreen }) => {
  const goTo = (screen) => {
    if (activeScreen === screen) {
      return;
    }

    navigation.navigate(screen);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.bottomNav}>

        {/* HOME */}

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => goTo('HomeScreen')}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="home"
            size={23}
            color={
              activeScreen === 'HomeScreen'
                ? '#6600FF'
                : '#8A8A8A'
            }
          />

          <Text
            style={[
              styles.navText,
              activeScreen === 'HomeScreen' &&
                styles.activeNavText,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* PLANNER */}

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => goTo('PlannerScreen')}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="calendar-month"
            size={23}
            color={
              activeScreen === 'PlannerScreen'
                ? '#6600FF'
                : '#8A8A8A'
            }
          />

          <Text
            style={[
              styles.navText,
              activeScreen === 'PlannerScreen' &&
                styles.activeNavText,
            ]}
          >
            Planner
          </Text>
        </TouchableOpacity>

        <View style={styles.fabSpace} />
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => goTo('CategoryScreen')}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="folder"
            size={23}
            color={
              activeScreen === 'CategoryScreen'
                ? '#6600FF'
                : '#8A8A8A'
            }
          />

          <Text
            style={[
              styles.navText,
              activeScreen === 'CategoryScreen' &&
                styles.activeNavText,
            ]}
          >
            Categories
          </Text>
        </TouchableOpacity>

        {/* AI */}

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => goTo('AIChatScreen')}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="smart-toy"
            size={23}
            color={
              activeScreen === 'AIChatScreen'
                ? '#6600FF'
                : '#8A8A8A'
            }
          />

          <Text
            style={[
              styles.navText,
              activeScreen === 'AIChatScreen' &&
                styles.activeNavText,
            ]}
          >
            AI
          </Text>
        </TouchableOpacity>
        </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
        activeOpacity={0.85}
      >
        <MaterialIcons
          name="add"
          size={30}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 15,
    height: 75,
  },

  bottomNav: {
    height: 70,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 5,

    elevation: 10,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  navItem: {
    flex: 1,
    height: 60,

    alignItems: 'center',
    justifyContent: 'center',
  },

  navText: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: '600',
    color: '#8A8A8A',
    textAlign: 'center',
  },

  activeNavText: {
    color: '#6600FF',
    fontWeight: '700',
  },

  fabSpace: {
    width: 58,
  },

  fab: {
    position: 'absolute',

    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: '#6600FF',

    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'center',

    top: -15,

    elevation: 12,

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 5,
    },
  },
});

export default BottomNav;