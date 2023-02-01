import { HeaderComponent } from "../../component/Header/Header.js"
import { FooterComponent } from "../../component/Footer/Footer.js"

window.customElements.define('site-navbar', HeaderComponent)
window.customElements.define('site-footer', FooterComponent)

let cartCountContainer = document.getElementById('cartCount');
let productCounter = document.getElementById('productCounter');
let CartProductsContainer = document.getElementById('userCartProducts');
let holeProductPriceContainer = document.getElementById('holeProductPrice');
let finallyPriceContainer = document.getElementById('finallyPrice');

let buyOrdersBtn = document.getElementById('buyOrders');

let addCopenBtn = document.getElementById('addCopenBtn');

// ---------------------------------------------------------------------
async function readAllCopens(){
    let allCopenReq = await fetch('https://mimkala-default-rtdb.firebaseio.com/discountcodes.json')
    let allCodesData = await allCopenReq.json()
    return Object.entries(allCodesData)
} 
function renderCartBasketToDom(productCountInCart){
    cartCountContainer.innerHTML = `
        <span slot="cartCount"  class="badge bg-danger cartAlert rounded-circle">${productCountInCart}</span>
    `
}
function renderProductCounterToDom(number){
    productCounter.innerHTML = `(${number} محصول)`
}
function renderProductCartToDom(cartProducts){
    CartProductsContainer.innerHTML = '' ;
    let temp = '' ;
    cartProducts.forEach( (productObj) => {
        temp += `
        <tr class="midVertical">
            <td>
                <div class="d-flex align-items-center">
                    <div class="mx-2">
                        <img width="75" src="./../../${productObj.img}" class="img-fluid rounded border"/>
                    </div>
                    <div class="mx-2">
                        <p class="mb-0 h5">${productObj.title}</p>
                        <span class="badge bg-danger my-2">${productObj.discount}%</span>
                    </div>
                </div>
            </td>
            <td class="h5 text-muted">${productObj.price}</td>
            <td>
                <input type="number" width="50" min="1" max="10" value="${productObj.count}" class="changeCount" data-productname="${productObj.title}">
            </td>
            <td class="h5 text-muted">${productObj.count * productObj.price }</td>
            <td>
                <svg class="removeProductFromCart" data-productname="${productObj.title}" xmlns="http://www.w3.org/2000/svg" width="24" height="25" fill="rgb(220,53,69)" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </td>
        </tr>
        `
    })
    CartProductsContainer.insertAdjacentHTML('beforeend' , temp)
}
function renderHoleProductsPriceToDom(cartProducts){
    let holePrice = 0 ;
    cartProducts.forEach((productObj) => {
        holePrice += (productObj.price * productObj.count)
    })
    holeProductPriceContainer.innerHTML = holePrice 
}
function renderFinallyPriceToDom(cartProducts , copen = 0){
    let finallyPrice = 0 ;
    cartProducts.forEach((productObj) => {
        finallyPrice += (productObj.price * productObj.count)
    })
    finallyPrice = ((1 - copen) * finallyPrice).toFixed() ;
    finallyPriceContainer.innerHTML = finallyPrice

}
// ev
function changeProductCountHandler(event){
    let productName = event.target.dataset.productname ;
    let userCurrentCart = [...JSON.parse(localStorage.getItem('mimKala-cart'))] ?? [] ;
    let index = userCurrentCart.findIndex((productObj) => {
        return productObj.title == productName
    })
    userCurrentCart[index].count = event.target.value
    localStorage.setItem('mimKala-cart' , JSON.stringify(userCurrentCart));
    renderProductCartToDom(JSON.parse(localStorage.getItem('mimKala-cart')));
    setChangeCountEvents()
    setRemoveProductEvent()
    renderHoleProductsPriceToDom(JSON.parse(localStorage.getItem('mimKala-cart')))
    renderFinallyPriceToDom(JSON.parse(localStorage.getItem('mimKala-cart')))
}
function removeProductFromCartHandler(event){
    let productName = event.currentTarget.dataset.productname ;
    swal({
        title: "ایا مطمعن هستید؟",
        text: "محصول مورد نظر از سبد شما حذف خواهد شد",
        icon: "warning",
        buttons: ['خیر' , 'بله'],
        dangerMode: true,
      }).then((res) => {
        if(res){
            let userCurrentCart = [...JSON.parse(localStorage.getItem('mimKala-cart'))] ?? [] ;
            userCurrentCart = userCurrentCart.filter((productObj) => {
                return productObj.title != productName
            });
            localStorage.setItem('mimKala-cart' , JSON.stringify(userCurrentCart));
            renderProductCartToDom(JSON.parse(localStorage.getItem('mimKala-cart')));
            setChangeCountEvents()
            setRemoveProductEvent()
            renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart')).length);
            renderProductCounterToDom(JSON.parse(localStorage.getItem('mimKala-cart')).length);
            renderHoleProductsPriceToDom(JSON.parse(localStorage.getItem('mimKala-cart')))
            renderFinallyPriceToDom(JSON.parse(localStorage.getItem('mimKala-cart')))
        }
      })
    // let productName = event.currentTarget.dataset.productname ;
    // let userCurrentCart = [...JSON.parse(localStorage.getItem('mimKala-cart'))] ?? [] ;
    // userCurrentCart = userCurrentCart.filter((productObj) => {
    //     return productObj.title != productName
    // });
    // localStorage.setItem('mimKala-cart' , JSON.stringify(userCurrentCart));
    // renderProductCartToDom(JSON.parse(localStorage.getItem('mimKala-cart')));
    // setChangeCountEvents()
    // setRemoveProductEvent()
    // renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart')).length);
    // renderProductCounterToDom(JSON.parse(localStorage.getItem('mimKala-cart')).length);
    // renderHoleProductsPriceToDom(JSON.parse(localStorage.getItem('mimKala-cart')))
    // renderFinallyPriceToDom(JSON.parse(localStorage.getItem('mimKala-cart')))
}
function setChangeCountEvents(){
    document.querySelectorAll('.changeCount').forEach((changeCountElem) => {
        changeCountElem.addEventListener('change' ,changeProductCountHandler)
    })
}
function setRemoveProductEvent(){
    document.querySelectorAll('.removeProductFromCart').forEach((removeElem) => {
        removeElem.addEventListener('click' , removeProductFromCartHandler)
    })
}
// -----------------------------------------------------------------
window.addEventListener('load' , function () {
    renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart')).length);
    renderProductCounterToDom(JSON.parse(localStorage.getItem('mimKala-cart')).length);
    renderProductCartToDom(JSON.parse(localStorage.getItem('mimKala-cart')))
    setChangeCountEvents()
    setRemoveProductEvent()
    renderHoleProductsPriceToDom(JSON.parse(localStorage.getItem('mimKala-cart')))
    renderFinallyPriceToDom(JSON.parse(localStorage.getItem('mimKala-cart')))
})
buyOrdersBtn.addEventListener('click' , function (ev) {
    let userToken = localStorage.getItem('mimKala-user-token');
    if(!userToken) {
        swal({
            title : 'ابتدا وارد شوید' ,
            text : 'برای ثبت سفارش ، ابتدا وارد شوید و یا از طریق صفحه ثبت نام ، حساب کاربری خود را ایجاد کنید' , 
            icon: "error",
            button: "ورود و ثبت نام",
        }).then((res) => {
            if(res){
                window.location.href = './login.html'
            }
        })
        return
    }
    let userOrdersArr = JSON.parse(localStorage.getItem('mimKala-cart')) ?? []
    if(userOrdersArr.length == 0){
        swal({
            title : 'سبد شما خالی است' ,
            icon: "info",
            button: "باشه",
        })
        return
    }
    ev.target.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
    fetch(`https://mimkala-default-rtdb.firebaseio.com/users/${userToken}/orders.json` , {
        method : 'post' , 
        headers : {
            'content-type' : 'application/json'
        } ,
        body : JSON.stringify(userOrdersArr)
    })
    .then(res => res.status)
    .then(status => {
        if(status === 200){
            localStorage.removeItem('mimKala-cart');
            ev.target.innerHTML = 'پرداخت' ;
            swal({
                title : 'خرید شما با موفقیت انجام شد' ,
                icon: "success",
                button:   "باشه",
            }).then(res => {
                if(res){
                    window.location.href = './index.html'
                }
            })
        }
    })
})
addCopenBtn.addEventListener('click' , async function (ev) {
    ev.target.innerHTML = `
    <div class="spinner-border mx-auto customSize" role="status"><span class="visually-hidden"></span></div>
    `
    let copenInput = document.getElementById('copenInput');
    let copenName = copenInput.value ;

    let allCopens = await readAllCopens()
    let copen = allCopens.find(coponArr => {
        return coponArr[1].name === copenName
    })
    if(copen){
        if(copen[1].expires > 0){
            renderFinallyPriceToDom(JSON.parse(localStorage.getItem('mimKala-cart')), (copen[1].value) / 100)
        }else{
            swal({
                icon : 'warning' , 
                title : 'کد تخفیف منقضی شده'
            })
        }
    }else{
        swal({
            icon : 'error' , 
            title : 'کد تخفیف وارد شده نادرست میباشد'
        })
    }
    ev.target.innerHTML = 'اعمال کد'
})