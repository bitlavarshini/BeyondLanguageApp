import React, { useState, useEffect } from 'react';
import { TextInput, Button, View, Text, TouchableOpacity, StyleSheet, Alert, Objects } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, get, child, set, onValue } from "firebase/database";
import Flashcard from './Flashcard'

const firebaseConfig = {
  // Todo : Add Firebase Config
  apiKey: "AIzaSyDEqdbd6EMmMgEQMhzvBL-PD87q-3XTDSA",
                          authDomain: "beyondlanguageapp-421322.firebaseapp.com",
                          projectId: "beyondlanguageapp-421322",
                          storageBucket: "beyondlanguageapp-421322.appspot.com",
                          messagingSenderId: "426969717416",
                          appId: "1:426969717416:web:a4faf72b8235381bde009d",
                          databaseUrl: "https://beyondlanguageapp-421322-default-rtdb.firebaseio.com/"

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
                console.log(trackLevel)
                if (trackLevel.level == 0) {
                navigation.navigate('GetUserInfo', { trackLevel: trackLevel, subEmail: subEmail})
                } else {
                navigation.navigate('Levels', { trackLevel: trackLevel, subEmail: subEmail})
                }
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

// const questionnaire = [
//     {
//       question: 'What is your current proficiency?',
//       options: ['Beginner', 'Intermediate', 'Expert'],
//     },
//     {
//       question: 'What is your motivation?',
//       options: ['School or Exam', 'Family/Friends or Community', 'Career or Business', 'Travel'],
//     },
//     {
//       question: 'What is your age?',
//       options: ['under 18', '18-25', '25-40', '40+'],
//     }
//   ];
// set(ref(getDatabase(), 'Questionnaire/'), questionnaire);

let questionnaire = [];

get(child(dbRef, `Questionnaire/`))
  .then((snapshot) => {
    questionnaire = snapshot.val();
  })
  .catch((error) => {
    console.error('Error reading data:', error);
  });

let questionnaireSelected = []
function GetUserInfo({ navigation }) {
const route = useRoute()
  const subEmail = route.params?.subEmail
  let trackLevel = route.params?.trackLevel
  const path = 'UsersData/' + subEmail;

  const [quizCompleted, setQuizCompleted] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswer = (selectedOption) => {
    const currentQuestion = questionnaire[currentQuestionIndex];
    const cq = currentQuestion.question
    questionnaireSelected.push({cq, selectedOption})


    if (currentQuestionIndex === questionnaire.length - 1) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

          const handleLast = async () => {
                set(ref(getDatabase(), path), questionnaireSelected);
                questionnaireSelected = []
                if (trackLevel.level == 0) {
                    trackLevel = {
                                          level : 1
                                        }
                          set(ref(getDatabase(), 'Users/' + subEmail), trackLevel);
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
          <Text>{questionnaire[currentQuestionIndex].question}</Text>
          {questionnaire[currentQuestionIndex].options.map((option, index) => (
            <TouchableOpacity key={index} onPress={() => handleAnswer(option)}>
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        ) : (
        <View>
                                  <Text>Congratulations! You completed the questionnaire.</Text>
                                                     <Button title="Proceed to Exercises"
                                                     onPress={() => navigation.navigate('Levels', { trackLevel: trackLevel, subEmail: subEmail})}/>
                                </View>
      )}
    </View>
  );
}

function Levels({ navigation }) {
const route = useRoute()
const subEmail = route.params?.subEmail
  let trackLevel = route.params?.trackLevel
const path = 'Users/' + subEmail;
    const handleLevel1 = async () => {
    if (trackLevel.level == 1) {
    trackLevel = {
                          level : 2
                        }
          set(ref(getDatabase(), path), trackLevel);
          }
          navigation.navigate('Level1', { trackLevel: trackLevel , subEmail: subEmail})
    };

    const handleLevel2 = async () => {
    if(trackLevel.level == 3) {
        trackLevel = {
                              level : 4
                            }
              set(ref(getDatabase(), path), trackLevel);
              }
              navigation.navigate('Level2', { trackLevel: trackLevel , subEmail: subEmail})
        };

        const handleQuiz = async () => {
            if(trackLevel.level == 5) {
                trackLevel = {
                                      level : 6
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
      <View style={styles.container}>
        <Text style={styles.header}>Please Select Your Level</Text>
        <TouchableOpacity style={styles.button} onPress={handleLevel1}>
          <Text style={styles.buttonText}>Level 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, trackLevel.level < 2 && styles.disabledButton]} onPress={handleLevel2} disabled={trackLevel.level < 2}>
          <Text style={styles.buttonText}>Level 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, trackLevel.level < 4 && styles.disabledButton]} onPress={handleQuiz} disabled={trackLevel.level < 4}>
          <Text style={styles.buttonText}>Start Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={trackProgress}>
          <Text style={styles.buttonText}>Track Progress</Text>
        </TouchableOpacity>
      </View>
    );
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Button
//         title="Level1"
//         onPress={handleLevel1}
//       />
//       <Button
//         title="Level2"
//         onPress={handleLevel2}
//          disabled={trackLevel.level < 2}
//       />
//       <Button
//         title="Start Quiz"
//         onPress={handleQuiz}
//         disabled={trackLevel.level < 4}
//       />
//       <Button title="Track Progress" onPress={trackProgress} />
//     </View>
//   );
}

function TrackProgress({ navigation }) {
const route = useRoute()
let trackLevel = route.params?.trackLevel
const subEmail = route.params?.subEmail
let text = null;
  if (trackLevel.level == 1) {
    text = "Didn't Make Any Progress Yet, Please Start Practicing Levels"
  } else
  if (trackLevel.level == 2) {
    text = "You are on Level 1"
  } else
  if (trackLevel.level == 3) {
  text = "Completed Level 1. Start Level 2"
  } else
  if (trackLevel.level == 4) {
  text = "Finished Level 1. You are on Level 2"
  } else
  if (trackLevel.level == 5) {
        text = "Completed Level 1 and Level 2. Start Quiz"
  } else
  if (trackLevel.level == 6) {
        text = "You are solving quiz"
  } else if (trackLevel.level == 7) {
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
//                       level1: [
//                         { id: 1, word: 'Hola', translation: 'Hello' },
//                         { id: 2, word: 'Casa', translation: 'House' },
//                    	 { id: 3, word: 'Perro', translation: 'Dog' },
//                    	 { id: 4, word: 'Gato', translation: 'Cat' },
//                         { id: 5, word: 'Comida', translation: 'Food' },
//                    	 { id: 6, word: 'Agua', translation: 'Water' },
//                    	 { id: 7, word: 'Amigo', translation: 'Friend' },
//                       ],
//                       level2: [
//                         { id: 1, word: 'Viaje', translation: 'Trip' },
//                         { id: 2, word: 'Felicidad', translation: 'Happiness' },
//                    	 { id: 3, word: 'Trabajo', translation: 'Work' },
//                         { id: 4, word: 'Pasatiempo', translation: 'Hobby' },
//                    	 { id: 5, word: 'Música', translation: 'Music' },
//                         { id: 6, word: 'Naturaleza', translation: 'Nature' },
//                    	 { id: 7, word: 'Familia', translation: 'Family' },
//                       ],
//                    };
//  set(ref(getDatabase(), 'Spanish/'), spanish);

function Level1({ navigation }) {

const words = spanishWords["level1"];

const route = useRoute()
const subEmail = route.params?.subEmail
let trackLevel = route.params?.trackLevel
const path = 'Users/' + subEmail;

  const handleLevel = async () => {
  if (trackLevel.level == 2) {
    trackLevel = {
                        level : 3
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
  const numRows = Math.ceil(words.length / 2);

  // Create an array of arrays where each inner array represents a row of flashcards
    const rows = Array.from({ length: numRows }, (_, index) =>
        words.slice(index * 2, (index + 1) * 2)
    );
return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map(word => (
            <Flashcard key={word.id} word={word.word} translation={word.translation} />
          ))}
        </View>
      ))}
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleLevel}>
            <Text style={styles.buttonText}>Complete Level 1</Text>
        </TouchableOpacity>
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
if (trackLevel.level == 4) {
  trackLevel = {
                      level : 5
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
const numRows = Math.ceil(words.length / 2);

  // Create an array of arrays where each inner array represents a row of flashcards
    const rows = Array.from({ length: numRows }, (_, index) =>
        words.slice(index * 2, (index + 1) * 2)
    );
return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map(word => (
            <Flashcard key={word.id} word={word.word} translation={word.translation} />
          ))}
        </View>
      ))}
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleLevel}>
            <Text style={styles.buttonText}>Complete Level 2</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

