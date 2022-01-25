import { useEffect, useState } from "react";
import { Text, TextInput, View, Image, StyleSheet, Button } from "react-native";
import { auth } from "../firebase";
import { updateEmail, updateProfile } from "firebase/auth";
import * as Location from "expo-location";
//To be careful when contacting database, user object occurs twice, once in authentication (can this be updated?) and once in Firestore database

const UserAccount = () => {
  const [location, setLocation] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);
  const [user, setUser] = useState({
    email: auth.currentUser.email,
    name: auth.currentUser.displayName,
    phoneNumber: auth.currentUser.phoneNumber,
    avatar: auth.currentUser.photoURL,
    transport: "car", //would have to get transport method from database here
    coords: { lat: 0, long: 0 },
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Location permissions not granted");
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      if (location) {
        setUser((prevUser) => {
          return {
            ...prevUser,
            coords: {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            },
          };
        });
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>My last known position:</Text>
      <Text>
        {errorMsg
          ? errorMsg
          : `latitude ${location.coords.latitude} : longitude ${location.coords.longitude}`}
      </Text>
      <Text style={styles.heading}>Email</Text>
      <TextInput
        value={user.email}
        style={styles.input}
        onChangeText={(text) => {
          setUser((prevUser) => {
            return { ...prevUser, email: text };
          });
        }}
      />

      <Text style={styles.heading}>Name</Text>
      <TextInput
        value={user.name}
        placeholder={"Update Me!"}
        styles={styles.input}
        onChangeText={(text) => {
          setUser((prevUser) => {
            return { ...prevUser, name: text };
          });
        }}
      />

      <Text style={styles.heading}>Avatar</Text>
      {user.avatar ? (
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
      ) : (
        <Text>No Avatar Currently</Text>
      )}
      <TextInput
        value={user.avatar}
        placeholder={"Update Me!"}
        onChangeText={(text) => {
          setUser((prevUser) => {
            return { ...prevUser, avatar: text };
          });
        }}
        style={styles.input}
      />
      <Text style={styles.heading}>Default Transport</Text>
      <TextInput
        placeholder={"Update Me!"}
        value={user.transport}
        onChangeText={(text) => {
          setUser((prevUser) => {
            return { ...prevUser, transport: text };
          });
        }}
        style={styles.input}
      />
      <Button
        title="Submit"
        onPress={() => {
          updateProfile(auth.currentUser, {
            displayName: user.name,
            photoURL: user.avatar,
          })
            .then(
              updateEmail(auth.currentUser, user.email)
                .then(() => alert("Details updated")) //display alert saying details updated?
                .catch((error) => {
                  alert(error.message);
                })
            )
            .catch((error) => alert(error.message));
        }}
      />
    </View>
  );
};

export default UserAccount;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#323B57",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textDecorationColor: "#676766",
    fontFamily: "monospace",
  },
  heading: {
    fontSize: 20,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    fontSize: 18,
    minWidth: "80%",
    flexWrap: "wrap",
  },
  avatar: {
    height: 100,
    width: 100,
  },
});
