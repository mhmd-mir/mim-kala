import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";
window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);

let articleContainer = document.getElementById('articleContainer');
let cartCountContainer = document.getElementById('cartCount')
// -------------------------------------------------------------------
async function readArticleData(articleToken){
    let articleDataRequest = await fetch(`https://mimkala-default-rtdb.firebaseio.com/articles/${articleToken}.json`)
    let articleDataObj = await articleDataRequest.json();
    return articleDataObj
}
function renderCartBasketToDom(productCountInCart){
    cartCountContainer.innerHTML = `
        <span slot="cartCount"  class="badge bg-danger cartAlert rounded-circle">${productCountInCart}</span>
    `
}
function renderArticleToDom(articleDataObj){
    articleContainer.innerHTML = `
    <div class="article">
        <div class="articleTitle"> 
            <p class="display-4">${articleDataObj.title}</p> 
        </div>
    <div class="my-4">
        <img src="./../../${articleDataObj.img}" width="600" class="img-fluid rounded p-3 border">
    </div>
    <div class="my-5 bg-light p-3 rounded">
        <div class="articleContent text-start h5 border-bottom pb-4">
            ${articleDataObj.content}
        </div>
        <div class="my-3 text-start">
            <div class="badge bg-dark ">مقاله</div>
            <div class="badge bg-dark ">کفش</div>
            <div class="badge bg-dark ">میم کالا</div>
            <div class="badge bg-dark ">خواندنی</div>
        </div>
    </div>
    </div>
    `
}


function renderErrorToDom(errText){
    articleContainer.innerHTML = `
        <div class="alert alert-danger text-center w-75 mx-auto">${errText}</div>
    `
}
// -------------------------------------------------------------------- 
window.addEventListener('load' , async function () {
    renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart'))?.length ?? '');
    let urlParams = new URLSearchParams(location.search);
    let articleToken = urlParams.get('blog');
    let articleDataObj = await readArticleData(articleToken);
    console.log(articleDataObj)
    if(articleDataObj == null || articleDataObj.error){
        renderErrorToDom('مقاله ای یافت نشد / مشکلی وجود دارد');
        return
    }
    renderArticleToDom(articleDataObj)
})