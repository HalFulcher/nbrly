import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, FormGroup, Input } from 'reactstrap';
// import { Link } from "react-router-dom";
import 'firebase/auth';
import CheckBox from '../CheckBox';
import { firebase, db } from '../../index';
import interests from '../../lib/interests';

const Banner = styled.div`
  display: flex;
  width: 50%;
  // border: 1px solid red;
  justify-content: center;
`;

const ImgIcon = styled.img`
  display: flex;
  width: 81px;
  height: 91px;

  top: 0px;
  @media screen and (max-width: 960px) {
    left: 300px;
  }
  @media screen and (max-width: 460px) {
    left: 160px;
  }
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  margin-top: 40px;
`;

const UploadImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  padding: 20px;
  margin-left: 5rem;
  //order: 1px solid red;
`;

const ProfileImg = styled.img`
  width: 60%;
`;

const FormContainer = styled.div`
  width: 50%;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 960px;
  // padding: 10%;
  margin: auto;
  height: 100%;
`;

const Header = styled.div`
  color: white;
  font-size: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: bold;
  text-decoration: none;

  left: 706px;
  top: 13px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
`;



const InterestsDiv = styled.div`
  width: 100%;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const CheckboxesWrap = styled.div`
  display: grid;
  width: calc((30px + 140px) *5)
  margin: 0 auto;
  grid-template-columns: repeat(5, 30px 140px);
  justify-items: start;
`;

const Label = styled.label``;

const SubHeading = styled.h5`
  align-self: flex-start;
  padding: 10px 0px 10px 0px;
`;

const Button = styled.button`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  width: 100%;
  max-width: 330px;
  margin-top: 20px;
  margin-bottom: 50px;
  height: 54px;
  background: #ffb800;
  border: 0.5px solid #000000;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
  box-shadow: 0 8px 16px rgb(38 38 48 / 20%);
`;

const SignUp = () => {
  const initialState = {
    fields: {
      firstName: '',
      lastName: '',
      age: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      aboutMe: '',
    },
    checkedItems: interests.map((interest) => {
      return { value: interest, isChecked: false };
    }),
  };

  const [fields, setFields] = useState(initialState.fields);
  const [checkedItems, setCheckedItems] = useState(initialState.checkedItems);

  const handleSubmit = (event) => {
    event.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(fields.email, fields.password)
      .then((userCredential) => {
        const uid = userCredential.user.uid;
        const userDocRef = firebase.firestore().collection('users').doc(uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
      });
  };

  const handleFieldChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleBoxChange = (event) => {
    const { name, defaultChecked } = event.target;
    console.log(checkedItems);
    if (defaultChecked) {
      setCheckedItems((items) => {
        items.find((item) => item.value === name).isChecked = false;
        return [...items];
      });
    } else {
      setCheckedItems((items) => {
        items.find((item) => item.value === name).isChecked = true;
        return [...items];
      });
    }
  };

  const checkboxes = interests.map((interest) => {
    return (
      <CheckBox
        key={interest}
        name={interest}
        onChange={handleBoxChange}
        defaultChecked={
          checkedItems.find((item) => item.value === interest).isChecked
        }
      />
    );
  });
  return (
    <LoginForm>
      <Banner>
        <ImgIcon src="../images/Mess3.png" alt="navbar-logo" />
        <Header>NBRLY</Header>
      </Banner>
      <MainContainer>
        <UploadImageContainer>
          <ProfileImg
            src="../images/profileplaceholder.png"
            alt="profile-picture"
          />
          <Button onClick={handleSubmit}>Upload Image</Button>
        </UploadImageContainer>

        <FormContainer>
          <FormGroup>
            <Label for="firstname">First Name</Label>
            <Input
              id="firstname"
              name="firstName"
              type="firstName"
              placeholder="What should people call you?"
              value={fields.firstName}
              onChange={handleFieldChange}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label for="lastname">Last Name</Label>
            <Input
              id="lastname"
              name="lastName"
              placeholder="Your family name"
              value={fields.lastName}
              onChange={handleFieldChange}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label for="age">Age</Label>
            <Input
              id="age"
              name="age"
              placeholder="36"
              value={fields.age}
              onChange={handleFieldChange}
            ></Input>
          </FormGroup>

          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="joe@bloggs.com"
              value={fields.email}
              onChange={handleFieldChange}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label for="confirm-email">Confirm Email</Label>
            <Input
              id="confirm-email"
              name="confirm-email"
              type="email"
              placeholder="Please type your email again"
              value={fields.confirmEmail}
              onChange={handleFieldChange}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Choose a strong password"
              value={fields.password}
              onChange={handleFieldChange}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label for="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder="Please type your password again"
              value={fields.confirmPassword}
              onChange={handleFieldChange}
            ></Input>
          </FormGroup>
        </FormContainer>
      </MainContainer>

      <SubHeading>Interests</SubHeading>
      <InterestsDiv>
        <CheckboxesWrap>{checkboxes}</CheckboxesWrap>
      </InterestsDiv>

      <SubHeading>About Me</SubHeading>
      <Input
        name="aboutMe"
        style={{ width: '100%', height: '100%', marginBottom: '30px' }}
        type="textarea"
        placeholder="Introduce yourself!"
        value={fields.aboutMe}
        onChange={handleFieldChange}
      ></Input>
      <Button onClick={handleSubmit}>Create Profile</Button>

      {/* <Link to="/Signup"> */}
    </LoginForm>
  );
};

export default SignUp;
