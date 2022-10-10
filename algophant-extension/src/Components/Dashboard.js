import React,{useState,useContext} from 'react';

import {copyAddress} from "./Misc";
import Assets from './DashboardComponents/Assets';
import { AuthContext } from './ContextAPI/LoginContext';
import Transactions from './DashboardComponents/Transactions';




function Dashboard({setViewSets}) {
    const {authState,} = useContext(AuthContext);
    const [activeBar,setActiveBar] = useState('assets');
    const [algorandBalance,setAlgorandBalance] = useState(0.0);
        
    const returnView = (activebar)=>{
        if (activebar === "assets") {
            return(<Assets algorand_balance={algorandBalance} setAlgorandBalance={setAlgorandBalance} wallet_address={authState?.wallet_address}/>)
        } else {
            return(<Transactions wallet_address={authState?.wallet_address}/>)
        }
    }

    return (
        <>

            <div className="min-h-screen mt-5 bg-white">

            
                
                <div className="p-3 border-b border-b-gray-200">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold">My Wallet</h3>

                        <div onClick={()=>{copyAddress(authState?.wallet_address)}} className="flex justify-center hover:bg-gray-100 cursor-pointer px-2 rounded-2xl items-center space-x-2 w-[200px] mx-auto">
                            <p className="overflow-hidden text-sm text-gray-500 text-ellipsis">{authState?.wallet_address}</p>
                            <svg className="w-12 h-12 cursor-pointer" fill="none" stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </div>
                    </div>

                </div>

                <div className="mt-5">

                    <div className="w-8 h-8 mx-auto">
                        <img src="/images/algo_logo.png" alt="algo_logo"/>
                    </div>

                    <div className="mt-5 text-center">
                        <h3 className="text-3xl font-semibold">{algorandBalance} ALGO</h3>
                        {/* <h5 className="text-sm font-medium text-gray-500">$0.00 USD</h5> */}
                    </div>
                </div>

                <div className="flex items-center justify-center mt-5 space-x-5">

                    <div onClick={()=>{setViewSets('add_token')}} className="flex flex-col items-center cursor-pointer border-2 border-[#7C24A8] rounded-2xl p-2">
                        <div>
                            <svg className="w-8 h-8" fill="#7C24A8" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        </div>
                        <p className="text-[#7C24A8] text-base font-medium">Add Token</p>
                    </div>

                    <div onClick={()=>{setViewSets('send_token')}} className="flex flex-col items-center cursor-pointer bg-[#7C24A8] rounded-2xl p-2">
                        <div>
                            <svg className="w-8 h-8" fill="#fff" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        </div>
                        <p className="text-base font-medium text-white">Send Token</p>
                    </div>
                    
                </div>


                <div className="mt-10">

                    <div className="flex items-center justify-between border-b border-b-gray-500 ">
                        <div onClick={()=>{setActiveBar('assets')}} className={`${activeBar === 'assets'? 'text-[#7C24A8] border-b-4 border-b-[#7C24A8]' :'text-gray-500'} text-center w-full cursor-pointer`}>
                            <h3 className="text-lg font-medium">Assets</h3>
                        </div>

                        <div onClick={()=>{setActiveBar('transactions')}} className={`${activeBar === 'transactions'? 'text-[#7C24A8] border-b-4 border-b-[#7C24A8]' :'text-gray-500'} text-center w-full cursor-pointer`}>
                            <h3 className="text-lg font-medium">Transactions</h3>
                        </div>
                    </div>

                    {returnView(activeBar)}

                
                </div>
                    
            </div>
            
        </>
    );
}

export default Dashboard;