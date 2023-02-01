import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";

window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);

let cartCountContainer = document.getElementById('cartCount');

let clockElem = document.getElementById('panelClock');
let dateElem = document.getElementById('panelDate');

let sidebarContainer = document.getElementById('sidebarContainer');
let messageContainer = document.getElementById('messageContainer');

 // -----------------------------------------------------------------------
async function readUserData(token){
    let userDataReq = await fetch(`https://mimkala-default-rtdb.firebaseio.com/users/${token}.json`)
    let userDataObj = await userDataReq.json();
    return userDataObj
}
async function readAllMessages(){
    let allMessageReq = await fetch(`https://mimkala-default-rtdb.firebaseio.com/messages.json`)
    let userMessage = await allMessageReq.json();
    return Object.entries(userMessage)
}
function renderCartBasketToDom(productCountInCart){
    cartCountContainer.innerHTML = `
        <span slot="cartCount"  class="badge bg-danger cartAlert rounded-circle">${productCountInCart}</span>
    `
}
function renderSidebarToDom(userDataObj){
    sidebarContainer.innerHTML = '' ;
    let temp = `
                <div class="sideBar">
                    <div class="text-center py-3 mt-3">
                        <img src="./../../images/adminProfile.png" class="adminProfile">
                        <div class="h5 mt-2 mb-0">${userDataObj.username}</div>
                        <div class="text-muted">${userDataObj.accessLevel}</div>
                    </div>
                    <div class="sidebarItems py-1">
                        <div class="sidebarItem">
                            <a href="./panel.html">پیشخوان</a>
                        </div>
                        <div class="sidebarItem">
                            <a href="./users.html">کاربران</a>
                        </div>
                        <div class="sidebarItem">
                            <a href="./products.html">محصولات</a>
                        </div>
                        <div class="sidebarItem">
                            <a href="./articles.html">مقالات</a>
                        </div>
                        <div class="sidebarItem">
                            <a href="./discountCodes.html">تخفیف ها</a>
                        </div>
                        <div class="sidebarItem active">
                            <a href="./questions.html">سوالات</a>
                        </div>
                        <div class="sidebarItem pointerC" id="logOutBtn">
                            <a class="text-danger">خروج</a>
                        </div>
                    </div>
                </div>
    `
    sidebarContainer.insertAdjacentHTML('beforeend' , temp);
}
function logOutHandler(){
    document.getElementById('logOutBtn').addEventListener('click' , function () {
        swal.fire({
            icon : 'warning' , 
            title : 'خروج از پنل مدیریت'  ,
            text : 'ایا می خواهید از حساب کاربری خود خارج شوید ؟' ,
            showCancelButton : true ,
            cancelButtonText : 'نه' , 
            confirmButtonText : 'خروج'
        }).then((res) => {
            if(res.isConfirmed){
                localStorage.removeItem('mimKala-user-token');
                window.location.href = './../../pages/store/index.html'
            }
        })
    })
}
function renderMessageToDom(messagesArr){
    messageContainer.innerHTML = '' ; 
    let temp = '' ;
    messagesArr.forEach((messageArr) => {
        temp += `
        <div class="col-md-4">
            <div class="questionBox" data-message="${messageArr[1].userMessage}">
                <div class="d-flex justify-content-between">
                    <div>
                        <div class="text-start h5">${messageArr[1].userName}</div>
                        <p>${messageArr[1].userEmail}</p>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="40" height="40" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        `
    })
    messageContainer.insertAdjacentHTML('beforeend' , temp);
}
function openMessageEvent(){
    let messagesElem = document.querySelectorAll('.questionBox');
    messagesElem.forEach(messageElem => {
        messageElem.addEventListener('click' , function (ev) {
            let messageText = ev.currentTarget.dataset.message
            swal.fire({
                title : 'سوال <hr>' ,
                text : messageText ,
                confirmButtonText : 'بازگشت'
            });
        })
    })
}
// -------------------------------------------------------------------------
window.addEventListener('load' , async function () {
    renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart'))?.length ?? '');
    dateElem.innerHTML =  new Date().toLocaleDateString('fa-IR');

    let userToken = localStorage.getItem('mimKala-user-token');
    if(!userToken){
        await swal.fire({
            icon: 'error',
            title: 'ابتدا وارد شوید' , 
            text: 'برای دسترسی به پنل وارد شوید' ,
        })
        window.location.href = "./../../pages/store/index.html"
        return
    }
    // render sideBar
    let userDataObj = await readUserData(userToken);
    if(userDataObj.accessLevel === 'user'){
        await swal.fire({
            icon: 'error',
            title: 'شما به این پنل دسترسی ندارید' , 
        })
        window.location.href = "./../../pages/userPanel/panel.html"
        return
    }
    renderSidebarToDom(userDataObj);
    logOutHandler()
    // render dashboard
    let allMessages = await readAllMessages()
    renderMessageToDom(allMessages);
    openMessageEvent()
    
})
setInterval(() => {
    clockElem.innerHTML =  new Date().toLocaleTimeString();
 } , 1000)
