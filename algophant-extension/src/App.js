import { useState } from "react";
import Onboarding from "./Components/Onboarding";
import MainDashboard from "./Components/MainDashboard";
// import {CreateDb} from "./ExtensionFiles/DBManagement";
import { AuthContext } from "./Components/ContextAPI/LoginContext";


function App() {
  const [authState,setAuthState] = useState({isAuth:false});
  const [finalAuthState,setFinalAuthState] = useState({isAuth:false});

  return (
    <div className="min-h-screen min-w-full">

      <div className="max-w-lg mx-auto my-5 min-h-screen custom-box-shadow">

      <AuthContext.Provider value={{
          authState,
          setAuthState,
          finalAuthState,
          setFinalAuthState
      }}>

      {
          !authState.isAuth?
          <Onboarding/>

          :
          <>
         <MainDashboard/>
          </>
          
        }
        
      </AuthContext.Provider>
        

        

        

      </div>
    </div>
  );
}

export default App;
