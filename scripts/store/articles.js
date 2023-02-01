import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";
window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent); 



let articlesContainer = document.getElementById('articlesContainer');
let cartCountContainer = document.getElementById('cartCount')
// ---------------------------------------------------------------------
async function readAllArticles(){
    let allArticlesRequest = await fetch('https://mimkala-default-rtdb.firebaseio.com/articles.json')
    let allArticles = await allArticlesRequest.json();
    
    return Object.entries(allArticles)
}
function renderCartBasketToDom(productCountInCart){
    cartCountContainer.innerHTML = `
        <span slot="cartCount"  class="badge bg-danger cartAlert rounded-circle">${productCountInCart}</span>
    `
}
function renderAllArticlesToDom(allArticlesArr){
    articlesContainer.innerHTML = '' ;
    let articleTemplete = '' ;
    allArticlesArr.forEach((articleArr) => {
        articleTemplete += `
        <div class="col-lg-4 mt-5">
            <div class="blogBox">
                <div class="w-100"><img src="./../../${articleArr[1].img}" class="w-100 img-fluid rounded-top shoesBlog"></div>
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
                    <a target="_blank" href="./article.html?blog=${articleArr[0]}" class="px-3 text-decoration-none text-info hover-link">...بیشتر</a>
                </div>
            </div>
        </div>
        `
    })
    articlesContainer.insertAdjacentHTML('beforeend' , articleTemplete);
}
function renderErrorToDom(errText){
    articlesContainer.innerHTML = `
        <div class="alert alert-danger text-center w-75 mx-auto">${errText}</div>
    `
}



// -----------------------------------------------------------------------
window.addEventListener('load' , async function () {
    renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart'))?.length ?? '');
    let allArticlesArr = await readAllArticles();
    if(allArticlesArr[0][0] == 'error'){
        renderErrorToDom('مقاله ای یافت نشد / مشکلی وجود دارد');
        return
    }
    renderAllArticlesToDom(allArticlesArr);
})