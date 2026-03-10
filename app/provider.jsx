// must use axios to make api calls etc

"use client" // this file will run in browser not server
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import React, { useEffect, useState, createContext} from 'react'
import { SelectedChapterIndexContext } from "../context/SelectedChapterIndexContext";

export const UserDetailContext = createContext(null);


function Provider({children}) { //react component wrapping other components

    const {user}=useUser();// get logged-in user data
    const [userDetail, setUserDetail] = useState(); // defining variables
    const[selectedChapterIndex, setSelectedChapterIndex] = useState(0);
    useEffect(()=>{
        user && CreateNewUser();
    },[user])

    const CreateNewUser=async()=>{// async means function pauses while it waits for something 
        const result= await axios.post('/api/user',{// send POST request to api (backend server)
            name:user?.fullName,//find users full name
            email:user?.primaryEmailAddress?.emailAddress// find users email
        });
        console.log(result.data); // testing purposes
        setUserDetail(result.data);
    }
  return (
    <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
      <SelectedChapterIndexContext.Provider
        value={{ selectedChapterIndex, setSelectedChapterIndex }}
      >
        <div>{children}</div>
      </SelectedChapterIndexContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default Provider //makes component available to all files for import