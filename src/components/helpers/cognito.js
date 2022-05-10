import axios from "axios";
import { Auth } from 'aws-amplify';

const registerUser = async (user)=> {
    try {
        await Auth.signUp(
            {
                username:user.username,
                password:user.password,
                attributes: {
                    email:user.email,
                    'custom:language':user.language          
                }
            });
      
    }
    catch (err) {
        console.log(err)
        if (err === "UsernameExistsException: User already exists") {
            return ('err')
        }
    }
}

const confirmUser = async (username, code) => {
    try {
        const res = await Auth.confirmSignUp(username, code);
        console.log(res)
            return (res)
        } catch(err) {
            if (err === "CodeMismatchException: Invalid verification code provided, please try again.") {
                return ('wrong code')
            }
            return ('err');
        }    
}

const loginUser = async (username, password) => {
    try {
        const user  = await Auth.signIn(username, password);
    return user
    }
    catch(err) {
        console.log((err))
        if (err === "NotAuthorizedException: Incorrect username or password.") {
            console.log('contraseña incorrecta')
            return('wrongpassword')
          }
          else if (err === "UserNotFoundException: User does not exist.") {
              console.log('no existe el usuario')
              return('nouser')
          }
          else {
              console.log('something went wrong')
              return('somewrong')
          }
    }
}

const getUrls = async (username) => {
    const userdata = await Auth.currentSession();
    const token = userdata.getAccessToken();
    console.log(token.jwtToken)
    const response = await axios.get(`http://localhost:3001/api/logged/users/${username}/all`, 
    { headers: {"Authorization" : `${token.jwtToken}`} });
    return (response)
}

const isSession = async () => {
    try {
        await Auth.currentSession();//checks there's a valid user logged and if its session is still valid
        const userdatas = await Auth.currentUserInfo();//gets logged users data
        return userdatas
    }
    catch(err) {
        return ('err')
    }
}
    
const sendCode = async (username)=> {
    try {
        await Auth.forgotPassword(username);
    }
    catch(err) {
        console.log(err);
    }
}

const changePassword = async (datas) => {
    try {
      await Auth.forgotPasswordSubmit(datas.username,datas.code, datas.password);
      
    } catch (err) {
        if (err === "CodeMismatchException: Invalid verification code provided, please try again."){
            return ('wrongcode')
        }
      console.log(err);
    }
  }
  const logOut = async ()=> {
      await Auth.signOut()
  }

  const modifyUrl = async (id,newshorturl) => {
    const userdata = await Auth.currentSession();
    const token = userdata.getAccessToken();
    console.log(token.jwtToken);
    const response = await axios.put(`http://localhost:3001/api/logged/users/modify/${id}/${newshorturl}`, 
    { headers: {"Authorization" : `${token.jwtToken}`} });
    return response
}
export {
    registerUser,
    confirmUser,
    loginUser,
    getUrls,
    isSession,
    sendCode,
    changePassword,
    logOut,
    modifyUrl
}