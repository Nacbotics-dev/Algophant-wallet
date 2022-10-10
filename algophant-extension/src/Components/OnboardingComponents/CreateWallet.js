import React,{useContext,useState,useEffect} from 'react';

import WheelLoader from '../LoadingBar/WheelLoader';
import { AuthContext } from '../ContextAPI/LoginContext';
import GetAPIMethod from '../../APIMethods/GetAPIMethod';


function CreateWallet({setViewSets}) {
    const [passPhrase,setPassPhrase] = useState("");
    const {authState,setAuthState} = useContext(AuthContext);
    const [responseData,setResponseData] = useState({loading:false,data:null,error:false});

    useEffect(()=>{
        GetAPIMethod('/new-wallet',setResponseData)
    },[])

    useEffect(()=>{
        if (responseData.data) {
            setPassPhrase(responseData.data?.pass_phrase);
            setAuthState({...authState,wallet:responseData.data});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[responseData,setAuthState])


    const handleSubmit =()=>{
        
        setAuthState({...authState,pass_phrase:passPhrase});
        setViewSets("backup");
    }


    
    return (
        <div className='p-5 relative'>
            {
                responseData.loading?
                <WheelLoader/>

                :
                <>
                    <h2 className='text-center text-lg font-semibold'>Please write this down somewhere, we don't save it, if you miss place it you can't recover your wallet without this </h2>
                    <div className='grid grid-cols-3 gap-5 mt-5 mb-10'>
                        {
                            passPhrase.split(' ').map((phrase,key)=>{
                                return(
                                    <div key={key} className="bg-[#8f65a3] p-4 rounded-lg text-white font-medium">
                                        {phrase}
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div onClick={handleSubmit} className='max-w-[450px] mx-auto min-h-[55px] w-full rounded-full bg-[#7C24A8]'>
                        <button  className='w-full min-h-[55px] text-base font-medium text-white'>Backup Phrase</button>
                    </div>

                </>
            }
            
        </div>
    );
}

export default CreateWallet;