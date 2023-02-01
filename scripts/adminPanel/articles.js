import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";

window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);

let cartCountContainer = document.getElementById('cartCount');

let clockElem = document.getElementById('panelClock');
let dateElem = document.getElementById('panelDate');

let sidebarContainer = document.getElementById('sidebarContainer');
let articlesContainer = document.getElementById('articlesContainer');

let addArticleToDatabase = document.getElementById('addArticleToDatabase');


// -----------------------------------------------------------------------

async function readUserData(token){
    let userDataReq = await fetch(`https://mimkala-default-rtdb.firebaseio.com/users/${token}.json`)
    let userDataObj = await userDataReq.json();
    return userDataObj
}
async function readAllArticles(){
    let allArticlesReq = await fetch('https://mimkala-default-rtdb.firebaseio.com/articles.json')
    let allArticlesData = await allArticlesReq.json();
    return Object.entries(allArticlesData)
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
                        <div class="sidebarItem">
                            <a href="./products.html">محصولات</a>
                        </div>
                        <div class="sidebarItem active">
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
function renderArticlesToDom(articlesEntryArr){
    articlesContainer.innerHTML = '' ;
    let temp = '' ;
    articlesEntryArr.forEach((articletArr) => {
        temp += `
        <div class="col-lg-6 mt-5">
            <div class="blogBox">
                <div class="w-100"><img src="./../../${articletArr[1].img}" class="shoesBlog w-100 img-fluid rounded-top"></div>
                <div class="blogsIcon">
                <div class="badge bg-warning">میم کالا</div>
                    <div>
                        <i class="fa-regular fa-clock"></i>
                        <span>1400/12/07</span>
                    </div>
                </div>
                <div class="text-center h3 m-2">
                    <a target="_blank" class="text-decoration-none text-dark">${articletArr[1].title}</a>
                </div>
                <div class="text-muted p-3 blogContent">${articletArr[1].content}</div>
                <div class="pb-3 text-center p-3">
                    <button data-token="${articletArr[0]}" class="btn w-75 rounded-0 btn-danger removeArticleFromDatabase">حذف مقاله</button>
                </div>
            </div>
        </div>
        `
    })
    articlesContainer.insertAdjacentHTML('beforeend' , temp);
}
function removeArticleEvents(){
    let removeArticleBtns = document.querySelectorAll('.removeArticleFromDatabase');
    removeArticleBtns.forEach((removeArticleBtn) => {
        removeArticleBtn.addEventListener('click' ,function (ev) {
            swal.fire({
                icon : 'warning' , 
                title  : 'مقاله از فروشگاه حذف شود؟' ,
                showCancelButton : true ,
                confirmButtonText : 'حذف' , 
                cancelButtonText : 'بازگشت'
            }).then((res) => {
                if(res.isConfirmed){
                    let articleToken = ev.target.dataset.token ;
                    ev.target.innerHTML = `<div class="spinner-border mx-auto customSize" role="status"><span class="visually-hidden"></span></div>`
                    fetch(`https://mimkala-default-rtdb.firebaseio.com/articles/${articleToken}.json` , {
                        method : 'DELETE'
                    }).then(async (res) => {
                    if(res.status === 200){
                        swal.fire({
                            icon: 'success',
                            title: 'عملیات با موفقیت انجام شد' , 
                            text: 'مقاله مورد نظر شما با موفقیت حذف شد' ,
                        })
                        ev.target.innerHTML = 'حذف مقاله' ;
                        let allArticlesArr = await readAllArticles();
                        renderArticlesToDom(allArticlesArr);
                        removeArticleEvents()
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
    let allArticlesArr = await readAllArticles();
    renderArticlesToDom(allArticlesArr);
    removeArticleEvents()
})
addArticleToDatabase.addEventListener('click' , function () {
    swal.fire({
        title : '<div class="h4">مقاله جدید</div><hr>' ,
        html : `
            <div>
                <input type="text" placeholder="عنوان مقاله" id="articleName" class=" my-2 form-control rtlDir border-0 border-dark rounded-0 border-bottom">
                <input type="file" placeholder="عکس محصول" id="articleImg" class=" my-2 form-control  border-0 border-dark rounded-0 border-bottom">
                <textarea placeholder="محتویات مقاله" id="articleContent" class="form-control rtlDir"></textarea>
            </div>
        ` ,
        showCancelButton: true,
        confirmButtonText: 'افزودن',
        cancelButtonText : 'بازگشت'
    }).then(res => {
        if(res.isConfirmed){
            let title , img , content ;
            title = document.getElementById('articleName').value
            img = 'images/' + document.getElementById('articleImg').files[0]?.name ;
            content = document.getElementById('articleContent').value
            if(title && img && content){
                let newArticle = {
                    title,
                    img,
                    content
                }
                fetch('https://mimkala-default-rtdb.firebaseio.com/articles.json' , {
                method : 'POST' , 
                headers : {
                    'content-type' : 'application/json'
                } , 
                body : JSON.stringify(newArticle)
                }).then( async (res) => {
                    if(res.status === 200){
                        swal.fire({
                            icon : 'success' , 
                            title : 'عملیات با موفقیت انجام شد ' ,
                            text : 'محصول مورد نظر با موفیقت اضافه شد'
                        })
                        let allArticlesArr = await readAllArticles();
                        renderArticlesToDom(allArticlesArr);
                        removeArticleEvents()
                    }
                })
            }else{
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