import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";
window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);
let cartCountContainer = document.getElementById('cartCount');


let clockElem = document.getElementById('panelClock');
let dateElem = document.getElementById('panelDate');

let sidebarContainer = document.getElementById('sidebarContainer');
let dashboardContainer = document.getElementById('dashboardContainer')
// ---------------------------------------------------------------------------------------
async function readUserInfo(token){
    let userInfoReq = await fetch(`https://mimkala-default-rtdb.firebaseio.com/users/${token}.json`)
    let userInfoObj = await userInfoReq.json()
    return userInfoObj
}
function renderCartBasketToDom(productCountInCart){
    cartCountContainer.innerHTML = `
        <span slot="cartCount"  class="badge bg-danger cartAlert rounded-circle">${productCountInCart}</span>
    `
}
function renderSideBarToDom(userInfoObj){
    sidebarContainer.innerHTML = '' ;
    let temp = `
    <div class="sidebarMenu">
        <div class="d-flex flex-column align-items-center justify-content-center p-3 my-4">
            <img src="./../../images/profileImg.png" alt="profile" width="150" height="150">
            <div class="d-flex justify-content-center align-items-center mt-3">
                <div>${userInfoObj.username}</div>
            </div>
            <span class="accessLevel text-muted">${userInfoObj.accessLevel}</span>
        </div>
        <div class="sidebarMenuItems text-center py-2">
            <div class="active">
                <a href="./panel.html">پیشخوان</a>
            </div>
            <div>
                <a href="./orders.html">سفارشات</a>
            </div>
            <div>
                <a href="./datails.html">جزییات حساب</a>
            </div>
            <div id="logOutBtn" class="pointerC text-danger">
                <a >خروج</a>
            </div>
        </div>
    </div>
    `
    sidebarContainer.insertAdjacentHTML('beforeend' , temp)

}
// sections
function renderDashboradToDom(userInfoObj){
    dashboardContainer.innerHTML = '' ;
    let temp = `
    <div class="row">
        <div class="col-md-4">
            <div class="shadow box bg-warning h5 text-white">
                <div>سطح دسترسی</div>
                <div class="mt-2">${userInfoObj.accessLevel}</div>
            </div>
        </div>
        <div class="col-md-4">
            <div id="conectionStatusBox" class="shadow box ${navigator.onLine ? 'bg-online' : 'bg-offline'} h5 text-white">
                <div>وضعیت</div>
                <div class="mt-2" id="conectionStatusText">${navigator.onLine ? 'انلاین' : 'افلاین'}</div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="shadow box bg-secondary h5 text-white">
                <div>سفارشات</div>
                <div class="mt-2">${Object.entries(userInfoObj.orders ?? []).length}</div>
            </div>
        </div>
    </div>
    <div class="row justify-content-center mt-5 pt-5">
        <img src="./../../images/profileImg.png" class="profileImage">
        <div class="text-center mt-3">
            <div class="profileName h4">${userInfoObj.username}</div>
            <div class="text-muted">${userInfoObj.accessLevel}</div>
            <div class="h5">${userInfoObj.email}</div>
            <div class="h6">${userInfoObj.phone}</div>
        </div>
    </div>   
    `
    dashboardContainer.insertAdjacentHTML('beforeend' , temp);
}
function logOutHandler(){
    swal({
        title : 'خروج از حساب کاربری' ,
        text : 'ایا می خواهید از حساب کاربری خود خارج شوید ؟' , 
        icon: "error",
        buttons: ["نه!", "خروج!"],
        dangerMode: true,
    }).then((res) => {
        if(res){
            localStorage.removeItem('mimKala-user-token');
            window.location.href = './../../pages/store/index.html'
        }
    })
}
// ---------------------------------------------------------------------------------------
 window.addEventListener('load' , async function () {
    renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart'))?.length ?? '');
    dateElem.innerHTML =  new Date().toLocaleDateString('fa-IR');

    let userToken = localStorage.getItem('mimKala-user-token');
    if(!userToken){
        await swal({
            title : 'لطفا وارد شوید' ,
            text : 'برای دسترسی به پنل مدیرتی کاربر ابتدا وارد شوید و یا ثبت نام  کنید ' , 
            icon: "error",
            button: "باشه",
        })
        window.location.href = './../store/index.html'
    }else{
        let userInfoObj = await readUserInfo(userToken);
        if(userInfoObj.accessLevel === 'admin') {
            window.location.href = './../adminPanel/panel.html' ;
            return
        }
        renderSideBarToDom(userInfoObj);
        let logOutBtn = document.getElementById('logOutBtn')
        logOutBtn.addEventListener('click' , logOutHandler)
        renderDashboradToDom(userInfoObj)
    }
})
window.addEventListener('online', () => {
    let connectionStatus = document.getElementById('conectionStatusBox');
    let conectionStatusText = document.getElementById('conectionStatusText')
    connectionStatus.classList.remove('bg-offline');
    connectionStatus.classList.add('bg-online');
    conectionStatusText.innerHTML = 'انلاین'
});
window.addEventListener('offline', () => {
    let connectionStatus = document.getElementById('conectionStatusBox');
    let conectionStatusText = document.getElementById('conectionStatusText')
    connectionStatus.classList.remove('bg-online');
    connectionStatus.classList.add('bg-offline');
    conectionStatusText.innerHTML = 'افلاین'
});
 setInterval(() => {
    clockElem.innerHTML =  new Date().toLocaleTimeString();
 } , 1000)