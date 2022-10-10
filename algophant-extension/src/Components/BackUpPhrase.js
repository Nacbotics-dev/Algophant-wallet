import React,{useContext,useState} from 'react';
import { AuthContext } from './ContextAPI/LoginContext';
import FlashMessage from './FlashMessage.js/FlashMessage';
import { Encrypt,EncryptSHA256 } from '../ExtensionFiles/Encryption';
import { save_to_local_storage } from '../ExtensionFiles/DBManagement';



function BackUpPhrase({setViewSets}) {
    const {authState,} = useContext(AuthContext);
    const [showError,setShowError] = useState(false);
    const [togglePassword,setTogglePassword] = useState(false);
    const [formInput,setFormInput] = useState({pass_phrase:'',password:''});

    const handleSubmit =()=>{
        
        if (authState.pass_phrase === formInput.pass_phrase.replace(/(\r\n|\n|\r)/gm, " ")) {
            

            let password = formInput.password
            let private_key = authState.wallet.private_key

            let sha256 =  EncryptSHA256(password)
            let aes =  Encrypt(password)
            let encrypted_key = Encrypt(private_key)

            save_to_local_storage(sha256,aes)
            save_to_local_storage(aes,encrypted_key)

            // setAuthState({...authState,isAuth:true});
            
            save_to_local_storage('wallet_available',true);
            setViewSets('login');


            
        }else{
            setShowError(true);
        }

    }

    const showMessage = (response) =>{

        if (response === true) {
            return(
                <FlashMessage message={"Please enter a valid phrase"} type={"error"}/>
            )
        } else{
            return(<></>)
        }
    }

    

   
    return (
        <div className='p-5'>

            {showMessage(showError)}
            <h2 className='text-center text-2xl font-semibold uppercase'>confirm Backup</h2>
             <div className='mt-5 mb-10'>
                <textarea onInput={(e)=>{setFormInput({...formInput,pass_phrase:e.target.value})}} name="pass_phrase" id="pass_phrase" className='w-full min-h-[150px] bg-transparent rounded-2xl outline-none appearance-none p-3 text-lg font-medium border-2 border-[#b3a2bb] hover:border-[#7C24A8]'></textarea>

                <div className='flex flex-col mt-5 space-y-1 relative py-3 border-b-2 border-b-[#b3a2bb] hover:border-b-[#7C24A8]'>
                    <input onInput={(e)=>{setFormInput({...formInput,password:e.target.value})}} name='password' type={`${!togglePassword? 'password' : 'text'}`} placeholder='Enter your wallet password' className='text-lg w-[90%] bg-transparent font-medium outline-none appearance-none px-3'/>

                    <div onClick={()=>{setTogglePassword(!togglePassword)}} className='cursor-pointer absolute right-5 top-3'>
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
                formInput.pass_phrase && formInput.password ?
                <div onClick={handleSubmit}  className='max-w-[450px] mx-auto min-h-[55px] w-full rounded-full bg-[#7C24A8]'>
                    <button  className='w-full min-h-[55px] text-base font-medium text-white'>Confirm Backup</button>
                </div>
            :<></>
            }
        </div>
    );
}

export default BackUpPhrase;