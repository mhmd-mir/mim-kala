import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";
window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);
let cartCountContainer = document.getElementById('cartCount');

let sidebarContainer = document.getElementById('sidebarContainer');
let datailsContainer = document.getElementById('datailsContainer');

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
            <div >
                <a href="./orders.html">سفارشات</a>
            </div>
            <div class="active">
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
function renderDatailsToDom(userInfoObj){
    datailsContainer.innerHTML = '' ;
    let temp = `
    <div class="datailsForm">
        <div class="text-start h3 mt-4 text-primary">اطلاعات حساب کاربری</div>
        <hr>
        <div class="row">
            <div class="col-md-6">
                <div class="text-start my-4">
                    <label for="username" class="px-2 h5 text-muted">نام کاربری</label>
                    <input name="username" value="${userInfoObj.username}" class="form-control" disabled>
                </div>
            </div>
            <div class="col-md-6">
                <div class="text-start my-4">
                    <label for="email" class="px-2 h5 text-muted">ایمیل</label>
                    <input name="email" value="${userInfoObj.email}" class="form-control " disabled>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="text-start my-3">
                <label for="phone" class="px-2 h5 text-muted">شماره تلفن</label>
                <input name="phone" value="${userInfoObj.phone}" class="form-control " disabled>
            </div>
        </div>
        <hr class="mt-4">
        <div class="text-start">
            <button class="btn btn-danger text-white" id="changePasswordBtn">تغییر رمز ورود</button>
        </div>
    </div>
    `
    datailsContainer.insertAdjacentHTML('beforeend' , temp);
}
function logOutHandler(){
    swal.fire({
        title : 'خروج از حساب کاربری' ,
        text : 'ایا می خواهید از حساب کاربری خود خارج شوید ؟' , 
        showCancelButton: true,
        icon: "error",
        cancelButtonText: 'نه',
        confirmButtonText: 'خروج',
        dangerMode: true,
    }).then((res) => {
        if(res.isConfirmed){
            localStorage.removeItem('mimKala-user-token');
            window.location.href = './../../pages/store/index.html'
        }
    })
}
function changePasswordHandler(userInfoObj , userToken){
    Swal.fire({
        title: '<strong>تغییر رمز ورود</strong>',
        icon: 'warning',
        html:`
            <div dir="rtl">
                <input type="password" class="form-control my-2" placeholder="رمز عبور قبلی" id="oldPass"/>
                <input type="password" class="form-control my-2" placeholder="رمز عبور جدید" id="newPass"/>
                <input type="password" class="form-control my-2" placeholder="تکرار رمز عبور جدید" id="newPassRep"/>
            </div>
            <div class="text-start text-muted h6 my-3">رمز عبور حداقل باید 8 کاراکتر باشد </div>
        ` ,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText : 'تایید' ,
        cancelButtonText : 'بازگشت'
      }).then(res => {
        if(res.isConfirmed){
            if(userInfoObj.password !== document.getElementById('oldPass').value){
                Swal.fire({
                    icon: 'error',
                    title: 'رمز عبور قبلی را به درستی وارد کنید',
                  })
                  return
            }
            if(document.getElementById('newPass').value.length >= 8 && document.getElementById('newPass').value == document.getElementById('newPassRep').value){
                fetch(`https://mimkala-default-rtdb.firebaseio.com/users/${userToken}/password.json` , {
                    method : 'PUT' , 
                    headers : {
                        'content-type' : 'application/jso'
                    },
                    body : JSON.stringify(document.getElementById('newPass').value)
                }).then(res => {
                    if(res.status == 200){
                        Swal.fire({
                            icon: 'success',
                            title: 'عملیات با موفیقت انجام شد',
                          })
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'مشکلی وجود دارد',
                          })
                    }
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'ورودی هارا به درستی کامل کنید',
                  })
                  return
            }
        }
      })
}
// --------------------------------------------------------------------------
window.addEventListener('load' , async function () {
    renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart'))?.length ?? '');

    dateElem.innerHTML =  new Date().toLocaleDateString('fa-IR');


    let userToken = localStorage.getItem('mimKala-user-token');
    if(!userToken){
        await swal.fire({
            title : 'لطفا وارد شوید' ,
            text : 'برای دسترسی به پنل مدیرتی کاربر ابتدا وارد شوید و یا ثبت نام  کنید ' , 
            icon: "error",
            button: "باشه",
        })
        window.location.href = './../store/index.html'
    }else{
        let userInfoObj = await readUserInfo(userToken);
        renderSideBarToDom(userInfoObj);
        renderDatailsToDom(userInfoObj);
        let changePasswordBtn = document.getElementById('changePasswordBtn');
        changePasswordBtn.addEventListener('click' , function (){
            changePasswordHandler(userInfoObj , userToken)
        })
        let logOutBtn = document.getElementById('logOutBtn')
        logOutBtn.addEventListener('click' , logOutHandler)
    }
})
setInterval(() => {
   clockElem.innerHTML =  new Date().toLocaleTimeString();
} , 1000)