import React from 'react';
import "./flash-message.css"

function FlashMessage({message,type}) {
    return (
        <div className=''>
            <div className={`${type==='error'? 'border-red-600':'border-green-600' } border notification absolute z-10`}>
                <p className={`${type==='error'? 'text-red-600':'text-green-600' } text-lg font-medium break-words`}>{message}</p>
                <div className={`progress ${type==='error'? 'bg-red-600':'bg-green-600' }`}></div>
            </div>
        
        </div>
    );
}

export default FlashMessage;