import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";

window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);

let cartCountContainer = document.getElementById('cartCount');

let clockElem = document.getElementById('panelClock');
let dateElem = document.getElementById('panelDate');

let sidebarContainer = document.getElementById('sidebarContainer');
let discountCodesContainer = document.getElementById('discountCodesContainer');

let addDiscountCodeBtn = document.getElementById('addDiscountCodeBtn');


// -------------------------------------------------------------------------------
async function readUserData(token){
    let userDataReq = await fetch(`https://mimkala-default-rtdb.firebaseio.com/users/${token}.json`)
    let userDataObj = await userDataReq.json();
    return userDataObj
}
async function readAllDiscountCodes(){
    let allDiscountCodeReq = await fetch(`https://mimkala-default-rtdb.firebaseio.com/discountcodes.json`)
    let allDiscountCode = await allDiscountCodeReq.json();
    console.log(allDiscountCode)
    return Object.entries(allDiscountCode ?? []);
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
                        <div class="sidebarItem active">
                            <a href="./discountCodes.html">تخفیف ها</a>
                        </div>
                        <div class="sidebarItem">
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
function renderDiscountCodesToDom(discountCodesArr = []){
    discountCodesContainer.innerHTML = '' ;
    if(discountCodesArr.length === 0){
        discountCodesContainer.insertAdjacentHTML('beforeend' , `
            <div class="alert alert-warning m-3 h5">هیچ کد فعالی وجود ندارد</div>
        `)
        return
    }
    let temp = '' ;
    discountCodesArr.forEach((discountCodeArr) => {
        temp += `
        <tr>
                                <td>${discountCodeArr[1].name}</td>
                                <td>${discountCodeArr[1].value}</td>
                                <td>${discountCodeArr[1].expires}</td>
                                <td>
                                    <svg class="removeDiscount pointerC" data-token="${discountCodeArr[0]}" xmlns="http://www.w3.org/2000/svg" width="24" height="25" fill="rgb(220,53,69)" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                                    </svg>
                                </td>
        </tr>
        `
    })
    discountCodesContainer.insertAdjacentHTML('beforeend' , temp)
}
function removeDiscountHandler(){
    let removeDiscountBtns = document.querySelectorAll('.removeDiscount');
    removeDiscountBtns.forEach(removeDiscountBtn => {
        removeDiscountBtn.addEventListener('click' , (ev) => {
            let discountToken = ev.currentTarget.dataset.token ;
            swal.fire({
                icon : 'warning' , 
                title : 'کد تخفیف حذف شود؟' , 
                showCancelButton : true ,
                confirmButtonText : 'حذف' ,
                cancelButtonText : 'بازگشت'
            }).then((res) => {
                if(res.isConfirmed){
                    fetch(`https://mimkala-default-rtdb.firebaseio.com/discountcodes/${discountToken}.json` , {
                        method : 'DELETE'
                    }).then(async (res) => {
                        if(res.status === 200){
                            swal.fire({
                                title : 'کد تخفیف با موفقیت حذف شد ' , 
                                icon : 'success' ,
                            })
                            // render dashboard
                            let allDiscountCode = await readAllDiscountCodes()
                            renderDiscountCodesToDom(allDiscountCode);
                            removeDiscountHandler()
                        }
                    })
                }
            })
        })
    })
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
// ----------------------------------------------------------------------
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
    let allDiscountCode = await readAllDiscountCodes()
    renderDiscountCodesToDom(allDiscountCode);
    removeDiscountHandler()
    
})
addDiscountCodeBtn.addEventListener('click' , function () {
    swal.fire({
        title : '<div class="h4">کد تخفیف جدید</div><hr>' ,
        html : `
            <div>
                <input type="text" placeholder="کد تخفیف" id="discountCodeName" class=" my-2 form-control rtlDir border-0 border-dark rounded-0 border-bottom">
                <input type="number" placeholder="درصد" id="discountCodevalue" class=" my-2 form-control rtlDir border-0 border-dark rounded-0 border-bottom">
                <input type="number" placeholder="تعداد نفرات" min="0" max="100" id="discountCodeExpire" class="  my-2 form-control rtlDir border-0 border-dark rounded-0 border-bottom">
            </div>
        ` ,
        showCancelButton: true,
        confirmButtonText: 'افزودن',
        cancelButtonText : 'بازگشت'
    }).then((res) => {
        if(res.isConfirmed){
            let discountCodeName ,discountCodevalue ,discountCodeExpire ;
            discountCodeName = document.getElementById('discountCodeName').value
            discountCodevalue = document.getElementById('discountCodevalue').value
            discountCodeExpire = document.getElementById('discountCodeExpire').value
            if(discountCodeName && discountCodevalue && discountCodeExpire){
                let newCode = {
                    name : discountCodeName ,
                    value : discountCodevalue , 
                    expires : discountCodeExpire
                }
                fetch('https://mimkala-default-rtdb.firebaseio.com/discountcodes.json' , {
                    method : 'post' , 
                    headers : {
                        'content-type'  : 'application/json'
                    },
                    body : JSON.stringify(newCode)
                }).then(async (res) => {
                    if(res.status === 200){
                        swal.fire({
                            icon : 'success' , 
                            title : 'کد تخفیف شما با موفقیت اضافه شد'
                        })
                        // render dashboard
                        let allDiscountCode = await readAllDiscountCodes()
                        renderDiscountCodesToDom(allDiscountCode);
                        removeDiscountHandler()
                    }
                })
            }else{
                swal.fire({
                    title : 'لطفا ورودی هارا به درستی تکمیل کنید'  , 
                    icon :  'warning'
                })
            }
        }
    })
})
setInterval(() => {
    clockElem.innerHTML =  new Date().toLocaleTimeString();
 } , 1000)
