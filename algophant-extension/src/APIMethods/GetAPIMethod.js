import axiosInstance from "./AxiosBase";


function GetAPIMethod(url,setResponseData) {
    setResponseData({loading:true,data:null,error:false})

    axiosInstance.get(url).then((response)=>{
        setResponseData({loading:false,data:response.data,error:false})
    }).catch((response)=>{
        setResponseData({loading:false,data:response.data,error:true})
    })
}

export default GetAPIMethod;