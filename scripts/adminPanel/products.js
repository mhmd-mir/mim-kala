import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";

window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);

let cartCountContainer = document.getElementById('cartCount');

let clockElem = document.getElementById('panelClock');
let dateElem = document.getElementById('panelDate');

let sidebarContainer = document.getElementById('sidebarContainer');
let productsContainer = document.getElementById('productsContainer');

let addProductToDatabaseBtn = document.getElementById('addProductToDatabase');
// -----------------------------------------------------------------------

async function readUserData(token){
    let userDataReq = await fetch(`https://mimkala-default-rtdb.firebaseio.com/users/${token}.json`)
    let userDataObj = await userDataReq.json();
    return userDataObj
}
async function readAllProduct(){
    let allProductsReq = await fetch('https://mimkala-default-rtdb.firebaseio.com/products.json')
    let allProductData = await allProductsReq.json();
    return Object.entries(allProductData)
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
                        <div class="sidebarItem">
                            <a href="./users.html">کاربران</a>
                        </div>
                        <div class="sidebarItem active">
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
function renderProductsToDom(productsEntryArr){
    productsContainer.innerHTML = '' ;
    let temp = '' ;
    productsEntryArr.forEach((productArr) => {
        temp += `
        <div class="col-md-4">
            <div class="productBox">
                <div class="text-center">
                    <img src="./../../${productArr[1].img}" class="img-fluid">
                </div>
                <div class="productTitle">
                <div>
                    <a class="text-decoration-none text-dark">${productArr[1].title}</a>
                </div>
                </div>
                <div class="productPrice">
                <div class="d-flex justify-content-between align-items-center w-100">
                    <span class="discountedProce">${(productArr[1].price * ((100 - productArr[1].discount) / 100)).toFixed()}</span>
                    <span class="badge bg-primary">${productArr[1].discount}%</span>
                </div>
                <span class="mainPrice mt-2 text-decoration-line-through text-muted">${productArr[1].price}</span>
                </div>
                <div class="text-center mt-3">
                    <button class="btn text-white w-100 bg-danger removeProductFromDatabase" data-token="${productArr[0]}">حذف محصول</button>
                </div>
            </div>
        </div>
        `
    })
    productsContainer.insertAdjacentHTML('beforeend' , temp);
}
function removeProductEvents(){
    let removeProductBtns = document.querySelectorAll('.removeProductFromDatabase');
    removeProductBtns.forEach((removeProductBtn) => {
        removeProductBtn.addEventListener('click' ,function (ev) {

            swal.fire({
                icon : 'warning' , 
                title  : 'محصول از فروشگاه حذف شود؟' ,
                showCancelButton : true ,
                confirmButtonText : 'حذف' , 
                cancelButtonText : 'بازگشت'
            }).then((res) => {
                if(res.isConfirmed){
                    let productToken = ev.target.dataset.token ;
                    ev.target.innerHTML = `<div class="spinner-border mx-auto customSize" role="status"><span class="visually-hidden"></span></div>`
                    fetch(`https://mimkala-default-rtdb.firebaseio.com/products/${productToken}.json` , {
                        method : 'DELETE'
                    }).then(async (res) => {
                    if(res.status === 200){
                        swal.fire({
                            icon: 'success',
                            title: 'عملیات با موفقیت انجام شد' , 
                            text: 'محصول مورد نظر شما با موفقیت حذف شد' ,
                        })
                        ev.target.innerHTML = 'حذف محصول' ;
                        let allProductsArr = await readAllProduct();
                        renderProductsToDom(allProductsArr);
                        removeProductEvents()
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

//----------------------------------------------------------
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
    // read & render products
    let allProductsArr = await readAllProduct();
    renderProductsToDom(allProductsArr);
    removeProductEvents()
})
addProductToDatabaseBtn.addEventListener('click' , function () {
    swal.fire({
        title : '<div class="h4">محصول جدید</div><hr>' ,
        html : `
            <div>
                <input type="text" placeholder="نام محصول" id="productName" class=" my-2 form-control rtlDir border-0 border-dark rounded-0 border-bottom">
                <input type="number" placeholder="قیمت" id="productPrice" class=" my-2 form-control rtlDir border-0 border-dark rounded-0 border-bottom">
                <input type="number" placeholder="تخفیف" min="0" max="100" id="productDiscount" class="  my-2 form-control rtlDir border-0 border-dark rounded-0 border-bottom">
                <input type="file" placeholder="عکس محصول" id="productImg" class=" my-2 form-control  border-0 border-dark rounded-0 border-bottom">
                <textarea placeholder="توضیحات محصول" id="productContent" class="form-control rtlDir"></textarea>
            </div>
        ` ,
        showCancelButton: true,
        confirmButtonText: 'افزودن',
        cancelButtonText : 'بازگشت'
    }).then(res => {
        if(res.isConfirmed){
            let title , price , discount , img , content ;
            title = document.getElementById('productName').value
            price = document.getElementById('productPrice').value
            discount = document.getElementById('productDiscount').value
            img = 'images/' + document.getElementById('productImg').files[0].name ;
            content = document.getElementById('productContent').value
            if(title && price && discount && img && content){
                let newProduct = {
                    title,
                    price,
                    discount,
                    img,
                    content
                }
                fetch('https://mimkala-default-rtdb.firebaseio.com/products.json' , {
                method : 'POST' , 
                headers : {
                    'content-type' : 'application/json'
                } , 
                body : JSON.stringify(newProduct)
                }).then( async (res) => {
                    if(res.status === 200){
                        swal.fire({
                            icon : 'success' , 
                            title : 'عملیات با موفقیت انجام شد ' ,
                            text : 'محصول مورد نظر با موفیقت اضافه شد'
                        })
                        let allProductsArr = await readAllProduct();
                        renderProductsToDom(allProductsArr);
                        removeProductEvents()
                    }
                })
            } else{
                swal.fire({
                    icon : 'error' , 
                    title : 'تمام فیلد هارا به درستی پر کنید'
                })
            }
            
        }
    })
})
setInterval(() => {
    clockElem.innerHTML =  new Date().toLocaleTimeString();
 } , 1000)