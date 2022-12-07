import React,{useState,useEffect,useContext} from 'react';
import { AuthContext } from '../ContextAPI/LoginContext';
import GetAPIMethod from '../../APIMethods/GetAPIMethod';

function CustomSelect({dataFields,selected,setSelected,searchEnabled=false}) {
    const {authState,} = useContext(AuthContext);
    const [showOptions,setShowOptions] = useState(false);
    const [selectOptions,setSelectOptions] = useState([]);
    const [responseData,setResponseData] = useState({loading:false,data:null,error:false});


    const handleOnInput = (e)=>{
        if (searchEnabled) {
            GetAPIMethod(`/fetch_asset_info/${e.target.value}/?network=${authState.wallet_address}`,setResponseData)
        }
    }

    useEffect(()=>{
        setSelectOptions(dataFields)
    },[dataFields])

    useEffect(()=>{

        if (responseData.data?.asset_id) {
            setSelectOptions([responseData.data,...dataFields])
        }
    },[responseData.data,dataFields])

    return (
        <div className='relative'>
            { selected !== null && (
                <div onClick={()=>{setShowOptions(!showOptions)}} className='flex full justify-between items-center py-2 px-5 z-10 cursor-pointer border-b border-b-gray-200 hover:bg-gray-100'>
                    <div className='flex space-x-2 items-center'>
                        <div className='w-7 h-7'>
                            <img src="/images/placeholder-icon.png" alt="placeholder" className='w-full h-full' />
                        </div>
                        <div>
                            <h3 className='font-semibold text-lg'>{selected?.asset_name}</h3>
                            <p className='font-normal text-sm text-gray-500'>${selected?.symbol}</p>
                        </div>
                    </div>

                    <div className='flex flex-col items-end'>
                        <h3 className='font-medium text-base'>Balance: {selected?.formatted_amount}</h3>
                        <p className='text-sm font-medium text-gray-600'>≈ $NAN</p>
                    </div>
                </div>
            )}

            { selected === null && (

            <div onClick={()=>{setShowOptions(!showOptions)}} className='flex w-full space-x-2 items-center py-2 px-5 z-10 cursor-pointer border-b border-b-gray-200 hover:bg-gray-100'>
                <div className='w-7 h-7'>
                    <img src="/images/placeholder-icon.png" alt="placeholder" className='w-full h-full' />
                </div>
                <div className='w-full min-h-[56px]'>
                    <input onInput={handleOnInput} type="number" name="token" id="token" placeholder='Select Token or paste the ID'  className='w-full font-semibold text-lg outline-none appearance-none bg-transparent min-h-[56px]'/>
                </div>
            </div>
            )}

            {showOptions &&
            
            <>
                <div onClick={()=>{setShowOptions(!showOptions)}} className='w-screen min-h-screen opacity-10 fixed left-0 right-0 top-0'>
                </div>

                <div onClick={()=>{setShowOptions(!showOptions)}} className='py-2 bg-white shadow-2xl rounded-xl max-h-72 custom-scrollbar overflow-y-scroll w-full absolute z-10'>
                    {
                        selectOptions?.map((token,key)=>{
                            return(
                                <div onClick={()=>{setSelected(token)}} key={key} className='flex full justify-between items-center py-2 px-5 cursor-pointer border-b border-b-gray-200 hover:bg-gray-100'>
                                    <div className='flex space-x-2 items-center'>
                                        <div className='w-7 h-7'>
                                            <img src="/images/placeholder-icon.png" alt="placeholder" className='w-full h-full' />
                                        </div>
                                        <div>
                                            <h3 className='font-semibold text-lg'>{token.asset_name}</h3>
                                            <p className='font-normal text-sm text-gray-500'>${token.symbol}</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col items-end'>
                                        <h3 className='font-medium text-base'>Balance: {(token.formatted_amount).toLocaleString()}</h3>
                                        <p className='text-sm font-medium text-gray-600'>≈ NAN</p>
                                    </div>
                                </div>
                            )
                        })
                    }

                    {/* {searchEnabled &&
                        <div className='flex full justify-between items-center py-2 px-5 cursor-pointer border-b border-b-gray-200 text-gray-400 hover:text-gray-500 hover:bg-gray-100'>
                            <div>
                                <h4 className='text-base font-medium'>See all</h4>
                            </div>
                            <div>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                        </div>
                    } */}
                    
                </div>

            </>

            }
        
        </div>
    );
}

export default CustomSelect;