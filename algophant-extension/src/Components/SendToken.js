import React,{useState,useContext} from 'react';

import WheelLoader from './LoadingBar/WheelLoader';
import { AuthContext } from './ContextAPI/LoginContext';
import PostAPIMethod from '../APIMethods/PostAPIMethod';
import FlashMessage from './FlashMessage.js/FlashMessage';

function SendToken({setViewSets}) {
    const {authState,} = useContext(AuthContext);
    const [formInput,setFormInput] = useState({address:'',token:'Algorand',amount:0});
    const [responseData,setResponseData] = useState({loading:false,data:null,error:false});

    const handleSubmit =()=>{
        // console.log(formInput)
        // alert('Transaction has been sent')

        let data = {
            "from_address":authState.wallet_address,
            "private_key":authState.private_key,
            "to_address":formInput.address,
            "amount":formInput.amount,
            "asset_id":formInput.token === 'Algorand'? "": formInput.token,
            "network":authState.network
        }

        PostAPIMethod('send-token/',data,setResponseData)
    }


    const returnTokenFromId = (id) =>{

        return(authState?.assets?.filter((value,key)=>value.asset_id === parseInt(id))[0]?.asset_name)
    }


    const showMessage = (response) =>{

        if (response?.code === 400) {
            return(
                
                <FlashMessage message={response?.error} type={"error"}/>
            )
        } else if (response?.txn_id) {
            return(
                <FlashMessage message={`Asset has been sent txnID: ${response?.txn_id}`}/>
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

                    <div onClick={()=>{setViewSets('dashboard')}} className='abs absolute right-0 z-10 -top-5 cursor-pointer flex items-end justify-end mt-5'>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <div className="absolute top-0 bottom-0 left-0 right-0 m0t-20 bg-white">
                        <div className='p-5 flex flex-col space-y-5'>
                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="to_address" className='text-lg font-medium'>Address</label>
                                <input onInput={(e)=>{setFormInput({...formInput,address:e.target.value})}} value={formInput.address} className='text-lg font-medium rounded-lg outline-none appearance-none border-2 border-[#b3a2bb] hover:border-[#7C24A8] p-3' type="text" placeholder='Enter address to send to' />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="token" className='text-lg font-medium'>Select Token</label>
                                <select onChange={(e)=>{setFormInput({...formInput,token:e.target.value})}} value={formInput.token} name="token" id="token" className='text-lg font-medium rounded-lg outline-none bg-transparent appearance-none border-2 border-[#b3a2bb] hover:border-[#7C24A8] p-3'>
                                    <option value="Algorand">Algorand</option>
                                    
                                    {
                                        authState?.assets?.map((asset,key)=>{
                                            return(<option key={key} value={asset.asset_id}>{asset?.asset_name}</option>)
                                        })
                                    }
                                </select>
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="amount" className='text-lg font-medium'>Amount</label>
                                <input onInput={(e)=>{setFormInput({...formInput,amount:e.target.value})}} value={formInput.amount} type="number" name="amount" id="amount" placeholder='Enter amount to send' className='text-lg font-medium rounded-lg outline-none appearance-none border-2 border-[#b3a2bb] hover:border-[#7C24A8] p-3'/>
                            </div>

                            {
                                formInput.address && formInput.amount?
                                <>

                                    <div className='bg-[#b3a2bb] p-5 rounded-3xl text-center'>
                                        <div>

                                            <h3 className='text-lg font-medium'>You are sending</h3>
                                            <h2 className='text-2xl font-semibold'>{formInput.amount} {formInput.token === "Algorand"? "Algorand" : returnTokenFromId(formInput.token)}</h2>

                                            <h3 className='text-lg font-medium'>To</h3>
                                            <p className="text-base mx-auto font-medium text-ellipsis overflow-hidden w-[80%] whitespace-nowrap">{formInput.address}</p>
                                        </div>
                                    </div>
                                

                                    <div className='max-w-[350px] mx-auto min-h-[55px] w-full rounded-full bg-[#7C24A8]'>
                                        <button onClick={handleSubmit} className='w-full min-h-[55px] text-base font-medium text-white'>Confirm</button>
                                    </div>

                                </>

                            :<></>

                            }
                        </div>
                    </div>

            
                </>
            }

        
        </div>
    );
}

export default SendToken;