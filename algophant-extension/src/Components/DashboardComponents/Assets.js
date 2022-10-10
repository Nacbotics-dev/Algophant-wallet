import React,{useState,useEffect,useContext} from 'react';

import WheelLoader from "../LoadingBar/WheelLoader";
import { AuthContext } from '../ContextAPI/LoginContext';
import GetAPIMethod from '../../APIMethods/GetAPIMethod';
import { get_data_from_local_storage } from '../../ExtensionFiles/DBManagement';

function Assets({algorand_balance,setAlgorandBalance,wallet_address}) {
    const [assetData,setAssetData] = useState();
    const {authState,setAuthState} = useContext(AuthContext);
    const [responseData,setResponseData] = useState({loading:false,data:null,error:false});


    useEffect(()=>{

        if (wallet_address) {
            GetAPIMethod(`list-assets/${wallet_address}/?network=${get_data_from_local_storage('network')}`,setResponseData)
        }
        

    },[wallet_address])

    useEffect(()=>{
        
        if (responseData.data?.Assets) {
            setAssetData(responseData.data.Assets)
            setAlgorandBalance(responseData.data.algorand_balance)
            setAuthState({...authState,assets: responseData.data.Assets })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[responseData.data,setAlgorandBalance,])

    
    return (
        <>
            {
                responseData.loading?
                <WheelLoader/>

                :
                <div className="flex flex-col space-y-5">

                    <div className="flex items-center justify-between p-5 mt-5 cursor-pointer border-y hover:bg-neutral-200">
                        <div className="flex items-center space-x-5">
                            <div className="w-8 h-8">
                                <img src="/images/algo_logo.png" alt="" />
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold">{algorand_balance} ALGO</h4>
                                {/* <p className="text-sm font-normal text-gray-600">$0.00 USD</p> */}
                            </div>
                        </div>

                        <div>
                            <svg className="w-6 h-6" fill="none" stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </div>


                    {
                        assetData?.map((asset,key)=>{
                            return(
                            <div key={key} className="flex items-center justify-between p-5 cursor-pointer border-y hover:bg-neutral-200">
                                <div className="flex items-center space-x-5">
                                    <div className="w-8 h-8">
                                        <img src="/images/algo_logo.png" alt="" />
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold">{asset?.formatted_amount} {asset?.symbol}</h4>
                                        {/* <p className="text-sm font-normal text-gray-600">$0.00 USD</p> */}
                                    </div>
                                </div>

                                <div>
                                    <svg className="w-6 h-6" fill="none" stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                            )
                        })
                    }
                </div>
            
            }
                
        </>
    );
}

export default Assets;