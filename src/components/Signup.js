// Login.js
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import Footer from './Footer';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { useCommonContext } from './CommonContext';
import { useNavigate } from 'react-router-dom';

const personas = ['Student', 'Faculty', 'Staff', 'Moderator', 'Administrator'];
const defaultTheme = createTheme();

const SignupComponent = () => {

  const { commonState, setCommonState } = useCommonContext();
  const navigate = useNavigate();

  const [selectedPersona, setSelectedPersona] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorSelectedPersona, setErrorSelectedPersona] = React.useState('');
  const [errorUserName, setErrorUserName] = React.useState('');
  const [errorPassword, setErrorPassword] = React.useState('');
  const [errorSignIn,setErrorSignIn] = React.useState('');

  React.useEffect(() => {


    
  }, [commonState.isLoggedIn]);

  const checkifUserExists = async (userName,password,selectedPersona) =>{
        // Mock server URL
      const serverUrl = 'http://localhost:3001/users';

      try {
        const response = await fetch(`${serverUrl}`);
  
        if (!response.ok) {
          throw new Error('Failed to sign in');
        }
  
        const users = await response.json();
        console.log(users);
        const foundUser = users.find((user) => user.userName === userName && user.password === password && user.selectedPersona === selectedPersona);
        console.log(foundUser);
        return foundUser;
      }
      catch (error) {
        console.error('Error signing in:', error);
      }

  };

  const handleSignUp = async () => {

    setErrorSignIn('');

    const serverUrl = 'http://localhost:3001/users';
    const status = "active";

    if (!selectedPersona) {
      setErrorSelectedPersona('Persona is required.');
      return;
    }
    if (!userName) {
      setErrorUserName('Username is required.');
      return;
    }
    if (!password) {
      setErrorPassword('Password is required.');
      return;
    }
    const newUser = {
      selectedPersona,
      userName,
      password,
      status
    };

    const userExists = await checkifUserExists(userName, password, selectedPersona);

    if(userExists){
      setErrorSignIn('User registered already, please sign in');
    }else{

      try {
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });

        if (!response.ok) {
          throw new Error('Failed to sign up');
        }

        console.log('User registered successfully!');
      } catch (error) {
        console.error('Error registering user:', error);
      }

      // Handle Sign up logic based on selected persona
      console.log(`Logging in as ${selectedPersona}`);
      console.log(`Username ${userName}`);
      console.log(`password ${password}`);
      // alert('Registered as ' +selectedPersona);
    }
  };

  async function handleSignIn (event) {

    event.preventDefault();

    if (!selectedPersona) {
      setErrorSelectedPersona('Persona is required.');
      return;
    }
    if (!userName) {
      setErrorUserName('Username is required.');
      return;
    }
    if (!password) {
      setErrorPassword('Password is required.');
      return;
    }

    // if(status)

    const foundUser = await checkifUserExists(userName, password, selectedPersona);
    console.log("foundUser - " + foundUser);

    if(foundUser && foundUser["status"] === "inactive"){
      console.log('Account is inactive');
      setErrorSignIn('Account is inactive, please contact Admin!')
    }
    else if (foundUser && foundUser["status"] === "active") {
      setErrorSignIn('');
      console.log(`Signed in as ${selectedPersona}`);
      // alert('Signed In as ' +selectedPersona);
      setCommonState((prevCommonState) => ({
        ...prevCommonState,
        userName: userName,
        authenticated : true,
        role:selectedPersona,
        isLoggedin:true
      }));
      console.log("commonState - " + JSON.stringify(commonState));
      navigate("/");
    } else {
      console.log('Invalid credentials');
      setErrorSignIn('Invalid credentials')
    }
  };

  const handleInputChange = (event) =>{
    const { name, value } = event.target;
    
    if (name === 'userName') {
      setUserName(value);
      setErrorUserName('');
    }
    if (name === 'password'){
      setPassword(value);
      setErrorPassword('');
    }
    if (name === 'selectedPersona') {
      setSelectedPersona(value);
      setErrorSelectedPersona('');
    }
  }

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <FormControl fullWidth>
        <InputLabel id="persona-label">Select Persona</InputLabel>
        <Select
          labelId="persona-label"
          id="persona"
          name="selectedPersona"
          value={selectedPersona}
          onChange={handleInputChange}
          label="Select Persona"
        >
          {personas.map((persona) => (
            <MenuItem key={persona} value={persona}>
              {persona}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Grid item xs={12}>
          {errorSelectedPersona && <Alert severity="error">{errorSelectedPersona}</Alert>}
      </Grid>
      <TextField
        margin="normal"
        fullWidth
        label="Username"
        id="username"
        name="userName"
        value={userName}
        onChange={handleInputChange}
        // Add necessary props for username input
      />
      <Grid item xs={12}>
          {errorUserName && <Alert severity="error">{errorUserName}</Alert>}
      </Grid>
      <TextField
        margin="normal"
        fullWidth
        label="Password"
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={handleInputChange}
        // Add necessary props for password input
      />
      <Grid item xs={12}>
          {errorPassword && <Alert severity="error">{errorPassword}</Alert>}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* <Link to='/'> */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSignIn}
          >
            Sign In
          </Button>
          {/* </Link> */}
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
        </Grid>
        <Grid item xs={12}>
          {errorSignIn && <Alert severity="error">{errorSignIn}</Alert>}
        </Grid>
    </Grid>
    </Box>
  );
}

const SignUp = () =>{

  const { commonState} = useCommonContext();

  const memoizedGetIsLoggedIn = React.useCallback(() => {
    return commonState.isLoggedIn;
  }, [commonState.isLoggedIn]);

  React.useEffect(() => {
    memoizedGetIsLoggedIn();
  }, [commonState.isLoggedIn, memoizedGetIsLoggedIn]);

  return (

    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header isLoggedIn={memoizedGetIsLoggedIn} title={commonState.title} sections={commonState.sections} userName={commonState.userName}
        isSubscribed='Subscribe'/>
        <main>
          <SignupComponent/>
        </main>
      </Container>
      <Footer
        title="Footer"
        description="Uncover more content by navigating through our posts"
      />
    </ThemeProvider>
  );

}

export default SignUp;