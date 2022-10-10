export const getFormValues = () =>{
    let formData = {}
    const formElem = document.querySelector('form')
    let inputElements = formElem.querySelectorAll('input')
    inputElements.forEach((input,inputID)=>{
        formData[input.name] = input.value
    })

    return(formData)
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export const getAdvancedFormValues = () =>{
  let formData = {}
  const formElem = document.querySelector('form')
  let inputElements = formElem.querySelectorAll('input, select')
  inputElements.forEach((input,inputID)=>{
      formData[input.name] = input.value;
  })

  return(formData)
}


export function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
  
export const copyAddress = (address) =>{

  if (! navigator.clipboard) {
    
    fallbackCopyTextToClipboard(address);
    alert('Copied Wallet Address !!!');
    return
  }

  window.navigator.clipboard.writeText(address);


}