let questions = [];
// const question = [
//                         {
//                           question: 'What does "Agua" mean in English?',
//                           options: ['House', 'Food', 'Water', 'Friend'],
//                           correctAnswer: 'Water'
//                         },
//                         {
//                           question: 'Translate the word "Amigo" to English.',
//                           options: ['Dog', 'Friend', 'School', 'Happy'],
//                           correctAnswer: 'Friend'
//                         },
//                         {
//                           question: 'What does "Viaje" mean in English?',
//                           options: ['Work', 'Trip', 'Music', 'Adventure'],
//                           correctAnswer: 'Trip'
//                         },
//                     	{
//                           question: 'Translate the word "Felicidad" to English.',
//                           options: ['Nature', 'Happiness', 'Family', 'School'],
//                           correctAnswer: 'Happiness'
//                         },
//                     	{
//                           question: 'What does "Comida" mean in English?',
//                           options: ['Water', 'Food', 'Cat', 'Happy'],
//                           correctAnswer: 'Food'
//                         },
//                         {
//                           question: 'Translate the word "Trabajo" to English.',
//                           options: ['Work', 'Experience', 'Adventure', 'Future'],
//                           correctAnswer: 'Work'
//                         },
//                         {
//                           question: 'Translate the word "Jugar" to English.',
//                           options: ['To play', 'House', 'Friend', 'Nature'],
//                           correctAnswer: 'To play'
//                         },
//                     	{
//                           question: 'What does "Familia" mean in English?',
//                           options: ['Experience', 'Family', 'Music', 'Water'],
//                           correctAnswer: 'Family'
//                         },
//                     	{
//                           question: 'What does "Música" mean in English?',
//                           options: ['Happy', 'Music', 'School', 'Future'],
//                           correctAnswer: 'Music'
//                         },
//                     	{
//                           question: 'Translate the word "Gato" to English.',
//                           options: ['Cat', 'Dog', 'Adventure', 'Trip'],
//                           correctAnswer: 'Cat'
//                         },
//                     ];
//  set(ref(getDatabase(), 'Questions/'), question);

