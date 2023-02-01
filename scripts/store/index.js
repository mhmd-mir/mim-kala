import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";
window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);


// -----------------------------------------------------------------
// all dom storages 
let popularProductsContainer = document.getElementById('products');
let popularArticlesContainer = document.getElementById('blogs');
let cartCountContainer = document.getElementById('cartCount')
// ------------------------------------------------------------------
// all functions
async function readPopularProducts(){
    let popularProducts = []
    let productsRequest = await fetch('https://mimkala-default-rtdb.firebaseio.com/products.json');
    let productsData = await productsRequest.json()
    productsData =  Object.entries(productsData)
    // for(const key in productsData) {
    //     popularProducts.push(productsData[key])
    //     if(popularProducts.length == 4) break
    // }
    for(let i = 0 ; i<=3 ; i++){
        popularProducts.push(productsData[i])
    }
    return popularProducts
}
async function readPopularArticles(){
    let popularArticles = []
    let ArticlesRequest = await fetch('https://mimkala-default-rtdb.firebaseio.com/articles.json');
    let ArticlesData = await ArticlesRequest.json()
    ArticlesData = Object.entries(ArticlesData);
    // for(const key in ArticlesData) {
    //     popularArticles.push(ArticlesData[key])
    //     if(popularArticles.length == 3) break
    // }
    for(let i = 0 ; i<=2 ; i++){
        popularArticles.push(ArticlesData[i]);
    }
    return popularArticles
}
async function readShoesData(shoesToken){
    let shoesDataRequest = await fetch(`https://mimkala-default-rtdb.firebaseio.com/products/${shoesToken}.json`);
    let shoesDataObj = await shoesDataRequest.json();
    return shoesDataObj
}
function renderPopularProductsToDom(popularProducts){
    popularProductsContainer.innerHTML = '' ;
    let templeteContainer = '' ;
    popularProducts.forEach((productArr) => {
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
    popularProductsContainer.insertAdjacentHTML('beforeend',templeteContainer)
}
function renderPopularArticlesToDom(popularArticles){
    popularArticlesContainer.innerHTML = '' ;
    let templeteContainer = '' ;
    popularArticles.forEach((articleArr) => {
        templeteContainer += `
        <div class="col-lg-4 mt-5">
            <div class="blogBox">
                <div class="w-100"><img src="./../../${articleArr[1].img}" class="w-100 img-fluid rounded-top"></div>
                <div class="blogsIcon">
                <div class="badge bg-warning">میم کالا</div>
                    <div>
                        <i class="fa-regular fa-clock"></i>
                        <span>1400/12/07</span>
                    </div>
                </div>
                <div class="text-center h3 m-2">
                    <a target="_blank" href="./article.html?blog=${articleArr[0]}" class="text-decoration-none text-dark">${articleArr[1].title}</a>
                </div>
                <div class="text-muted p-3 blogContent">${articleArr[1].content}</div>
                <div class="pb-3">
                    <a  target="_blank" href="./article.html?blog=${articleArr[0]}" class="px-3 text-decoration-none text-info hover-link">...بیشتر</a>
                </div>
            </div>
        </div>
        `
    })
    popularArticlesContainer.insertAdjacentHTML('beforeend',templeteContainer);
}
function renderErrorToDom(errText , container){
    container.innerHTML = `
        <div class="alert alert-danger text-center w-75 mx-auto">${errText}</div>
    `
}
function renderCartBasketToDom(productCountInCart){
    cartCountContainer.innerHTML = `
        <span slot="cartCount"  class="badge bg-danger cartAlert rounded-circle">${productCountInCart}</span>
    `
}
// add Product To Cart Handler
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
function settingCartEvents(){
    let addToCartBtns = document.querySelectorAll('.addToCartBtn');
    addToCartBtns.forEach((addToCartBtn) => {
        addToCartBtn.addEventListener('click' , (ev) => {
            addProductToCartHandler(ev ,ev.target.dataset.token)
        })
    })
}
// -----------------------------------------------------------------
//all events
window.addEventListener('load' , async function(){
    renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart'))?.length ?? '');
    // read and render popular producs from server in DOM
    let popularProducts = await readPopularProducts() ;
    if(popularProducts[0][0] == 'error'){
        renderErrorToDom('محصولی یافت نشد' , popularProductsContainer);
    }else{
        renderPopularProductsToDom(popularProducts);
    }
    // set event /// add to cart
    settingCartEvents();
    // let addToCartBtns = document.querySelectorAll('.addToCartBtn');
    // addToCartBtns.forEach((addToCartBtn) => {
    //     addToCartBtn.addEventListener('click' , (ev) => {
    //         addProductToCartHandler(ev ,ev.target.dataset.token)
    //     })
    // })
    // read and render popular articles from server in DOM
    let popularArticles = await readPopularArticles() ;
    if(popularArticles[0][0] == 'error'){
        renderErrorToDom('محصولی یافت نشد' , popularArticlesContainer);
    }else{
        renderPopularArticlesToDom(popularArticles);
    }
})
