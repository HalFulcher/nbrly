const faker = require('faker');
const geofire = require('geofire-common');
const randomLocation = require('random-location');
const { db } = require('../configFirebase.js');

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
  'live music',
];

const getInterests = () => {
  const userInterests = [];
  for (let i = 0; i <= 10; i++) {
    let index = Math.floor(Math.random() * interests.length);
    if (!userInterests.includes(interests[index])) {
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

function seedDatabase() {
  try {
    [...Array(10).keys()].map(() => {
      const location = getLocation();
      const profileData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        age: Math.floor(Math.random() * 100),
        aboutMe: faker.lorem.paragraph(),
        interests: getInterests(),
        geohash: location.hash,
        latitude: location.latitude,
        longitude: location.longitude,
      };
      const selectedFile = faker.image.imageUrl()
      const email = faker.internet.email()
      const password = faker.internet.password()
      return db.collection('users').add({
      

      });
    });

    console.log('database seed was successful');
  } catch (error) {
    console.log(error, 'database seed failed');
  }
}

seedDatabase();
