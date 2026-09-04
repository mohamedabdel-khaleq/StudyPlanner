import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        <View style={styles.header}>
          <View style={styles.profile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View>
              <Text style={styles.hello}>
                Hello!
              </Text>
              <Text style={styles.username}>
                USER
              </Text>
            </View>
          </View>
          <Text style={styles.notification}>
          </Text>
        </View>


        <View style={styles.todayCard}>
          <View>

            <Text style={styles.todayText}>
              Your Today is
            </Text>

            <Text style={styles.todayText}>
              Almost Done!
            </Text>

            <Pressable style={styles.viewButton}>
              <Text style={styles.viewButtonText}>
                View Tasks
              </Text>
            </Pressable>

          </View>


          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>
              85%
            </Text>
          </View>
        </View>

        <View style={styles.sectionRow}>

          <Text style={styles.sectionTitle}>
            In Progress
          </Text>

          <Text style={styles.smallPurple}>
            ◦
          </Text>

        </View>


        <ScrollView
          Horizontal
          showsHorizontalScrollIndicator={false}
        >

          <View style={styles.progressCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardCategory}>
                Office Project
              </Text>

              <Text>👜</Text>

            </View>

            <Text style={styles.cardTitle}>
              Grocery shopping app
            </Text>

            <Text style={styles.cardTitle}>
              Design
            </Text>
          </View>

          <View style={styles.progressCard2}>

            <View style={styles.cardHeader}>

              <Text style={styles.cardCategory}>
                Personal Project
              </Text>

              <Text>💼</Text>

            </View>

            <Text style={styles.cardTitle}>
              Uber Eats redesign
            </Text>

            <Text style={styles.cardTitle}>
              Challenge
            </Text>
          </View>
        </ScrollView>


        <View style={styles.sectionRow}>

          <Text style={styles.sectionTitle}>
            Task Groups
          </Text>

          <Text style={styles.groupNumber}>
            4
          </Text>
        </View>


        <Pressable
          Style={styles.taskGroup}
          onPress={() => navigation.navigate('CategoryScreen')}
        >

          <View style={[styles.groupIcon, styles.pink]}>
            <Text>👜</Text>
          </View>

          <View>
            <Text style={styles.groupTitle}>
              Office Project
            </Text>

            <Text style={styles.taskNumber}>
              23 Tasks
            </Text>
          </View>

        </Pressable>

        <Pressable
          Style={styles.taskGroup}
          onPress={() => navigation.navigate('CategoryScreen')}
        >

          <View style={[styles.groupIcon, styles.purple]}>
            <Text>💼</Text>
          </View>

          <View>
            <Text style={styles.groupTitle}>
              Personal Project
            </Text>

            <Text style={styles.taskNumber}>
              30 Tasks
            </Text>
          </View>
        </Pressable>


        <Pressable style={styles.taskGroup}>

          <View style={[styles.groupIcon, styles.orange]}>
            <Text>📚</Text>
          </View>

          <View>
            <Text style={styles.groupTitle}>
              Daily Study
            </Text>

            <Text style={styles.taskNumber}>
              30 Tasks
            </Text>
          </View>

        </Pressable>


        <Pressable style={styles.taskGroup}>

          <View style={[styles.groupIcon, styles.yellow]}>
            <Text>📖</Text>
          </View>

          <View>
            <Text style={styles.groupTitle}>
              Daily Study
            </Text>

            <Text style={styles.taskNumber}>
              12 Tasks
            </Text>
          </View>

        </Pressable>

      </ScrollView>

      <Pressable
        Style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.plus}>
          +
        </Text>
      </Pressable>


      <View style={styles.bottomNav}>

        <Pressable>
          <Text style={styles.navIcon}>⌂</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('PlannerScreen')}
        >
          <Text style={styles.navIcon}>▣</Text>
        </Pressable>

        <View style={{ width: 50 }} />

        <Pressable
          onPress={() => navigation.navigate('CompletedScreen')}
        >
          <Text style={styles.navIcon}>▤</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.navIcon}>♣</Text>
        </Pressable>

      </View>

    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#D9F1F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  avatarText: {
    fontSize: 22,
  },

  hello: {
    fontSize: 11,
    color: '#333',
    fontWeight: '600',
  },

  username: {
    fontSize: 14,
    color: '#222',
    fontWeight: '800',
    marginTop: 2,
  },

  notification: {
    fontSize: 19,
  },


  todayCard: {
    height: 128,
    marginTop: 20,
    borderRadius: 19,
    backgroundColor: '#5B2DE8',

    paddingHorizontal: 18,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  todayText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },

  viewButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 8,
    marginTop: 13,
    alignSelf: 'flex-start',
  },

  viewButtonText: {
    color: '#5B2DE8',
    fontSize: 11,
    fontWeight: '700',
  },

  progressCircle: {
    width: 65,
    height: 65,
    borderRadius: 33,
    borderWidth: 5,
    borderColor: '#FFFFFF',

    justifyContent: 'center',
    alignItems: 'center',
  },

  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#222',
  },

  smallPurple: {
    color: '#5B2DE8',
    marginLeft: 5,
  },

  groupNumber: {
    color: '#5B2DE8',
    fontWeight: '800',
    marginLeft: 5,
  },

  progressCard: {
    width: 175,
    height: 92,
    backgroundColor: '#E7F4FC',
    borderRadius: 13,
    padding: 12,
    marginRight: 10,
  },

  progressCard2: {
    width: 175,
    height: 92,
    backgroundColor: '#FFF0EC',
    borderRadius: 13,
    padding: 12,
    marginRight: 10,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardCategory: {
    fontSize: 9,
    color: '#888',
  },

  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
  },

  taskGroup: {
    height: 61,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,

    marginBottom: 10,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 13,

    elevation: 2,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 5,
  },

  groupIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  pink: {
    backgroundColor: '#FFE5F0',
  },

  purple: {
    backgroundColor: '#EEE4FF',
  },

  orange: {
    backgroundColor: '#FFEBD9',
  },

  yellow: {
    backgroundColor: '#FFF5C9',
  },

  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },

  taskNumber: {
    fontSize: 9,
    color: '#999',
    marginTop: 3,
  },

  addButton: {
    position: 'absolute',
    bottom: 39,
    alignSelf: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#5B2DE8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 7,
  },

  plus: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 61,
    backgroundColor: '#F0E9FF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
  },

  navIcon: {
    fontSize: 22,
    color: '#5B2DE8',
  },

});
