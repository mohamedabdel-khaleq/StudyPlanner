import React, { useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';

import { sendAIMessage } from '../services/aiService';

import BottomNav from '../screens/BottomNav';

const AIChatScreen = ({ navigation }) => {
  const { token } = useAuth();

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: '1',
      text: `Hi! I'm StudyMate AI 🤖

أقدر أساعدك في مهامك، التقدم، الـ Planner، وإدارة الـ Tasks.

جرب تقول:
"ايه عندي النهارده؟"`,
      sender: 'ai',
    },
  ]);


  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) {
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setMessage('');
    setLoading(true);

    try {
      const data = await sendAIMessage(token, text);

      const aiMessage = {
        id: `${Date.now()}-ai`,
        text:
          data?.message ||
          'حصلت مشكلة في قراءة رد الـ AI.',
        sender: 'ai',
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage,
      ]);
    } catch (error) {
      console.log(
        'AI Chat Error:',
        error?.response?.data || error?.message || error
      );

      const errorMessage = {
        id: `${Date.now()}-error`,
        text:
          'حصلت مشكلة وأنا بحاول أنفذ الطلب 😕\n\nتأكد إن الـ API شغال وإنك عامل Login.',
        sender: 'ai',
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';

    return (
      <View
        style={[
          styles.messageRow,
          isUser && styles.userMessageRow,
        ]}
      >
        {!isUser && (
          <View style={styles.aiAvatar}>
            <MaterialIcons
              name="smart-toy"
              size={18}
              color="#FFFFFF"
            />
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isUser
              ? styles.userBubble
              : styles.aiBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser && styles.userMessageText,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <View style={styles.header}>

          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons
              name="arrow-back"
              size={23}
              color="#6C63FF"
            />
          </Pressable>

          <View style={styles.headerCenter}>

            <View style={styles.headerAvatar}>
              <MaterialIcons
                name="smart-toy"
                size={22}
                color="#FFFFFF"
              />
            </View>

            <View>
              <Text style={styles.headerTitle}>
                StudyMate AI
              </Text>

              <Text style={styles.headerStatus}>
                Your study assistant
              </Text>
            </View>

          </View>

          <View style={styles.onlineContainer}>
            <View style={styles.onlineDot} />

            <Text style={styles.onlineText}>
              Online
            </Text>
          </View>

        </View>


        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />


        {loading && (
          <View style={styles.loadingContainer}>

            <View style={styles.aiAvatar}>
              <MaterialIcons
                name="smart-toy"
                size={18}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.typingBubble}>

              <ActivityIndicator
                size="small"
                color="#6C63FF"
              />

              <Text style={styles.typingText}>
                StudyMate is thinking...
              </Text>

            </View>

          </View>
        )}


        <View style={styles.inputArea}>

          <View style={styles.inputContainer}>

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Ask StudyMate..."
              placeholderTextColor="#999"
              style={styles.input}
              multiline
              editable={!loading}
              onSubmitEditing={sendMessage}
            />

            <Pressable
              style={[
                styles.sendButton,
                (!message.trim() || loading) &&
                  styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={
                !message.trim() || loading
              }
            >
              <MaterialIcons
                name="send"
                size={21}
                color="#FFFFFF"
              />
            </Pressable>

          </View>

        </View>


        <BottomNav
          navigation={navigation}
          activeScreen="AIChatScreen"
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AIChatScreen;


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F7FF',
  },

  keyboardContainer: {
    flex: 1,
  },

  header: {
    height: 75,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEF5',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },

  headerAvatar: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#20202A',
  },

  headerStatus: {
    fontSize: 12,
    color: '#8B8B98',
    marginTop: 2,
  },

  onlineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#42D392',
  },

  onlineText: {
    fontSize: 9,
    color: '#42A879',
    marginTop: 3,
    fontWeight: '600',
  },


  messagesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },

  userMessageRow: {
    justifyContent: 'flex-end',
  },

  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 18,
  },

  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  userBubble: {
    backgroundColor: '#6C63FF',
    borderBottomRightRadius: 5,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#33333D',
  },

  userMessageText: {
    color: '#FFFFFF',
  },


  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 8,
  },

  typingBubble: {
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },

  typingText: {
    marginLeft: 8,
    color: '#777784',
    fontSize: 13,
  },


  inputArea: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 88,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEF5',
  },

  inputContainer: {
    minHeight: 52,
    borderRadius: 27,
    backgroundColor: '#F5F4FA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 7,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#22222A',
    maxHeight: 90,
    paddingVertical: 12,
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendButtonDisabled: {
    opacity: 0.4,
  },

});