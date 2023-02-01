import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";
window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);




// ---------------------------------------------------------------
// all dom storages 
let allProductsContainer = document.getElementById('products');
let searchProductInput = document.getElementById('searchProductInput');
let searchProductButton = document.getElementById('searchProductButton');
let cartCountContainer = document.getElementById('cartCount')



// ---------------------------------------------------------------
// all functions
async function readAllProducts(){
    let allProductRequest = await fetch('https://mimkala-default-rtdb.firebaseio.com/products.json');
    let productsData = await allProductRequest.json();
    return Object.entries(productsData)
}
async function readShoesData(shoesToken){
    let shoesDataRequest = await fetch(`https://mimkala-default-rtdb.firebaseio.com/products/${shoesToken}.json`);
    let shoesDataObj = await shoesDataRequest.json();
    return shoesDataObj
}
function renderCartBasketToDom(productCountInCart){
    cartCountContainer.innerHTML = `
        <span slot="cartCount"  class="badge bg-danger cartAlert rounded-circle">${productCountInCart}</span>
    `
}
function renderAllProductsToDom(allProductsArr){
    allProductsContainer.innerHTML = '' ;
    if(allProductsArr.length == 0){
        renderErrorToDom('نتیجه‌ای یافت نشد!');
        return ;
    }
    let templeteContainer = '' ;
    allProductsArr.forEach( (productArr) => {
        templeteContainer += `
        <div class="col-lg-3">
            <div class="productBox">
                    <div class="text-center">
                        <img src="./../../${productArr[1].img}" class="img-fluid">
                    </div>
                    <div class="productTitle">
                        <div>
                             <a target="_blank" href="./product.html?shoes=${productArr[0]}" class="text-decoration-none text-dark">${productArr[1].title}</a>
                        </div>
                    </div>
                <div class="productPrice">
                    <div class="d-flex justify-content-between align-items-center w-100">
                    <span class="discountedProce">${(productArr[1].price * ((100 - productArr[1].discount) / 100)).toFixed()}</span>
                    <span class="badge bg-danger">${productArr[1].discount}%</span>
                </div>
                    <span class="mainPrice mt-2 text-decoration-line-through text-muted">${productArr[1].price}</span>
                </div>
                <div class="text-center mt-3">
                    <button class="btn text-white w-100 bg-orange addToCartBtn" data-token="${productArr[0]}">اضافه به سبدخرید</button>
                </div>
            </div>
        </div>
        `
    })
    allProductsContainer.insertAdjacentHTML('beforeend' , templeteContainer);
}
function renderErrorToDom(errText){
    allProductsContainer.innerHTML = `
        <div class="alert alert-danger text-center w-75 mx-auto">${errText}</div>
    `
}
function renderLoaderTemp(){
    allProductsContainer.innerHTML = `
        <div class="spinner-border mx-auto my-5" role="status">
        <span class="visually-hidden"></span>
        </div>
        <div class="text-center">درحال خواندن اطلاعات از سرور</div>
    `
}
async function addProductToCartHandler(ev ,token){
    ev.target.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span class="visually-hidden">Loading...</span>
    `
    let shoesDataObj = await readShoesData(token);
    shoesDataObj = {...shoesDataObj , count : 1 }
    let currentDataCart = JSON.parse(localStorage.getItem('mimKala-cart')) ?? [] ;
    let isExsistAlready = currentDataCart.some((shoesDataInCart) => {
        return shoesDataInCart.title == shoesDataObj.title 
    })
    let shoesDataIndex = currentDataCart.findIndex((shoesDataInCart) => {
        return shoesDataInCart.title == shoesDataObj.title 
    })
    if(!isExsistAlready){
        currentDataCart.push(shoesDataObj);
    }else{
        currentDataCart[shoesDataIndex].count += 1;
    }
    localStorage.setItem('mimKala-cart' , JSON.stringify(currentDataCart));
    renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart')).length)
    ev.target.innerHTML = `افزودن به سبد`
}
function settingCartEvent(){
    let addToCartBtns = document.querySelectorAll('.addToCartBtn');
    addToCartBtns.forEach((addToCartBtns) => {
        addToCartBtns.addEventListener('click' , (ev) => {
            addProductToCartHandler(ev , ev.target.dataset.token)
        })
    })
}
//----------------------------------------------------------------
// all events
window.addEventListener('load' , async function () {
    renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart'))?.length ?? '');
    let allProductsArr = await readAllProducts();
    if(allProductsArr[0][0] == 'error'){
        renderErrorToDom('محصولی یافت نشد / مشکلی در برنامه وجود دارد');
        return
    }
    renderAllProductsToDom(allProductsArr)
    settingCartEvent();
})
// search button ev
searchProductButton.addEventListener('click' , async function () {
    let userSearchText = searchProductInput.value ;
    if(!userSearchText) return
    renderLoaderTemp()
    let allProductsArr = await readAllProducts();
    let searchedProducts =  allProductsArr.filter((productArr) => {
        return productArr[1].title.includes(userSearchText);
    })
    renderAllProductsToDom(searchedProducts);
    settingCartEvent();
})

