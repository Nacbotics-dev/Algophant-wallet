import React,{useState} from 'react';

function SelectSearchField({name,dataFields,defaultValue,onChange,styleClass,placeholder='Select a valid field'}) {
    const [selected,setSelected] = useState('');
    const [dataField,setDataField] = useState([]);
    const [isActive,setIsActive] = useState(false);

    // useEffect(()=>{
    //     setDataField(dataFields);
    //     if (defaultValue) {
    //         setSelected(defaultValue);
    //         onChange(defaultValue)
    //     }
    // },[])


    


    const OnInput = (e)=>{
        setDataField(dataFields.filter(data=>String(data).toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())))
    }

    const OnSelect = (item) =>{
        setSelected(item);
        setIsActive(!isActive)
        onChange(item);
    }


    return (
        <div className='relative w-full'>
            <input hidden key={selected} onInput={OnInput} name={name} id={name} placeholder={placeholder} defaultValue={selected} autoFocus type="text" className='h-11 px-3 w-full text-sm text-white appearance-none bg-transparent outline-none border-b border-b-[#334053] focus:border-b-[#73fdea]'/>
            <div onClick={()=>{setIsActive(!isActive)}} className={styleClass}>
                {
                    isActive?
                    <input key={selected} onInput={OnInput} name={name} placeholder={placeholder} defaultValue={selected} autoFocus type="text" className='h-11 px-3 w-full text-base text-white appearance-none bg-transparent outline-none border-b border-b-[#334053] focus:border-b-[#73fdea]'/>
                    : <p className='px-3 text-lg text-inherit'>{selected? selected :name}</p>
                }

                {
                    !isActive?
                    <svg className='absolute top-0 right-0 h-full mr-3 dark:fill-white' viewBox="64 64 896 896" focusable="false" data-icon="down" width="1em" height="1em" fill="#8b9699" aria-hidden="true"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path></svg>
                    :<svg className='absolute top-0 right-0 h-full mr-3  dark:stroke-white' fill="none" width="1em" height="1em" stroke="#8b9699" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                }
            </div>
            {
                isActive?
            
                <div className={`${dataField.length < 1?'p-6':''} max-h-[280px] overflow-scroll overflow-x-hidden z-50 w-full absolute top-7 md:top-9 rounded-sm  border-gray-100 bg-white`}>

                    {dataField.map((item, key) => {  
                    return (  
                        <div onClick={()=>{OnSelect(item)}}  key={key} className={`${selected===item?'bg-[#e8faf8]':''} p-2 pl-2 cursor-pointer hover:bg-[#e8faf8]`}>  
                            <div className="relative flex items-center w-full p-2 pl-2 border-l-2 border-transparent hover:border-teal-100">  
                                <div className="flex items-center w-full">  
                                    <div className="mx-2 leading-6 ">{item}</div>  
                                </div>  
                            </div>  
                        </div>  
                    );  
                    })} 


                </div>

                :<></>
            
            }
        </div>
    );
}

export default SelectSearchField;