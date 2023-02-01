import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";
window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);

let cartCountContainer = document.getElementById('cartCount');

let usernameInput = document.getElementById('usernameInput')
let emailInput = document.getElementById('emailInput')
let messageInput = document.getElementById('messageInput')
let sendMessageBtn = document.getElementById('sendMessage');

// -------------------------------------------------------------
function renderCartBasketToDom(productCountInCart){
    cartCountContainer.innerHTML = `
        <span slot="cartCount"  class="badge bg-danger cartAlert rounded-circle">${productCountInCart}</span>
    `
}
function isValidate(regex , input){
    return regex.test(input);
}
function clearInputs(){
    usernameInput.value = '' ;
    emailInput.value = '' ;
    messageInput.value = '' ;    
}


 // -------------------------------------------------------------
 window.addEventListener('load' , function () {
    renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart'))?.length ?? '');
 })
sendMessageBtn.addEventListener('click' , function (ev) {
    let isUserLogined = localStorage.getItem('mimKala-user-token');
    if(!isUserLogined){
        swal({
            title : 'شما هنوز وارد نشدید' ,
            text : 'برای ارسال پیام باید ابتدا در میم کالا وارد شوید' , 
            icon: "warning",
            button: "باشه",
        })
        return
    }
    let username = usernameInput.value
    let email = emailInput.value
    let message = messageInput.value    
    let isValidEmail = isValidate(/^[a-zA-Z0-9_\-\.]+@\w+\.\w{2,5}$/g , email);
    if(!isValidEmail){
        swal({
            title : 'لطفا ایمیل خود را به درستی وارد کنید' , 
            icon: "error",
            button: "باشه",
        })
        return
    }
    let newMessage = {
        userName: username , 
        userEmail: email ,
        userMessage : message
    }
    ev.target.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
    fetch('https://mimkala-default-rtdb.firebaseio.com/messages.json' , {
        method : 'post' , 
        headers : {
            'content-type' : 'application/json' ,
        } ,
        body : JSON.stringify(newMessage)
    })
    .then(res => res.status)
    .then(status => {
        if(status === 200){
            swal({
                title : 'پیام شما با موفقیت ارسال شد' , 
                text : 'پیام شما ارسال شد . پاسخ ان را از طریق ایمیل به اطلاع شما خواهیم رساند' ,
                icon: "success",
                button: "باشه",
            })
        }else{
            swal({
                title : 'عملیات با خطا مواجه شد. لطفا دوباره امتحان کنید' , 
                icon: "error",
                button: "باشه",
            })
        }
        ev.target.innerHTML = 'ارسال پیام'
    })
    clearInputs()
})