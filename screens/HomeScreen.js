import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ScrollView,
  ImageBackground,
} from "react-native";
import { auth } from "../firebase";
// import NavBar from "../Components/NavBar";
import InviteTest from "../Components/InviteTest";
import { ThemeContext, UserContext } from "../Context/Context";
import UserMenu2 from "../Components/UserMenu2";
import ViewMyGroups from "../Components/ViewMyGroups";
import Nav from "../Components/Nav";

const HomeScreen = () => {
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const { user, setUser, groups, setGroups } = useContext(UserContext);

  useEffect(() => {
    console.log("homepage render", groups);
  }, [groups]);

  const geoLoc = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Location permissions not granted");
    }
    let location = await Location.getCurrentPositionAsync({});
    if (location) {
      setCoords({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    }
  };

  return (
    <>
      <ImageBackground
        source={require("../assets/bdropweak.png")}
        resizeMode="cover"
        style={{ height: "100%", justifyContent: "center" }}
      >
        <View style={theme.homeContainer2}>
          <View style={{ width: "90%" }}>
            <Text style={theme.header}>Welcome {user.name}</Text>
          </View>
          <View>
            <Text style={[theme.header2, { fontWeight: "bold" }]}>Invites</Text>
            <InviteTest />
            <Button title="GEO!" onPress={geoLoc} />
            <Text>{`lat:${coords.lat}  long:${coords.long}`}</Text>
            <Text style={[theme.header2, { fontWeight: "bold" }]}>
              My Groups
            </Text>
            <ViewMyGroups />
          </View>
          <Nav type={"home"} />
          <UserMenu2 />
        </View>
      </ImageBackground>
    </>
  );
};

export default HomeScreen;
