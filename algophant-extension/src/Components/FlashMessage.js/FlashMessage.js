import React,{useState,useEffect} from 'react';
import "./flash-message.css"

function FlashMessage({message,type,timeout=5000}) {
    const [showMsg,setShowMsg] = useState(true);

    useEffect(()=>{
        const timeOut = setTimeout(()=>{
            setShowMsg(showMsg=>(!showMsg))
        },timeout)

        
        return ()=>{
            clearTimeout(timeOut)
        }
    },[timeout])

    
    return (
        <>
            {
                
                showMsg &&
            
                <div className='absolute z-10'>
                    <div className={`${type==='error'? 'border-red-600':'border-green-600' } border notification relative`}>
                        <p className={`${type==='error'? 'text-red-600':'text-green-600' } text-lg font-medium break-words`}>{message}</p>
                        <div className={`progress ${type==='error'? 'bg-red-600':'bg-green-600' }`}></div>
                    </div>
                
                </div>
            }
        </>
    );
}

export default FlashMessage;