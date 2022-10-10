import React from 'react';
import "./wheelloader.css"

function WheelLoader(props) {
    return (
        <div className=''>
            <div className='absolute w-full flex flex-col justify-center top-0 bg-red-50 opacity-10 left-0 right-0'></div>
            <div className='w-full justify-center flex flex-col items-center'>
                <div className='loader-wrapper'>
                    <div className='loader'>
                        <div className='loader loader-inner'></div>
                    </div>
                </div>
            </div>
        
        </div>
    );
}

export default WheelLoader;