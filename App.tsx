import React, { useState, useEffect } from 'react';
import { TextInput, Button, View, Text, TouchableOpacity, StyleSheet, Alert, Objects } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, get, child, set, onValue } from "firebase/database";
import Flashcard from './Flashcard'

const firebaseConfig = {
  // Todo : Add firebase config
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const dbRef = ref(getDatabase());

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

function SignUp({ navigation }) {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userEmail = user.email;
        const subEmail = userEmail.match(/^(.*?)(?=@)/)[0];
        let trackLevel = {
            level : 0
          }
        const path = 'Users/' + subEmail;

        set(ref(getDatabase(), path), trackLevel);
        navigation.navigate('SignIn')
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
        const userEmail = user.email;
        const subEmail = userEmail.match(/^(.*?)(?=@)/)[0];

        get(child(dbRef, `Users/${subEmail}`))
          .then((snapshot) => {
            let trackLevel = snapshot.val();
            navigation.navigate('SelectLanguage', { trackLevel: trackLevel , subEmail: subEmail});
          })
          .catch((error) => {
            console.error('Error reading data:', error);
          });

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

function SelectLanguage({ navigation }) {
  const route = useRoute()
  let trackLevel = route.params?.trackLevel
  const subEmail = route.params?.subEmail

   const trackProgress = async () => {
            get(child(dbRef, `Users/${subEmail}`))
              .then((snapshot) => {
                trackLevel = snapshot.val();
                navigation.navigate('Levels', { trackLevel: trackLevel, subEmail: subEmail})
              })
              .catch((error) => {
                console.error('Error reading data:', error);
              });
    };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Spanish"
        onPress={trackProgress}
      />
    </View>
  );
}

function Levels({ navigation }) {
const route = useRoute()
const subEmail = route.params?.subEmail
  let trackLevel = route.params?.trackLevel
const path = 'Users/' + subEmail;
    const handleLevel1 = async () => {
    if (trackLevel.level == 0) {
    trackLevel = {
                          level : 1
                        }
          set(ref(getDatabase(), path), trackLevel);
          }
          navigation.navigate('Level1', { trackLevel: trackLevel , subEmail: subEmail})
    };

    const handleLevel2 = async () => {
    if(trackLevel.level == 2) {
        trackLevel = {
                              level : 3
                            }
              set(ref(getDatabase(), path), trackLevel);
              }
              navigation.navigate('Level2', { trackLevel: trackLevel , subEmail: subEmail})
        };

        const handleQuiz = async () => {
            if(trackLevel.level == 4) {
                trackLevel = {
                                      level : 5
                                    }
                      set(ref(getDatabase(), path), trackLevel);
                      }
                      navigation.navigate('Quiz', { trackLevel: trackLevel , subEmail: subEmail})
                };

   const trackProgress = async () => {
          get(child(dbRef, `Users/${subEmail}`))
            .then((snapshot) => {
              trackLevel = snapshot.val();
              navigation.navigate('TrackProgress', {trackLevel: trackLevel, subEmail: subEmail});
            })
            .catch((error) => {
              console.error('Error reading data:', error);
            });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Level1"
        onPress={handleLevel1}
      />
      <Button
        title="Level2"
        onPress={handleLevel2}
         disabled={trackLevel.level < 2}
      />
      <Button
        title="Start Quiz"
        onPress={handleQuiz}
        disabled={trackLevel.level < 4}
      />
      <Button title="Track Progress" onPress={trackProgress} />
    </View>
  );
}

function TrackProgress({ navigation }) {
const route = useRoute()
let trackLevel = route.params?.trackLevel
const subEmail = route.params?.subEmail
let text = null;
  if (trackLevel.level == 0) {
    text = "Didn't Make Any Progress Yet, Please Start Practicing Levels"
  } else
  if (trackLevel.level == 1) {
    text = "You are on Level 1"
  } else
  if (trackLevel.level == 2) {
  text = "Completed Level 1. Start Level 2"
  } else
  if (trackLevel.level == 3) {
  text = "Finished Level 1. You are on Level 2"
  } else
  if (trackLevel.level == 4) {
        text = "Completed Level 1 and Level 2. Start Quiz"
  } else
  if (trackLevel.level == 5) {
        text = "You are solving quiz"
  } else if (trackLevel.level == 6) {
                 text = "Quiz Completed"
           } else {
  text = "Error"
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
     <Text>{text}</Text>
    </View>
  );
}

let spanishWords = [];

get(child(dbRef, `Spanish/`))
  .then((snapshot) => {
    spanishWords = snapshot.val();
  })
  .catch((error) => {
    console.error('Error reading data:', error);
  });

// const spanish = {
//   level1: [
//     { id: 1, word: 'hola', translation: 'hello' },
//     { id: 2, word: 'adiós', translation: 'goodbye' },
//   ],
//   level2: [
//     { id: 1, word: 'amigo', translation: 'friend' },
//     { id: 2, word: 'gracias', translation: 'thank you' },
//   ],
// };
//  set(ref(getDatabase(), 'Spanish/'), spanish);

function Level1({ navigation }) {

const words = spanishWords["level1"];

const route = useRoute()
const subEmail = route.params?.subEmail
let trackLevel = route.params?.trackLevel
const path = 'Users/' + subEmail;

  const handleLevel = async () => {
  if (trackLevel.level == 1) {
    trackLevel = {
                        level : 2
                      }
          set(ref(getDatabase(), path), trackLevel);
          }

  get(child(dbRef, `Users/${subEmail}`))
    .then((snapshot) => {
      trackLevel = snapshot.val();
      navigation.navigate('Levels', { trackLevel: trackLevel , subEmail: subEmail});
    })
    .catch((error) => {
      console.error('Error reading data:', error);
    });
  };

    return (
      <View>
        {words.map(word => (
          <Flashcard key={word.id} word={word.word} translation={word.translation} />
        ))}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Button
            title="Complete Level 1"
            onPress={handleLevel}
          />
        </View>
      </View>
    );
}

function Level2({ navigation }) {
  const words = spanishWords["level2"];
  const route = useRoute()
  const subEmail = route.params?.subEmail
  let trackLevel = route.params?.trackLevel
  const path = 'Users/' + subEmail

const handleLevel = async () => {
if (trackLevel.level == 3) {
  trackLevel = {
                      level : 4
                    }
        set(ref(getDatabase(), path), trackLevel);
        }

get(child(dbRef, `Users/${subEmail}`))
  .then((snapshot) => {
    trackLevel = snapshot.val();
    navigation.navigate('Levels', { trackLevel: trackLevel , subEmail: subEmail});
  })
  .catch((error) => {
    console.error('Error reading data:', error);
  });
};

    return (
      <View>
        {words.map(word => (
                <Flashcard key={word.id} word={word.word} translation={word.translation} />
        ))}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Button
            title="Complete Level 2"
            onPress={handleLevel}
          />
        </View>
      </View>
    );
}

let questions = [];

get(child(dbRef, `Questions/`))
  .then((snapshot) => {
    questions = snapshot.val();
  })
  .catch((error) => {
    console.error('Error reading data:', error);
  });

// const question = [
//     {
//       question: 'What is the capital of France?',
//       options: ['Paris', 'London', 'Berlin', 'Madrid'],
//       correctAnswer: 'Paris'
//     },
//     {
//       question: 'Which planet is known as the Red Planet?',
//       options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
//       correctAnswer: 'Mars'
//     },
//     {
//       question: 'Who wrote the famous play "Romeo and Juliet"?',
//       options: ['William Shakespeare', 'Jane Austen', 'Charles Dickens', 'Mark Twain'],
//       correctAnswer: 'William Shakespeare'
//     }
//   ];
//  set(ref(getDatabase(), 'Questions/'), question);

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

  const route = useRoute()
  const subEmail = route.params?.subEmail
  let trackLevel = route.params?.trackLevel

  const handleLevels = async () => {

              get(child(dbRef, `Users/${subEmail}`))
                .then((snapshot) => {
                  trackLevel = snapshot.val();
                  navigation.navigate('Levels', { trackLevel: trackLevel , subEmail: subEmail});
                })
                .catch((error) => {
                  console.error('Error reading data:', error);
                });
      };

      const path = 'Users/' + subEmail;
          const handleLast = async () => {
          if (trackLevel.level == 5) {
          trackLevel = {
                                level : 6
                              }
                set(ref(getDatabase(), path), trackLevel);
                }

          };

          useEffect(() => {
              if (quizCompleted) {
                handleLast();
              }
            }, [quizCompleted]);

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
          <Button title="Back" onPress={handleLevels} />
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

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SelectLanguage" component={SelectLanguage} />
        <Stack.Screen name="Levels" component={Levels} />
        <Stack.Screen name="TrackProgress" component={TrackProgress} />
        <Stack.Screen name="Level1" component={Level1} />
        <Stack.Screen name="Level2" component={Level2} />
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