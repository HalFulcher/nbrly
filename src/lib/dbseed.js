const admin = require("firebase-admin");
const faker = require("faker");
const geofire = require("geofire-common");
const randomLocation = require("random-location");
const projectId = "nbrly-e50b3";
admin.initializeApp({ projectId });
const { db } = require("../Firebase.js");

const interests = [
    'fight club',
    'hiking',
    'walking',
    'partying',
    'museums',
    'galleries',
    'extreme sports',
    'tennis',
    'running',
    'cycling',
    'badminton',
    'table tennis',
    'board games',
    'eating out',
    'coffee',
    'beer',
    'urban exploring',
    'pokemon go',
    'cinema',
    'cocktails',
    'frisbee',
    'park hang',
    'picnic',
    'disc golf',
    'arts and crafts',
    'bowling',
    'cheese rolling',
    'shopping',
    'theme parks',
    'tea ceremonies',
    'gong baths',
    'yoga',
    'cooking',
    'live music'
  ];

const getInterests = () => {
  const userInterests = [];
  for (i = 0; i < 10; i++) {
    let index = Math.floor(Math.random() * interests.length );
    console.log(index, interests[index])
    if (!userInterests.includes(interests[index])){
      userInterests.push(interests[index]);
  }
}
  return userInterests;
};

const getLocation = () => {
  const userLocation = randomLocation.randomCirclePoint(
    {
      latitude: 53.483959,
      longitude: -2.244644,
    },
    15000
  );

  const hash = geofire.geohashForLocation([
    userLocation.latitude,
    userLocation.longitude,
  ]);
  return { ...userLocation, hash };
};

//we want an object that has the hash
//that returns the hash location + lat and Lng location
const batch = db.batch();

function getSeedData() {
    console.log(getInterests())
  try {
    [...Array(10).keys()].map(() => {
      const location = getLocation();
      return db.collection("users").add({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        age: Math.floor(Math.random() * 100),
        aboutMe: faker.lorem.paragraph(),
        interests: getInterests(),
        geohash: location.hash,
        latitude: location.latitude,
        longitude: location.longitude,
        email: faker.internet.email(),
        password: faker.internet.password(),
        profileImg: faker.image.imageUrl(),
      });
    });

    console.log("database seed was successful");
  } catch (error) {
    console.log(error, "database seed failed");
  }
}
getSeedData();
