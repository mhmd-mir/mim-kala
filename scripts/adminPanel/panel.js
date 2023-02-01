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
async function CountNumbersFromDatabase(table){
    let allDatabaseReq = await fetch(`https://mimkala-default-rtdb.firebaseio.com/${table}.json`);
    let allDatabase = await allDatabaseReq.json()
    return Object.entries(allDatabase).length
}
async function readUserData(token){
    let userDataReq = await fetch(`https://mimkala-default-rtdb.firebaseio.com/users/${token}.json`)
    let userDataObj = await userDataReq.json();
    return userDataObj
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
                        <div class="sidebarItem active">
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
function renderDashboardToDom(usersCount, productsCount ,articlesCount,messagesCount){
    dashboardContainer.innerHTML = '' ; 
    let temp = `
    <div class="row mt-4">
    <div class="col-md-3">
        <div  class="bg-secondary rounded p-3 text-center h4 text-white">
            <div>${usersCount} کاربر</div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="bg-success rounded p-3 text-center h4 text-white">
            <div>${productsCount} محصول</div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="bg-warning rounded p-3 text-center h4 text-white">
            <div>${articlesCount} مقاله</div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="bg-primary rounded p-3 text-center h4 text-white">
            <div>${messagesCount} سوال</div>
        </div>
    </div>
</div>
<div class="row mt-4">
<canvas id="sellsChart"></canvas>
</div>
    `
    dashboardContainer.insertAdjacentHTML('beforeend' , temp)
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
    let usersCount = await CountNumbersFromDatabase('users');
    let productsCount = await CountNumbersFromDatabase('products');
    let articlesCount = await CountNumbersFromDatabase('articles');
    let messagesCount = await CountNumbersFromDatabase('messages');
    renderDashboardToDom(usersCount, productsCount ,articlesCount,messagesCount);
    
     /// handling sell chart
    let myChartElem = document.getElementById('sellsChart');
    const myChart = new Chart(myChartElem, {
    type: 'line',
    data: {
        labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور' , 'مهر' , 'ابان' , 'اذر' , 'دی' , 'بهمن' , 'اسفند'],
        datasets: [{
            label: 'فروش سال گذشته (میلیون )',
            data: [55, 37, 42, 38, 67,55,58,66,80,77,99,122],
            backgroundColor: '#ffc234' ,
            borderColor: '#ff6384' ,
            borderWidth: 3
        }]
    },
    options: {
        scales: {
            x: {
                beginAtZero: true ,
                ticks: {
                    font: {
                        family: 'vazir', // Your font family
                        size: 11,
                    },
                }
            }
        }
    }
    });

})
setInterval(() => {
    clockElem.innerHTML =  new Date().toLocaleTimeString();
 } , 1000)

