import React,{useState,useEffect,useContext} from 'react';
import WheelLoader from './LoadingBar/WheelLoader';
import GetAPIMethod from '../APIMethods/GetAPIMethod';
import { AuthContext } from './ContextAPI/LoginContext';
import PostAPIMethod from '../APIMethods/PostAPIMethod';
import FlashMessage from './FlashMessage.js/FlashMessage';
import CustomSelect from './CustomSelectField/CustomSelect';



function SwapToken({setViewSets}) {
    const {authState,} = useContext(AuthContext);
    const [toToken,setToToken] = useState(null);
    const [swapped,setSwapped] = useState(false);
    const [isValid,setIsValid] = useState(false);
    const [dataFields,setDataFields] = useState([]);
    const [fromToken,setFromToken] = useState(null);
    const [errorMsg,setErrorMsg] = useState({
        sameToken:false,// This is called when the two tokens being swapped are the same
        invalidToken:false,// This is called when the token does not exist
        poolError:false,// This is called when the token does not have a pool
    })
    const [responseData,setResponseData] = useState({loading:false,data:null,error:false});
    const [poolData,setPoolData] = useState({loading:false,data:null,error:false});
    const [swapResponse,setSwapResponse] = useState({loading:false,data:null,error:false});

    // GET ALL ASSEST AVAILABLE IN USER ADDRESS
    useEffect(()=>{
        let Canceled = false

        if (!Canceled) {
            GetAPIMethod(`/list-assets/${authState.wallet_address}/?network=${authState.network}`,setResponseData)
        }
        
        return ()=>{
            Canceled = true
        }
    },[authState.wallet_address,authState.network])

    
    // SETUP THE ASSETS DATA
    useEffect(()=>{
        setDataFields(responseData.data?.Assets)
        setFromToken(responseData.data?.Assets[0])
        return()=>{
            
        }
    },[responseData.data]);


    // FETCH LIQUIDITY POOL DATA
    useEffect(()=>{
        if(typeof toToken?.asset_id !== 'undefined') {
            if (toToken?.asset_id === fromToken?.asset_id) {
                setToToken(null)
                setErrorMsg(errorMsg=>({...errorMsg,sameToken:true}))
            }else{
                setErrorMsg({
                    sameToken:false,
                    invalidToken:false,
                    poolError:false,
                })

                // check if pool exists for the token pair

                let data = {
                    from_asset:fromToken?.asset_id,
                    to_asset:toToken?.asset_id,
                    network:authState.network,
                    address:authState.wallet_address
                }
        
                PostAPIMethod('verify-pool/',data,setPoolData)
    
            }
        }
        return ()=>{   
        }
    },[fromToken?.asset_id,toToken?.asset_id,authState.wallet_address,authState.network])

    // SETUP FETCHED POOL DATA
    useEffect(()=>{
        if (poolData.data) {
            setErrorMsg(errorMsg=>({...errorMsg,poolError:!poolData.data?.pool_exist}))
            if (poolData.data?.pool_exist ===true) {
                setIsValid(isValid=>(!isValid))
            }
        }
    },[poolData.data]);


    const handleSubmit =()=>{
        let data = {
            address:authState.wallet_address,
            private_key:authState.private_key,
            from_asset:swapped?toToken.asset_id:fromToken.asset_id,
            to_asset:swapped?fromToken.asset_id:toToken.asset_id,
            amount_in:swapped?document.getElementById("to_amount").value:document.getElementById("from_amount").value,
            "network":authState.network
        }

        let from_amount = document.getElementById("from_amount")
        let to_amount = document.getElementById("to_amount")

        if (from_amount.value === "" && to_amount.value === "") {
            document.getElementById("top_input").classList.add("invalid-input")
            document.getElementById("bottom_input").classList.add("invalid-input")
        } else {
            document.getElementById("top_input").classList.remove("invalid-input")
            document.getElementById("bottom_input").classList.remove("invalid-input")
            PostAPIMethod('swap-token/',data,setSwapResponse)
        }

    }
    
    const handleOnInput = (e,input)=>{
        const tokenPrice = parseFloat(poolData.data?.price?poolData.data?.price:0.0)
        if (input==="from_amount") {
            document.getElementById("to_amount").value = (e.target.value*tokenPrice).toFixed(3)
        } else {
            document.getElementById("from_amount").value = (e.target.value/tokenPrice).toFixed(3)
        }
    }

    const OnClick = (e) =>{
        const top_input = document.getElementById('top_input')
        const bottom_input = document.getElementById('bottom_input')
        if (swapped === true) {
            top_input.classList.remove('swap_to_bottom_from_top')
            bottom_input.classList.remove('swap_to_top_from_bottom')
            setSwapped(false)

        }else{
            top_input.classList.add('swap_to_bottom_from_top')
            bottom_input.classList.add('swap_to_top_from_bottom')
            setSwapped(true)

        }
    }

    return (
        <div className='relative min-h-screen mt-5'>
            <div onClick={()=>{setViewSets('dashboard')}} className='absolute right-0 flex items-end justify-end mt-5 cursor-pointer -top-5'>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>


            <div className="mb-10">
                <h3 className="text-2xl font-bold text-center">Swap Token</h3>
                <p className="text-sm text-center text-gray-400">Powered by Tinyman</p>
            </div>
            {swapResponse.data?.txn_id && <FlashMessage message={`Transaction successful txnID: ${swapResponse.data?.txn_id}`} type={"successful"}/>}
            {swapResponse.data?.code && <FlashMessage message={`${swapResponse.data?.error}`} type={"error"}/>}
            {
                responseData.loading || swapResponse.loading?
                <WheelLoader/>

                :
                <div className='relative flex flex-col'>
                    <div id='top_input' className='relative top-0 flex flex-col w-full border border-gray-300 rounded-lg transition_0_5s bg-gray-0'>
                        <CustomSelect dataFields={dataFields} selected={fromToken} setSelected={setFromToken}/>

                        <div className='w-full'>
                            <input type="number" 
                            name="from_amount" 
                            id="from_amount" 
                            placeholder='0.00' 
                            step={0.001} 
                            onInput={(e)=>{handleOnInput(e,"from_amount")}}
                            className='w-full p-5 text-2xl font-semibold bg-transparent outline-none appearance-none h-14'
                            />
                        </div>
                    </div>


                    <div onClick={OnClick} className='mx-auto my-10 grid place-content-center cursor-pointer w-20 bg-[#7C24A8] p-3 rounded-full rotate-90'>
                        <svg className="w-8 h-8 rotate-90 " fill="none" stroke="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                    </div>

                    <div className='w-full'>
                        {toToken?.symbol && <h4 className='text-sm font-medium text-right text-gray-500'>1 {fromToken?.symbol}/ {poolData.data?.price?poolData.data?.price:0.0} {toToken?.symbol}</h4>}
                    </div>

                    <div id='bottom_input' className='relative top-0 flex flex-col w-full border border-gray-300 rounded-lg transition_0_5s bg-gray-0'>
                        <CustomSelect dataFields={dataFields} selected={toToken} setSelected={setToToken} searchEnabled={true}/>

                        <div className='w-full'>
                            <input type="number" 
                            name="to_amount" 
                            id="to_amount" 
                            placeholder='0.00' 
                            step={0.001} 
                            onInput={(e)=>{handleOnInput(e,"to_amount")}}
                            className='w-full p-5 text-2xl font-semibold bg-transparent outline-none appearance-none h-14'
                            />
                        </div>
                    </div>

                    <div className='mt-4'>
                        {swapResponse.data?.txn_id && <p className={`text-green-500 font-medium text-sm ${errorMsg.sameToken?'block':'hidden'}`}>Swap successful</p>}
                        {errorMsg.sameToken && <p className={`text-red-500 font-medium text-sm ${errorMsg.sameToken?'block':'hidden'}`}>Can't swap same tokens</p>}
                        {toToken && <p className={`text-red-500 font-medium text-sm ${errorMsg.poolError?'block':'hidden'}`}>There is no liquidity for {fromToken?.symbol}/{toToken?.symbol}</p>}
                    </div>

                    <div className='max-w-[350px] mx-auto min-h-[55px] w-full rounded-full bg-[#7C24A8] hover:bg-[#956fa8] mt-10'>
                        <button disabled={!isValid} onClick={handleSubmit} className='w-full min-h-[55px] text-base font-medium text-white cursor-pointer disabled:cursor-not-allowed'>Swap Asset</button>
                    </div>
                </div>
                
                
            }


        </div>
    );
}

export default SwapToken;