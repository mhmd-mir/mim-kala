import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";
window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);
let cartCountContainer = document.getElementById('cartCount');

let sidebarContainer = document.getElementById('sidebarContainer');
let ordersContainer = document.getElementById('ordersContainer');

let clockElem = document.getElementById('panelClock');
let dateElem = document.getElementById('panelDate');


///-------------------------------------------------------------------------
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
            <div >
                <a href="./panel.html">پیشخوان</a>
            </div>
            <div class="active">
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
function renderOrdersToDom(ordersArrEntry){
    ordersContainer.innerHTML = '' ;
    if(!ordersArrEntry.length){
        ordersContainer.innerHTML = `<div class="alert alert-warning">شما محصولی خریداری نکرده اید</div>`
        return
    }
    let temp = '' ;
    ordersArrEntry.forEach(function (orderArr) {
        temp += `
        <div class="oreder mb-5">
                        <div class="my-3 h4 text-start">سفارش ${orderArr[0].slice(-4)}</div>
                        <div class="table-responsive">
                            <table class="table table-hover">
                            <thead class="table-secondary">
                                <tr>
                                    <th>محصول</th>
                                    <th>قیمت</th>
                                    <th>تعداد</th>
                                    <th>جمع نهایی</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${createProductRowTableTemp(orderArr[1])}
                            </tbody>
                            </table>
                        </div>
                    </div>
        `
    })
    ordersContainer.insertAdjacentHTML('beforeend' , temp);
}
function createProductRowTableTemp(productList){
    let temp = '' ;
    productList.forEach(function (productObj){
        temp+=`
        <tr class="midVertical">
            <td>
                <div class="d-flex align-items-center">
                    <div class="mx-2">
                        <img width="75" src="./../../${productObj.img}" class=" rounded border">
                    </div>
                    <div class="mx-2 text-start">
                        <p class="mb-0 h5">${productObj.title}</p>
                        <span class="badge bg-danger my-2">${productObj.discount}%</span>
                    </div>
                </div>
            </td>
            <td class="h5 text-muted">${productObj.price}</td>
            <td>
                <input disabled type="number" width="50" min="1" max="10" value="${productObj.count}" class="changeCount" >
            </td>
            <td class="h5 text-muted">${productObj.count * productObj.price}</td>
        </tr>
        `
    })
    return temp ;
}
// --------------------------------------------------------------------------
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
        renderSideBarToDom(userInfoObj);
        renderOrdersToDom(Object.entries(userInfoObj.orders ?? []))
        let logOutBtn = document.getElementById('logOutBtn')
        logOutBtn.addEventListener('click' , logOutHandler);
    }
})
setInterval(() => {
   clockElem.innerHTML =  new Date().toLocaleTimeString();
} , 1000)