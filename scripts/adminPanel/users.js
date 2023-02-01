import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";

window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);


let cartCountContainer = document.getElementById('cartCount');

let clockElem = document.getElementById('panelClock');
let dateElem = document.getElementById('panelDate');

let sidebarContainer = document.getElementById('sidebarContainer');
let dashboardContainer = document.getElementById('dashboardContainer');

// -----------------------------------------------------------------------

async function readUserData(token){
    let userDataReq = await fetch(`https://mimkala-default-rtdb.firebaseio.com/users/${token}.json`)
    let userDataObj = await userDataReq.json();
    return userDataObj
}
async function readAllUsers(){
    let allUsersReq = await fetch('https://mimkala-default-rtdb.firebaseio.com/users.json')
    let allUsersData = await allUsersReq.json()
    return Object.entries(allUsersData)
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
                        <div class="sidebarItem ">
                            <a href="./panel.html">پیشخوان</a>
                        </div>
                        <div class="sidebarItem active">
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
function renderUsersToDom(allUsersArr){
    dashboardContainer.innerHTML = '' ; 
    let temp = `` ;
    allUsersArr.forEach((userArr, index) => {
        temp += `
        <tr >
                                    <td>${index + 1}</td>
                                    <td>${userArr[1].username}</td>
                                    <td>${userArr[1].email}</td>
                                    <td>${userArr[1].phone}</td>
                                    <td>
                                        <svg class="removeUserFromDatabase pointerC" data-token="${userArr[0]}" xmlns="http://www.w3.org/2000/svg" width="24" height="25" fill="rgb(220,53,69)" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                                        </svg>
                                    </td>
                                </tr>
        `
    })
    dashboardContainer.insertAdjacentHTML('beforeend' , temp)
}
function setRemoveUserEvent(){
    let removeUserBtns = document.querySelectorAll('.removeUserFromDatabase');
    removeUserBtns.forEach( (removeUserBtn) => {
        removeUserBtn.addEventListener('click' , (ev) => {
            let userToken = ev.currentTarget.dataset.token ;
            swal.fire({
                icon: 'warning',
                title: 'کاربر از سایت حذف شود؟' , 
                showCancelButton: true,
                confirmButtonText : 'حذف' , 
                cancelButtonText : 'نه'
            }).then((res) => {
                if(res.isConfirmed){
                    fetch(`https://mimkala-default-rtdb.firebaseio.com/users/${userToken}.json` , {
                        method : 'DELETE' , 
                    }).then(async function(res){
                        if(res.status === 200){
                            swal.fire({
                                icon: 'success',
                                title: 'کاربر با موفقیت حذف شد' , 
                            })
                            let allUsersData = await readAllUsers();
                            renderUsersToDom(allUsersData);
                            setRemoveUserEvent()
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
    // render users
    let allUsersData = await readAllUsers();
    renderUsersToDom(allUsersData);
    setRemoveUserEvent();
})
setInterval(() => {
    clockElem.innerHTML =  new Date().toLocaleTimeString();
 } , 1000)

