import React from 'react';
import { get_data_from_local_storage } from '../../ExtensionFiles/DBManagement';

function GettingStarted({setViewSets}) {

    const wallet_available = get_data_from_local_storage('wallet_available')
    return (
        <>
            <div className='text-gray-500 text-sm font-medium text-center break-words w-full'>
                Experience world’s most powerful <br /> and sustainable blockchain wallet
            </div>

            <div className='mt-10 flex flex-col space-y-5'>
                <div onClick={()=>{setViewSets('create')}} className='max-w-[350px] mx-auto min-h-[55px] w-full rounded-full bg-[#7C24A8]'>
                    <button className='w-full min-h-[55px] text-base font-medium text-white'>New Wallet</button>
                </div>

                <div onClick={()=>{setViewSets('import')}} className='max-w-[350px] mx-auto min-h-[55px] w-full rounded-full border-2 border-[#7C24A8]'>
                    <button className='w-full min-h-[55px] text-base font-medium text-[#7C24A8]'>Import Existing Wallet</button>
                </div>

                {
                    wallet_available === true?
                
                        <div onClick={()=>{setViewSets('login')}} className='max-w-[350px] mx-auto min-h-[55px] w-full rounded-full bg-[#7C24A8]'>
                            <button className='w-full min-h-[55px] text-base font-medium text-white'>Login</button>
                        </div>
                    
                    :<></>
                
                }
            </div>
        </>
    );
}

export default GettingStarted;