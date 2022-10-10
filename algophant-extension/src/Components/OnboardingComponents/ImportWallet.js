import React,{useState,useContext,useEffect} from 'react';
import WheelLoader from '../LoadingBar/WheelLoader';
import { AuthContext } from '../ContextAPI/LoginContext';
import PostAPIMethod from '../../APIMethods/PostAPIMethod';
import FlashMessage from '../FlashMessage.js/FlashMessage';

import { EncryptSHA256,Encrypt } from '../../ExtensionFiles/Encryption';
import { save_to_local_storage } from '../../ExtensionFiles/DBManagement';



function ImportWallet({setViewSets}) {
    const {authState,setAuthState} = useContext(AuthContext);
    const [togglePassword,setTogglePassword] = useState(false);
    const [formInput,setFormInput] = useState({pass_phrase:'',password:''});
    const [responseData,setResponseData] = useState({loading:false,data:null,error:false});
    

    const handleSubmit =()=>{
        console.log(formInput)
        // alert('Wallet restored Successfully')
        // setAuthState({...authState,isAuth:true});
        // save_to_local_storage('wallet_available',true);

        PostAPIMethod('restore-wallet-from-phrase/',{phrase:formInput.pass_phrase},setResponseData)
    }


    useEffect(()=>{

        if (responseData.data && responseData.error !== true) {
            
            let password = formInput.password
            let private_key = responseData.data.private_key

            let sha256 =  EncryptSHA256(password)
            let aes =  Encrypt(password)
            let encrypted_key = Encrypt(private_key)

            save_to_local_storage(sha256,aes)
            save_to_local_storage(aes,encrypted_key)

            save_to_local_storage('wallet_available',true);
            // setViewSets('login');
            setAuthState({...authState,isAuth:true,private_key:responseData.data.private_key,wallet_address:responseData.data.address})


        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[responseData])

    const showMessage = (response) =>{

        if (response.error === true) {
            return(
                <FlashMessage message={"Please enter a valid phrase"} type={"error"}/>
            )
        } else if (response.data) {
            return(
                <FlashMessage message={`Wallet has been successfully restored`}/>
            )
        } else{
            return(<></>)
        }
    }


    return (
        <div className='p-5'>
            <h2 className='text-center text-2xl font-semibold uppercase'>Import Existing Wallet</h2>
        
            {
                responseData.loading?
                <WheelLoader/>

                :

                <>
                    {showMessage(responseData)}
                    <div className='mt-5 mb-10'>

                    
                        <div>
                            <textarea onInput={(e)=>{setFormInput({...formInput,pass_phrase:e.target.value})}} value={formInput.pass_phrase} name="pass_phrase" id="pass_phrase" className='w-full min-h-[150px] bg-transparent rounded-2xl outline-none appearance-none p-3 text-lg font-medium border-2 border-[#b3a2bb] hover:border-[#7C24A8]'></textarea>
                        </div>


                        <div className='flex flex-col space-y-1 relative py-3 border-b-2 border-b-[#b3a2bb] hover:border-b-[#7C24A8]'>
                            <input onInput={(e)=>{setFormInput({...formInput,password:e.target.value})}} value={formInput.password} name='password' type={`${!togglePassword? 'password' : 'text'}`} placeholder='Enter your wallet password' className='text-lg w-[90%] font-medium outline-none appearance-none px-3'/>

                            <div onClick={()=>{setTogglePassword(!togglePassword)}} className='absolute cursor-pointer right-5 top-3'>
                                {
                                    togglePassword?
                                        <svg className="w-6 h-6" fill="none" stroke="#7C24A8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    :
                                        <svg className="w-6 h-6" fill="none" stroke="#7C24A8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                }  
                            </div>
                        </div>
                    
                    
                    </div>


                    {
                            formInput.pass_phrase && formInput.password?
                            <div onClick={handleSubmit}  className='max-w-[450px] mx-auto min-h-[55px] w-full rounded-full bg-[#7C24A8]'>
                                <button  className='w-full min-h-[55px] text-base font-medium text-white'>Import Wallet</button>
                            </div>
                        :<></>
                        }
                
                </>
            }
        </div>
    );
}

export default ImportWallet;