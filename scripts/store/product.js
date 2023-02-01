import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";
window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);

// ----------------------------------------------------------------
let addCommentStartElem = document.querySelectorAll('.addCommentRate');
let shoesDataContainer = document.getElementById('shoesDataContainer');
let commentsContainer = document.getElementById('commentsContainer');
let cartCountContainer = document.getElementById('cartCount')

let usernameInput = document.getElementById('usernameInput')
let emailInput = document.getElementById('emailInput')
let commentInput = document.getElementById('commentInput')
let addCommentBtn = document.getElementById('addCommentBtn');

// -------------------------------------------------------------------
function isValidate(regex , input){
    return regex.test(input);
}
function changeColor(num , rateStar){
    if(rateStar >= num){
        return '#ffc107'
    }else{
        return '#212529'
    }
}
function renderCartBasketToDom(productCountInCart){
    cartCountContainer.innerHTML = `
        <span slot="cartCount"  class="badge bg-danger cartAlert rounded-circle">${productCountInCart}</span>
    `
}
async function readShoesData(shoesToken){
    let shoesDataRequest = await fetch(`https://mimkala-default-rtdb.firebaseio.com/products/${shoesToken}.json`);
    let shoesDataObj = await shoesDataRequest.json();
    return shoesDataObj
}
function renderShoesDataToDom(shoesDataObj){
    shoesDataContainer.innerHTML = `
    <div class="col-lg-6 text-center">
        <img src="./../../${shoesDataObj.img}" class="img-fluid rounded border border-dark" width="500">
    </div>
    <div class="col-lg-6 text-start mt-lg-0 mt-4">
        <div>
            <div class="h2">نام محصول</div>
            <div class="h3 my-3 text-muted">  
                ${shoesDataObj.title}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                </svg>
            </div>
        </div>
        <div>
            <div class="h2 my-3">توضیحات</div>
                <p class="text-muted">
                    ${shoesDataObj.content}
                </p>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-4">
            <div class="mainPrice display-4 text-decoration-line-through text-muted">${shoesDataObj.price}</div>
            <div class="discount badge bg-danger p-2">${shoesDataObj.discount}%</div>
        </div>
        <div class="text-end">
            <div class="discountedPrice display-5">${(shoesDataObj.price * ( (100 - shoesDataObj.discount) / 100 )).toFixed()}</div>
        </div>
    <div class="mt-3">
        <button class="w-100 p-2 text-white border-0 rounded bg-orange" id="addToCartBtn">افزودن به سبد</button>
    </div>
    </div>
    `
}
function renderCommentsToDom(commentsArr = []){
    commentsContainer.innerHTML = ''
    let commentsTemplete = '' ; 
    commentsArr.forEach((commentObj ) => {
        commentsTemplete += `
        <div class="comment ps-5 p-3 border border-dark rounded mt-3">
            <div class="commentAuthor border-bottom pb-2">${commentObj[1].name}</div>
            <div class="commentRate pt-2">
                <svg fill="${changeColor(1 ,commentObj[1].rate )}" xmlns="http://www.w3.org/2000/svg"  width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg fill="${changeColor(2 , commentObj[1].rate)}" xmlns="http://www.w3.org/2000/svg"  width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg fill="${changeColor(3 , commentObj[1].rate)}" xmlns="http://www.w3.org/2000/svg"  width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg fill="${changeColor(4 , commentObj[1].rate)}" xmlns="http://www.w3.org/2000/svg"  width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg fill="${changeColor(5 , commentObj[1].rate)}" xmlns="http://www.w3.org/2000/svg"  width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
            </div>
            <p class="text-muted commentContent pt-1">${commentObj[1].comment}</p>
        </div>
        `
    }) 
    commentsContainer.insertAdjacentHTML('beforeend' , commentsTemplete);
}
function renderErrorToDom(errText){
    shoesDataContainer.innerHTML = `
        <div class="alert alert-danger text-center w-75 mx-auto">${errText}</div>
    `
}
function renderNoCommentToDom(){
    commentsContainer.innerHTML = `
        <div class="alert alert-warning text-center w-25 me-auto">هیچ نظری موجود نیست</div>
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
    renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart')).length);
    ev.target.innerHTML = `افزودن به سبد`
}
// --------------------------------------------------------------------
window.addEventListener('load', async function () {
    renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart'))?.length ?? '');
    let urlParams = new URLSearchParams(location.search);
    let shoesToken = urlParams.get('shoes')
    let shoesDataObj = await readShoesData(shoesToken);
    if(shoesDataObj == null){
        renderErrorToDom('اطلاعات محصول یافت نشد')
        return
    }
    renderShoesDataToDom(shoesDataObj)
    // add to cart ev
    document.getElementById('addToCartBtn').addEventListener('click' , (ev) => {
        addProductToCartHandler(ev , shoesToken)
    })
    let commentsArr = Object.entries(shoesDataObj.comments?? [])
    if(commentsArr.length == 0){
        renderNoCommentToDom();
        return
    }
    renderCommentsToDom(commentsArr)
});
addCommentStartElem.forEach((starElem) => {
    starElem.addEventListener('click', (ev) => {
        ev.currentTarget.classList.toggle('fillYellow')
    })
})
addCommentBtn.addEventListener('click' , function (ev) {
    let userToken = localStorage.getItem('mimKala-user-token')
    if(!userToken){
        swal({
            title : 'ابتدا وارد شوید' ,
            text : 'برای ارسال نظر ، ابتدا وارد شوید و یا از طریق صفحه ثبت نام ، حساب کاربری خود را ایجاد کنید' , 
            icon: "error",
            button: "ورود و ثبت نام",
        }).then((res) => {
            if(res){
                window.location.href = './login.html'
            }
        })
        return
    }
    let starsCounter = 0 ;
    addCommentStartElem.forEach((starElem) => {
        if(starElem.classList.contains('fillYellow')){
            starsCounter++
        }
    })
    console.log(starsCounter);
    let userName = usernameInput.value ;
    let userEmail = emailInput.value ;
    let userComment = commentInput.value ;
    if(!isValidate(/^.{3,}$/g , userName)){
        swal({
            title: "اطلاعات وارد شده نادرست می باشد",
            text:  "لطفا اطلاعات خواسته شده را به درستی وارد کنید",
            icon: "error",
            button: "باشه",
        })
        return
    }
    if(!isValidate(/^[a-zA-Z0-9_\-\.]+@\w+\.\w{2,5}$/g , userEmail)){
        swal({
            title: "اطلاعات وارد شده نادرست می باشد",
            text:  "لطفا اطلاعات خواسته شده را به درستی وارد کنید",
            icon: "error",
            button: "باشه",
        })
        return
    }
    if(!userComment){
        swal({
            title: "اطلاعات وارد شده نادرست می باشد",
            text:  "لطفا اطلاعات خواسته شده را به درستی وارد کنید",
            icon: "error",
            button: "باشه",
        })
        return
    }
    let urlParams = new URLSearchParams(location.search);
    let shoesToken = urlParams.get('shoes');
    let newComment = {
        name : userName , 
        comment : userComment ,
        rate : starsCounter
    }
    console.log(newComment)
    ev.target.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span'
    fetch(`https://mimkala-default-rtdb.firebaseio.com/products/${shoesToken}/comments.json` , {
        method : 'POST' , 
        headers : {
            'content-type' : 'application/json'
        },
        body : JSON.stringify(newComment)
    })
    .then(res => res.status)
    .then(status => {
        if(status === 200){
            swal({
                title: "نظر شما با موفقیت ثبت شد",
                text:  "نظر شما ارسال شد و پس از برسی ، منتشر خواهد شد",
                icon: "success",
                button: "باشه",
            })
            ev.target.innerHTML = 'افزودن نظر'
        }else{
            swal({
                title: "عملیات با خطا مواجه شد",
                icon: "error",
                button: "باشه",
            }) 
            ev.target.innerHTML = 'افزودن نظر'
        }
    })
})