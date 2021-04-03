import { useState, useEffect } from "react";
import "../App.css";
import { Route, Switch, Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import "firebase/auth";
import { LocalConvenienceStoreOutlined } from "@material-ui/icons";
import { firebaseApp, db } from "../configFirebase.js";
import {
  getMatchedUsers,
  calculateDistance,
  sortByDistance,
} from "../helpers/getSearchResults";

const App = ({ history }) => {
  // const [isLoggedIn, setIsLoggedIn] = useState();
  const [geolocation, setGeolocation] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [orderedMatches, setOrderedMatches] = useState([]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = (email, password) => {
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCred) => {
        localStorage.setItem("token", userCred.user.refreshToken);
        history.push("/Home");
      })
      .catch((error) => console.log(error));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/");
  };

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
            navigator.geolocation.getCurrentPosition((position) => {
              console.log(position.coords.latitude);
              setGeolocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            });
          } else if (result.state === "prompt") {
            console.log(result.state);
            alert(
              "NBRLY needs your location to work. Please update your browser preferences."
            );
          } else if (result.state === "denied") {
            console.log(result.state);
            alert(
              "NBRLY needs your location to work. Please update your browser preferences."
            );
          }
        });
    } else {
      alert("Sorry, your browser is not compatible with NBRLY.");
    }
  };

  useEffect(() => {
    updateLocation();
  }, []);

  const getSearchResults = async (activity) => {
    if (!geolocation) {
      alert("Sorry, something went wrong. Please refresh your browser.");
      return;
    }

    const userList = await getMatchedUsers(activity);
    const userDistance = calculateDistance(geolocation, userList);
    const sortedMatches = sortByDistance(userDistance);
    setOrderedMatches(sortedMatches);
  };

  return (
    <div className="App">
      <SideBar isOpen={isOpen} toggle={toggle} handleLogout={handleLogout} />
      <NavBar toggle={toggle} handleLogout={handleLogout} />
      <Switch>
        <Route exact path="/">
          <Login handleLogin={handleLogin} />
        </Route>
        <Route exact path="/Home">
          <Home
            geolocation={geolocation}
            updateLocation={updateLocation}
            getSearchResults={getSearchResults}
            orderedMatches={orderedMatches}
          />
        </Route>
        <Route exact path="/Profile">
          <Profile />
        </Route>
        <Route exact path="/Signup">
          <Signup geolocation={geolocation} updateLocation={updateLocation} />
          {/* logIn={logIn} */}
        </Route>
      </Switch>

      <Footer />
    </div>
  );
};

export default withRouter(App);
