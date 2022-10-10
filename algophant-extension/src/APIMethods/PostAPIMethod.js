import axiosInstance from "./AxiosBase";

function PostAPIMethod(url,params,setResponseData) {
    setResponseData({loading:true,data:null,error:false})

    axiosInstance.post(url,params).then((response)=>{
        setResponseData({loading:false,data:response.data,error:false})
    }).catch((response)=>{
        setResponseData({loading:false,data:response.data,error:true})
    })
}

export default PostAPIMethod;