import {createContext, useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppContext = createContext({});

const server_url = "https://videoconferencing-2.onrender.com"

export function AppProvider({children}){

    const [token, setToken] = useState(false);

    const navigate = useNavigate();

    const userSignUp = async (obj) => {
        const {data} =  await axios.post("https://videoconferencing-2.onrender.com/api/v1/user/signup", obj);

        const { name, ...loginData } = obj; 

        if(data.success === true){
        await userLogin(loginData);
        return data.success;
      }else{
        console.log(data.message);
      }
    }

    const userLogin = async (obj) => {
       const { data } = await axios.post("https://videoconferencing-2.onrender.com/api/v1/user/login", obj);
       if(data.success === true){
        localStorage.setItem("token", data.message);
        navigate("/");
        setToken(true);
        return data.success;
      }else{
        console.log(data.message);
      }
    }

    const getHistory = async () => {
        try {
            let request = await axios.get(server_url+"/api/v1/user/get_all_activity", {
                params : {
                    token : localStorage.getItem("token"),
                }
            });
            console.log(request);
            return request;
        } catch (error) {
            throw error;
        }
    }

    const addToUserHistory = async (meeting_code) => {
        try {
            let request = await axios.post(server_url+"/api/v1/user/add_to_activity", {
                token : localStorage.getItem("token"),
                meeting_code : meeting_code, 
            })
            console.log(request);
            return request;
        } catch (error) {
            throw error
        }
    }

    const data = {
        getHistory, addToUserHistory, userSignUp, token, userLogin
    }

    useEffect(() => {
        if(!token){
            if(localStorage.getItem('token')){
                setToken(true);
            }
        }
    }, [token])

    return (
        <AppContext.Provider value={data}>
           {children}
        </AppContext.Provider>
    )
}

export default AppContext;