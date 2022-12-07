import React,{useState,useContext} from 'react';
import WheelLoader from './LoadingBar/WheelLoader';
import { AuthContext } from './ContextAPI/LoginContext';
import PostAPIMethod from '../APIMethods/PostAPIMethod';
import FlashMessage from './FlashMessage.js/FlashMessage';

function AddToken({setViewSets}) {
    const {authState,} = useContext(AuthContext);
    const [formInput,setFormInput] = useState({asset_id:''});
    const [responseData,setResponseData] = useState({loading:false,data:null,error:false});

    const handleSubmit =()=>{
        let data = {
            "asset_id": formInput.asset_id,
            "address":authState.wallet_address,
            "private_key":authState.private_key,
            "network":authState.network
        
        }
        PostAPIMethod('opt-in-token/',data,setResponseData)
    }


    const showMessage = (response) =>{

        if (response?.code === 400) {
            return(
                <FlashMessage message={response?.error} type={"error"}/>
            )
        } else if (response?.txn_id) {
            return(
                <FlashMessage message={`Asset has been added successfully txnID: ${response?.txn_id}`}/>
            )
        } else {
            return(<></>)
        }
    }
    
    return (
        <div className='relative min-h-screen mt-5'>

            
            {
                responseData.loading?
                <WheelLoader/>

                :
                <>

                    {showMessage(responseData.data)}
                    

                    <div onClick={()=>{setViewSets('dashboard')}} className='absolute right-0 flex items-end justify-end mt-5 cursor-pointer -top-5'>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-2xl font-bold text-center">Add Token</h3>
                    </div>
                    

                        
                    <div className='flex flex-col p-5 space-y-5'>
                        <div className='flex flex-col space-y-1'>
                            <label htmlFor="asset_id" className='text-lg font-medium'>Asset ID</label>
                            <input onInput={(e)=>{setFormInput({...formInput,asset_id:e.target.value})}} value={formInput.asset_id} name='asset_id' className='text-lg font-medium rounded-lg outline-none appearance-none border-2 border-[#b3a2bb] hover:border-[#7C24A8] p-3' type="number" placeholder='Enter asset ID to add' />
                        </div>

                        {
                            formInput.asset_id?
                            <>

                                <div className='max-w-[350px] mx-auto min-h-[55px] w-full rounded-full bg-[#7C24A8]'>
                                    <button onClick={handleSubmit} className='w-full min-h-[55px] text-base font-medium text-white'>Add Asset</button>
                                </div>

                            </>

                        :<></>

                        }
                    </div>
                   
                
                </>
            }
        
        </div>
    );
}

export default AddToken;