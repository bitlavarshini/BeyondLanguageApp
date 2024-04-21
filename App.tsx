import React, { useState, useEffect } from 'react';
import { TextInput, Button, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  // ToDo: Add Firebase Configuration
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Button
            title="SignUp"
            onPress={() => navigation.navigate('SignUp')}
          />
      <Button
                  title="SignIn"
                  onPress={() => navigation.navigate('SignIn')}
                />

    </View>
  );
}

function SelectLanguage({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
        title="Spanish"
        onPress={() => navigation.navigate('Spanish')}
      />
    </View>
  );
}

function SignUp({ navigation }) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleSignup = async () => {
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    Alert.alert('Sign Up Successful');
  })
  .catch((error) => {
    const errorMessage = error.message;
    Alert.alert('Error' + errorMessage);
  });
  };
  return (
<View style={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
}

function SignIn({ navigation }) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleSignIn = async () => {
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    navigation.navigate('SelectLanguage');
  })
  .catch((error) => {
    const errorMessage = error.message;
    Alert.alert('Error' + errorMessage);
  });
  };
  return (
<View style={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="SignIn" onPress={handleSignIn} />
    </View>
  );
}

const questions = [
    {
      question: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      correctAnswer: 'Paris'
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
      correctAnswer: 'Mars'
    },
    {
      question: 'Who wrote the famous play "Romeo and Juliet"?',
      options: ['William Shakespeare', 'Jane Austen', 'Charles Dickens', 'Mark Twain'],
      correctAnswer: 'William Shakespeare'
    }
  ];

function Quiz({ navigation }) {
const [quizCompleted, setQuizCompleted] = useState(false);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);

const handleAnswer = (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestionIndex === questions.length - 1) {
      setScore(score + 1);
          setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
  <View>
  {!quizCompleted ? (
<View>
          <Text>Question {currentQuestionIndex + 1}</Text>
          <Text>{questions[currentQuestionIndex].question}</Text>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <TouchableOpacity key={index} onPress={() => handleAnswer(option)}>
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
</View>
        ) : (
        <View>
                  <Text>Congratulations! You completed the quiz.</Text>
                  <Text>Your final score: {score}</Text>
                </View>
        )}
        </View>
  );
}

export const spanishWords = {
  level1: [
    { id: 1, word: 'hola', translation: 'hello' },
    { id: 2, word: 'adiós', translation: 'goodbye' },
  ],
  level2: [
    { id: 1, word: 'amigo', translation: 'friend' },
    { id: 2, word: 'gracias', translation: 'thank you' },
  ],
};




function Spanish({ navigation }) {
  const [level, setLevel] = useState('level1');
  const words = spanishWords[level];

  const [level1Completed, setLevel1Completed] = useState(false);
  const [level2Unlocked, setLevel2Unlocked] = useState(false);
  const [level2Completed, setLevel2Completed] = useState(false);
  const [quizUnlocked, setQuizUnlocked] = useState(false);

  const handleLevel1Completion = () => {
    setLevel1Completed(true);
    setLevel2Unlocked(true);
    changeLevel('level2');
  };

  const handleLevel2Completion = () => {
      setLevel2Completed(true);
      setQuizUnlocked(true);
    };

  const changeLevel = (newLevel) => {
    setLevel(newLevel);
  };

    return (
      <View>
        {words.map(word => (
          <Text key={word.id}>{word.word} - {word.translation}</Text>
        ))}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Button
          title="Complete Level 1"
          onPress={handleLevel1Completion}
          disabled={level1Completed}
        />
          {level1Completed && (
            <Button
              title="Complete Level 2"
              onPress={handleLevel2Completion}
              disabled={level2Completed}
            />
          )}
          {level2Completed && (
                      <Button
                        title="Start Quiz"
                        onPress={() => navigation.navigate('Quiz')}
                      />
                    )}
        </View>
      </View>
    );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SelectLanguage" component={SelectLanguage} />
        <Stack.Screen name="Spanish" component={Spanish} />
        <Stack.Screen name="Quiz" component={Quiz} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default App;