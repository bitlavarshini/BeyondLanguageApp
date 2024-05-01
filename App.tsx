import React, { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  Objects,
} from "react-native";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, get, child, set, onValue } from "firebase/database";
import Flashcard from "./Flashcard";

const firebaseConfig = {
  // Firebase Configuration
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const dbRef = ref(getDatabase());

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require("./logo.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome to Beyond Language</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AdminSignIn")}
      >
        <Text style={styles.buttonText}>Admin Login</Text>
      </TouchableOpacity>
    </View>
  );
}

function SignUp({ navigation }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userEmail = user.email;
        const subEmail = userEmail.match(/^(.*?)(?=@)/)[0];
        let trackLevel = {
          level: 0,
        };
        const path = "Users/" + subEmail;

        set(ref(getDatabase(), path), trackLevel);
        navigation.navigate("SignIn");
        Alert.alert("Sign Up Successful");
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Error" + errorMessage);
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
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

function SignIn({ navigation }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userEmail = user.email;
        const subEmail = userEmail.match(/^(.*?)(?=@)/)[0];

        get(child(dbRef, `Users/${subEmail}`))
          .then((snapshot) => {
            let trackLevel = snapshot.val();
            navigation.navigate("SelectLanguage", {
              trackLevel: trackLevel,
              subEmail: subEmail,
            });
          })
          .catch((error) => {
            console.error("Error reading data:", error);
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Error" + errorMessage);
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
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

function AdminSignIn({ navigation }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        get(child(dbRef, `Requests/`))
          .then((snapshot) => {
            let requests = snapshot.val();
            navigation.navigate("Requests", {
              requests: requests
            });
          })
          .catch((error) => {
            console.error("Error reading data:", error);
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Error" + errorMessage);
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
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

function Requests({ navigation }) {

  const accept = async () => {
let request = {
                    request: "accept",
                  };
                  const path = "Requests/" + "user";

                  set(ref(getDatabase(), path), request);
                  Alert.alert("The user will be notified about the decision.");
  };

  const deny = async () => {
  let request = {
                      request: "deny",
                    };
                    const path = "Requests/" + "user";

                    set(ref(getDatabase(), path), request);
                    Alert.alert("The user will be notified about the decision.");
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Email: user@gmail.com</Text>
    <Text style={styles.title}>This user requested permission to access Premium Levels</Text>
      <TouchableOpacity style={styles.button} onPress={accept}>
        <Text style={styles.buttonText}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={deny}>
              <Text style={styles.buttonText}>Deny</Text>
            </TouchableOpacity>
    </View>
  );
}

function SelectLanguage({ navigation }) {
  const route = useRoute();
  let trackLevel = route.params?.trackLevel;
  const subEmail = route.params?.subEmail;

  const trackProgress = async () => {
    get(child(dbRef, `Users/${subEmail}`))
      .then((snapshot) => {
        trackLevel = snapshot.val();
        console.log(trackLevel);
        if (trackLevel.level == 0) {
          navigation.navigate("GetUserInfo", {
            trackLevel: trackLevel,
            subEmail: subEmail,
          });
        } else {
          navigation.navigate("Levels", {
            trackLevel: trackLevel,
            subEmail: subEmail,
          });
        }
      })
      .catch((error) => {
        console.error("Error reading data:", error);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={trackProgress}>
        <Text style={styles.buttonText}>Spanish</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>French</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>German</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Hindi</Text>
      </TouchableOpacity>
    </View>
  );
}

let questionnaire = [];

get(child(dbRef, `Questionnaire/`))
  .then((snapshot) => {
    questionnaire = snapshot.val();
  })
  .catch((error) => {
    console.error("Error reading data:", error);
  });

let questionnaireSelected = [];
function GetUserInfo({ navigation }) {
  const route = useRoute();
  const subEmail = route.params?.subEmail;
  let trackLevel = route.params?.trackLevel;
  const path = "UsersData/" + subEmail;

  const [quizCompleted, setQuizCompleted] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswer = (selectedOption) => {
    const currentQuestion = questionnaire[currentQuestionIndex];
    const cq = currentQuestion.question;
    questionnaireSelected.push({ cq, selectedOption });

    if (currentQuestionIndex === questionnaire.length - 1) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleLast = async () => {
    set(ref(getDatabase(), path), questionnaireSelected);
    questionnaireSelected = [];
    if (trackLevel.level == 0) {
      trackLevel = {
        level: 1,
      };
      set(ref(getDatabase(), "Users/" + subEmail), trackLevel);
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
          <View style={styles.optionsContainer}>
            <Text style={styles.questionNumber}>
              Question {currentQuestionIndex + 1}
            </Text>
            <Text style={styles.questionText}>
              {questionnaire[currentQuestionIndex].question}
            </Text>
            {questionnaire[currentQuestionIndex].options.map(
              (option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      ) : (
        <View style={styles.completedContainer}>
          <Text style={styles.completedText}>
            Congratulations! You completed the questionnaire.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("Levels", {
                trackLevel: trackLevel,
                subEmail: subEmail,
              })
            }
          >
            <Text style={styles.buttonText}>Proceed to Exercises</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function Levels({ navigation }) {
  const route = useRoute();
  const subEmail = route.params?.subEmail;
  let trackLevel = route.params?.trackLevel;
  const path = "Users/" + subEmail;
  const handleLevel1 = async () => {
    if (trackLevel.level == 1) {
      trackLevel = {
        level: 2,
      };
      set(ref(getDatabase(), path), trackLevel);
    }
    navigation.navigate("Level1", {
      trackLevel: trackLevel,
      subEmail: subEmail,
    });
  };

  const handleLevel2 = async () => {
    if (trackLevel.level == 3) {
      trackLevel = {
        level: 4,
      };
      set(ref(getDatabase(), path), trackLevel);
    }
    navigation.navigate("Level2", {
      trackLevel: trackLevel,
      subEmail: subEmail,
    });
  };

  const handleQuiz = async () => {
    if (trackLevel.level == 5) {
      trackLevel = {
        level: 6,
      };
      set(ref(getDatabase(), path), trackLevel);
    }
    navigation.navigate("Quiz", { trackLevel: trackLevel, subEmail: subEmail });
  };

  const trackProgress = async () => {
    get(child(dbRef, `Users/${subEmail}`))
      .then((snapshot) => {
        trackLevel = snapshot.val();
        navigation.navigate("TrackProgress", {
          trackLevel: trackLevel,
          subEmail: subEmail,
        });
      })
      .catch((error) => {
        console.error("Error reading data:", error);
      });
  };

  const premiumLevels = async () => {
                 let request = {
                    request: "pending",
                  };
                  const path = "Requests/" + "user";

                  set(ref(getDatabase(), path), request);
          Alert.alert("Request sent to Admin. You can gain access if the admin accepts your request.");
    };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Please Select Your Level</Text>
      <TouchableOpacity style={styles.button} onPress={handleLevel1}>
        <Text style={styles.buttonText}>Level1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, trackLevel.level < 2 && styles.disabledButton]}
        onPress={handleLevel2}
        disabled={trackLevel.level < 2}
      >
        <Text style={styles.buttonText}>Level2</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, trackLevel.level < 4 && styles.disabledButton]}
        onPress={handleQuiz}
        disabled={trackLevel.level < 4}
      >
        <Text style={styles.buttonText}>Start Quiz</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={trackProgress}>
        <Text style={styles.buttonText}>Track Progress</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={premiumLevels}>
        <Text style={styles.buttonText}>Premium Levels</Text>
      </TouchableOpacity>
    </View>
  );
}

function TrackProgress({ navigation }) {
  const route = useRoute();
  let trackLevel = route.params?.trackLevel;
  const subEmail = route.params?.subEmail;
  let text = null;
  if (trackLevel.level == 1) {
    text = "Didn't make any progress yet, Please start practicing levels";
  } else if (trackLevel.level == 2) {
    text = "You are on Level 1";
  } else if (trackLevel.level == 3) {
    text = "Completed Level 1. Start Level 2";
  } else if (trackLevel.level == 4) {
    text = "Finished Level 1. You are on Level 2";
  } else if (trackLevel.level == 5) {
    text = "Completed Level 1 and Level 2. Start Quiz";
  } else if (trackLevel.level == 6) {
    text = "You are solving quiz";
  } else if (trackLevel.level == 7) {
    text = "Quiz Completed";
  } else {
    text = "Error";
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{text}</Text>
    </View>
  );
}

let spanishWords = [];

get(child(dbRef, `Spanish/`))
  .then((snapshot) => {
    spanishWords = snapshot.val();
  })
  .catch((error) => {
    console.error("Error reading data:", error);
  });

function Level1({ navigation }) {
  const words = spanishWords["level1"];

  const route = useRoute();
  const subEmail = route.params?.subEmail;
  let trackLevel = route.params?.trackLevel;
  const path = "Users/" + subEmail;

  const handleLevel = async () => {
    if (trackLevel.level == 2) {
      trackLevel = {
        level: 3,
      };
      set(ref(getDatabase(), path), trackLevel);
    }

    get(child(dbRef, `Users/${subEmail}`))
      .then((snapshot) => {
        trackLevel = snapshot.val();
        navigation.navigate("Levels", {
          trackLevel: trackLevel,
          subEmail: subEmail,
        });
      })
      .catch((error) => {
        console.error("Error reading data:", error);
      });
  };
  const numRows = Math.ceil(words.length / 2);

  const rows = Array.from({ length: numRows }, (_, index) =>
    words.slice(index * 2, (index + 1) * 2)
  );

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((word) => (
            <Flashcard
              key={word.id}
              word={word.word}
              translation={word.translation}
            />
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
  const route = useRoute();
  const subEmail = route.params?.subEmail;
  let trackLevel = route.params?.trackLevel;
  const path = "Users/" + subEmail;

  const handleLevel = async () => {
    if (trackLevel.level == 4) {
      trackLevel = {
        level: 5,
      };
      set(ref(getDatabase(), path), trackLevel);
    }

    get(child(dbRef, `Users/${subEmail}`))
      .then((snapshot) => {
        trackLevel = snapshot.val();
        navigation.navigate("Levels", {
          trackLevel: trackLevel,
          subEmail: subEmail,
        });
      })
      .catch((error) => {
        console.error("Error reading data:", error);
      });
  };

  const numRows = Math.ceil(words.length / 2);

  const rows = Array.from({ length: numRows }, (_, index) =>
    words.slice(index * 2, (index + 1) * 2)
  );

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((word) => (
            <Flashcard
              key={word.id}
              word={word.word}
              translation={word.translation}
            />
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

get(child(dbRef, `Questions/`))
  .then((snapshot) => {
    questions = snapshot.val();
  })
  .catch((error) => {
    console.error("Error reading data:", error);
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
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const route = useRoute();
  const subEmail = route.params?.subEmail;
  let trackLevel = route.params?.trackLevel;

  const handleLevels = async () => {
    get(child(dbRef, `Users/${subEmail}`))
      .then((snapshot) => {
        trackLevel = snapshot.val();
        navigation.navigate("Levels", {
          trackLevel: trackLevel,
          subEmail: subEmail,
        });
      })
      .catch((error) => {
        console.error("Error reading data:", error);
      });
  };

  const path = "Users/" + subEmail;
  const handleLast = async () => {
    if (trackLevel.level == 6) {
      trackLevel = {
        level: 7,
      };
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
          <View style={styles.optionsContainer}>
            <Text style={styles.questionNumber}>
              Question {currentQuestionIndex + 1}
            </Text>
            <Text style={styles.questionText}>
              {questions[currentQuestionIndex].question}
            </Text>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.button} onPress={handleLevels}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.completedContainer}>
          <Text style={styles.completedText}>
            Congratulations! You completed the quiz.
          </Text>
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
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#c87449",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="AdminSignIn" component={AdminSignIn} />
        <Stack.Screen name="Requests" component={Requests} />
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
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#c87449",
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#000",
    marginBottom: 10,
  },
  logo: {
    marginTop: 0,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e7c4b2",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  button: {
    marginVertical: 10,
    width: "80%",
    backgroundColor: "#c87449",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#000",
  },
  disabledButton: {
    backgroundColor: "#efd8cc",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 20,
    marginBottom: 10,
    color: "black",
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    color: "black",
  },
  optionsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e7c4b2",
    padding: 20,
  },
  optionButton: {
    marginVertical: 10,
    width: "80%",
    backgroundColor: "#efd8cc",
    padding: 10,
    borderRadius: 0,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  optionText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  completedContainer: {
    alignItems: "center",
  },
  completedText: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "black",
  },
  scoreText: {
    fontSize: 18,
    textAlign: "center",
    color: "black",
  },
});

export default App;
