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
        return ('success')
    }
    catch (err) {
        if (Object.values(err)[0] === "UsernameExistsException") {
            return ('err')
        }
    }
}

const confirmUser = async (username, code) => {
    try {
        const res = await Auth.confirmSignUp(username, code);
            return (res)
        } catch(err) {
            if (Object.values(err)[0] === "CodeMismatchException") {
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
        if (Object.values(err)[0] === "NotAuthorizedException") {
            return('wrongpassword')
          }
          else if (Object.values(err)[0] === "UserNotFoundException") {
              return('nouser')
          }
          else {
              return('somewrong')
          }
    }
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

export {
    registerUser,
    confirmUser,
    loginUser,
    isSession,
    sendCode,
    changePassword,
    logOut,
}