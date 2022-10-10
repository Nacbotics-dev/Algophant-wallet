import React,{useState,useContext,useEffect} from 'react';

import WheelLoader from '../LoadingBar/WheelLoader';
import { AuthContext } from '../ContextAPI/LoginContext';
import PostAPIMethod from '../../APIMethods/PostAPIMethod';
import { Decrypt,EncryptSHA256 } from '../../ExtensionFiles/Encryption';
import { get_data_from_local_storage } from '../../ExtensionFiles/DBManagement';



function LoginPage(props) {
    const {authState,setAuthState} = useContext(AuthContext);
    const [formInput,setFormInput] = useState({password:''});
    const [togglePassword,setTogglePassword] = useState(false);
    const [responseData,setResponseData] = useState({loading:false,data:null,error:false});

    const handleSubmit =()=>{
        let password = get_data_from_local_storage(EncryptSHA256(formInput.password))


        if (password) {
            let wallet_key = get_data_from_local_storage(password)
            setAuthState({...authState,private_key:Decrypt(wallet_key)})
        }else{
            alert("Password is Invalid")
        }


        
    }

    useEffect(()=>{
        if (authState.private_key) {
            PostAPIMethod('restore-wallet-from-key/',{key:authState.private_key},setResponseData)
        }


    },[authState])


    useEffect(()=>{
        if (responseData.data && responseData.error === false) {
            setAuthState({...authState,isAuth:true,wallet_address:responseData.data.address})
        }
    })

    
    return (
        <div>
            {
                responseData.loading?
                <WheelLoader/>

                :

                <>
            
                    <div className='w-full text-sm font-medium text-center text-gray-500 break-words'>
                        Experience world’s most powerful <br /> and sustainable blockchain wallet
                    </div>

                    <div className='flex flex-col p-5 mt-10 space-y-5'>
                        <div className='flex flex-col space-y-1 relative py-3 border-b-2 border-b-[#b3a2bb] hover:border-b-[#7C24A8]'>
                            <input onInput={(e)=>{setFormInput({...formInput,password:e.target.value})}} name='password' type={`${!togglePassword? 'password' : 'text'}`} placeholder='Enter your wallet password' className='text-lg w-[90%] font-medium outline-none appearance-none px-3'/>

                            <div onClick={()=>{setTogglePassword(!togglePassword)}} className='absolute cursor-pointer right-5 top-3'>
                                {
                                    togglePassword?
                                        <svg className="w-6 h-6" fill="none" stroke="#7C24A8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    :
                                        <svg className="w-6 h-6" fill="none" stroke="#7C24A8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                }  
                            </div>
                        </div>

                        {
                            formInput.password?
                            <div onClick={handleSubmit}  className='max-w-[450px] mx-auto min-h-[55px] w-full rounded-full bg-[#7C24A8]'>
                                <button  className='w-full min-h-[55px] text-base font-medium text-white'>Login</button>
                            </div>
                        :<></>
                        }
                    </div>
                
                </>
            
            }
           
        </div>
    );
}

export default LoginPage;