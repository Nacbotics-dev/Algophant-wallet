import React,{useState,useEffect} from 'react';
import BackUpPhrase from './BackUpPhrase';
import LoginPage from './OnboardingComponents/LoginPage';
import CreateWallet from './OnboardingComponents/CreateWallet';
import ImportWallet from './OnboardingComponents/ImportWallet';
import GettingStarted from './OnboardingComponents/GettingStarted';
import { get_data_from_local_storage } from '../ExtensionFiles/DBManagement';

function Onboarding(props) {
    const [viewSets,setViewSets] = useState('new');

    useEffect(()=>{
        let wallet_exists = get_data_from_local_storage('wallet_available');
        if (wallet_exists === 'true') {
            setViewSets('login')
        } else {
            setViewSets('new')
        }
    },[])

    const handleViewSets = (view) =>{
        if (view === 'login') {
            return(<LoginPage setViewSets={setViewSets}/>)
        } else if (view === 'create') {
            return(<CreateWallet setViewSets={setViewSets}/>)
        } else if (view === 'import') {
            return(<ImportWallet setViewSets={setViewSets}/>)
        }else if (view === 'backup') {
            return(<BackUpPhrase setViewSets={setViewSets}/>)
        } else {
            return(<GettingStarted setViewSets={setViewSets}/>)
        } 
    }
     
    return (
        <div className='mt-5 bg-white min-h-screen'>
            
            <div className='w-[250px] min-h-[54px] mx-auto pt-5 mb-20'>
                <img className='w-full h-full' src="/images/algophant_logo.svg" alt="algophant_logo"  />
            </div>

            {handleViewSets(viewSets)}


            <div>

            </div>
        </div>
    );
}

export default Onboarding;