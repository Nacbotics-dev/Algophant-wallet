import React,{useState,useEffect,useContext} from 'react';
import AddToken from './AddToken';
import SendToken from './SendToken';
import Dashboard from './Dashboard';
import WheelLoader from './LoadingBar/WheelLoader';
import { AuthContext } from './ContextAPI/LoginContext';
import { save_to_local_storage,get_data_from_local_storage } from '../ExtensionFiles/DBManagement';

function MainDashboard(props) {
    // const [myAssets,setMyAssets] = useState({});
    const [network,setNetwork] = useState("Testnet");
    const [viewSets,setViewSets] = useState('dashboard');
    const {authState,setAuthState} = useContext(AuthContext);
    const [responseData,setResponseData] = useState({loading:false,data:null,error:false});
    
    const handleViewSets = (view) =>{
        if (view === 'send_token') {
        return(<SendToken setViewSets={setViewSets}/>)
        } else if (view === 'add_token') {
        return(<AddToken setViewSets={setViewSets}/>)
        } else {
        return(<Dashboard setViewSets={setViewSets}/>)
        }
    }


    const  handleOnchange = (e) =>{
        setNetwork(e.target.value)
        setResponseData({loading:true,data:null,error:false})
        
    }

    useEffect(()=>{
        const network = get_data_from_local_storage('network')?get_data_from_local_storage('network'):"Mainnet"
        setNetwork(network)
    }, [])



    useEffect(()=>{
        save_to_local_storage("network",network)
        setAuthState({...authState,network:network})
        setResponseData({loading:false,data:null,error:false})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[network])

   
    return (
        <>
            {
                responseData.loading?
                <WheelLoader/>

                :
               
               <>
                    <div className="w-full px-5 flex justify-between items-center">
                        <div className='w-[200px] min-h-[39px]'>
                            <img className='w-full h-full' src="/images/algophant_logo.svg" alt="algophant_logo"  />
                        </div>

                        <div className="cursor-pointer p-2 rounded-full border-2 border-[#7C24A8] max-w-[200px]">
                            <select onChange={handleOnchange} value={network} name="network" id="network" className="bg-transparent w-full cursor-pointer outline-none text-[#7C24A8] font-medium text-sm">
                                <option value="Testnet">Algorand Testnet</option>
                                <option value="Mainnet">Algorand Mainnet</option>
                            </select>
                        </div>
                    </div>

                    {handleViewSets(viewSets)}
            
                </> 
            }

        </>
    );
}

export default MainDashboard;