get(child(dbRef, `Questions/`))
  .then((snapshot) => {
    questions = snapshot.val();
  })
  .catch((error) => {
    console.error('Error reading data:', error);
  });



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
      setQuizCompleted(true)
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
          if (trackLevel.level == 6) {
          trackLevel = {
                                level : 7
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
    <View style={styles.container}>
      {!quizCompleted ? (
        <View>
          <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1}</Text>
          <Text style={styles.questionText}>{questions[currentQuestionIndex].question}</Text>
          <View style={styles.optionsContainer}>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLevels}>
                      <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.completedContainer}>
          <Text style={styles.completedText}>Congratulations! You completed the quiz.</Text>
          <Text style={styles.scoreText}>Your final score: {score}</Text>
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
        <Stack.Screen name="GetUserInfo" component={GetUserInfo} />
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
  header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
    },
    button: {
      backgroundColor: '#8080ff',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 6,
      marginVertical: 6,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  disabledButton: {
    backgroundColor: '#CCCCCC', // Lighter shade for disabled button
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: 20,
    },
    questionNumber: {
        fontSize: 20,
        marginBottom: 10,
      },
      questionText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
      },
      optionsContainer: {
        width: '100%',
        alignItems: 'center',
      },
      optionButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 6,
        marginVertical: 6,
      },
      optionText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      completedContainer: {
        alignItems: 'center',
      },
      completedText: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
      },
      scoreText: {
        fontSize: 18,
        textAlign: 'center',
      },
});

export default App;