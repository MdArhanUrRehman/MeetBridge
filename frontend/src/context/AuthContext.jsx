import {createContext} from "react";
import axios from "axios";

const AppContext = createContext({});

const server_url = "https://videoconferencing-jnqc.onrender.com"

export function AppProvider({children}){

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
        getHistory, addToUserHistory
    }

    return (
        <AppContext.Provider value={data}>
           {children}
        </AppContext.Provider>
    )
}

export default AppContext;