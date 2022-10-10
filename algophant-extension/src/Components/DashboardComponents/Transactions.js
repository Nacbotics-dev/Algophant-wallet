import React,{useState,useEffect} from 'react';
import { copyAddress } from '../Misc';
import WheelLoader from '../LoadingBar/WheelLoader';
import GetAPIMethod from '../../APIMethods/GetAPIMethod';
import { get_data_from_local_storage } from '../../ExtensionFiles/DBManagement';


function Transactions({wallet_address}) {
    const [txnData,setTxnData] = useState([]);
    // const {authState,setAuthState} = useContext(AuthContext);
    const [responseData,setResponseData] = useState({loading:false,data:null,error:false});


    useEffect(()=>{

        if (wallet_address) {
            GetAPIMethod(`transaction-list/${wallet_address}/?network=${get_data_from_local_storage('network')}`,setResponseData)
        }
        

    },[wallet_address])

    useEffect(()=>{

        if (responseData.data) {
            console.log(responseData.data,'#########')
            setTxnData(responseData.data)
        }
    },[responseData.data])


    return (
        <>
            {
                responseData.loading?
                <WheelLoader/>

                :
                    <div className="flex flex-col">
                        {

                            txnData.length === 0?
                                <>
                                    <div className=' w-40 h-40 mx-auto mt-16'>
                                        <img className='w-full h-full' src="/images/no_data.svg" alt="no_data.svg" />
                                    </div>

                                    <h5 className='text-base font-semibold text-gray-500 text-center'>No Transaction history yet</h5>
                                
                                </>
                            :
                            <>
                                {
                                    txnData?.map((txn,key)=>{
                                        return(

                                            <div key={key} className="p-5 cursor-pointer border-b hover:bg-neutral-200">

                                            
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-5">
                                                        <div className="w-8 h-8 flex flex-col items-center justify-center border border-[#7C24A8] rounded-full">
                                                            {
                                                                txn?.status === "Received"?
                                                                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                                                
                                                                :

                                                                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                                            }
                                                        </div>

                                                        <div className='text-left'>
                                                            <h4 className="text-lg font-semibold">{txn?.status === "Received"? "Received":"Sent"} {txn?.token_name}</h4>
                                                            <div className="flex flex-col space-y-2 text-xs font-normal text-gray-600">
                                                                <div className="flex flex-row space-x-1 mt-1 text-xs font-normal text-gray-600">
                                                                    <p className="w-28 overflow-hidden text-ellipsis whitespace-nowrap"><span className='font-medium text-black'>{txn?.status === "Received"? "From":"to"}:</span> {txn?.receiver}</p>

                                                                    {
                                                                        txn?.status === "Received"?
                                                                        <svg onClick={()=>{copyAddress(txn?.sender)}} className="w-4 h-4 cursor-pointer" fill="none" stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                                        :
                                                                        <svg onClick={()=>{copyAddress(txn?.receiver)}} className="w-4 h-4 cursor-pointer" fill="none" stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                                    }
                                                                    
                                                                </div>
                                                                <p className='text-xs font-normal text-gray-600'><span className='font-medium text-black'>Time :</span> {txn?.date}</p>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='text-right'>
                                                        <h4 className="text-lg font-semibold">{txn?.amount} {txn?.token_name}</h4>
                                                        <div className="flex flex-row space-x-1 mt-1 text-xs font-normal text-gray-600">
                                                            <div className="w-28 overflow-hidden text-ellipsis whitespace-nowrap"><span className='font-medium text-black'>TxnID:</span> {txn?.id}</div>
                                                            <svg onClick={()=>{copyAddress(txn?.id)}} className="w-4 h-4 cursor-pointer" fill="none" stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </>
                        }
                    </div>
            
            }
            
        </>
    );
}

export default Transactions;