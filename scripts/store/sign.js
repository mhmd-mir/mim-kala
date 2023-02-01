import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";
window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);

let singInputs = document.querySelectorAll('.singInputs')
let usernameInput = document.getElementById('usernameInput')
let emailInput = document.getElementById('emailInput')
let phoneInput = document.getElementById('phoneInput')
let passwordInput = document.getElementById('passwordInput')
let registerBtn = document.getElementById('registerBtn');
let cartCountContainer = document.getElementById('cartCount')
// --------------------------------------------------------------

async function readAllUsers(){
    let allUsersReq = await fetch('https://mimkala-default-rtdb.firebaseio.com/users.json');
    let allUserData = await allUsersReq.json();
    return Object.entries(allUserData)
}
function renderCartBasketToDom(productCountInCart){
    cartCountContainer.innerHTML = `
        <span slot="cartCount"  class="badge bg-danger cartAlert rounded-circle">${productCountInCart}</span>
    `
}
function createUser(username , email , phone , password , accessLevel = 'user' , orders = []){
    return ({
        username ,
        email ,
        phone ,
        password ,
        accessLevel ,
        orders
    })
}
function isValidate(regex , input){
    return regex.test(input);
}







// -----------------------------------------------------------------
registerBtn.addEventListener('click' ,async function (ev) {
    ev.target.innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    `
    let [username , email ,phone , password] = [usernameInput.value , emailInput.value , phoneInput.value , passwordInput.value] ;
    let isValidAllData = isValidate(/^.{3,}$/g , username) && isValidate(/^[a-zA-Z0-9_\-\.]+@\w+\.\w{2,5}$/g , email) && isValidate(/^09\d{9}$/g , phone) && (password.length > 7)
    if(isValidAllData){
       let newUser = createUser(username , email ,phone , password);
       let allUsers = await readAllUsers()
       let isEmailUnuniq = allUsers.some((user) => {
            return user[1].email == newUser.email
       })
       if(isEmailUnuniq){
        swal({
            title : 'این ایمیل قبلا ثبت نام شده است' ,
            text : 'لطفا وارد شوید' , 
            icon: "warning",
            button: "باشه",
        })
        ev.target.innerHTML = 'ثبت نام'
       }else{
            fetch('https://mimkala-default-rtdb.firebaseio.com/users.json' , {
                method : 'POST' , 
                headers : {
                    'content-type' : 'application/json'
                } ,
                body : JSON.stringify(newUser)
            })
            .then(res => res.status)
            .then(status => {
                if(status == 200){
                    swal({
                        title : 'ثبت نام شما با موفقیت انجام شد' ,
                        text : 'لطفا وارد شوید' , 
                        icon: "success",
                        button: "ورود",
                    }).then(res => {
                        if(res){
                            ev.target.innerHTML = 'ثبت نام'
                            window.location.href = 'login.html';
                        }
                    })
                }else{
                    swal({
                        title : 'عملیات ثبت نام با خطا مواجه شد' ,
                        text : 'لطفا دوباره امتحان کنید' , 
                        icon: "error",
                        button: "باشه",
                    })
                    ev.target.innerHTML = 'ثبت نام'
                }
            })
       }
    }else{
        swal({
            title: "اطلاعات وارد شده نادرست می باشد",
            text:  "لطفا اطلاعات خواسته شده را به درستی وارد کنید",
            icon: "error",
            button: "باشه",
          })
    }
})
singInputs.forEach((inputsElem) => {
    inputsElem.addEventListener('keyup' , (ev) => {
        let target = ev.target ;
        switch(target.dataset.validate){
            case 'username' : {
                let isValid = isValidate(/^.{3,}$/g , target.value)
                if(isValid){
                    target.classList.remove('notValid')
                }else{
                    target.classList.add('notValid')
                }
                break
            }
            case 'email' : {
                let isValid = isValidate(/^[a-zA-Z0-9_\-\.]+@\w+\.\w{2,5}$/g , target.value)
                if(isValid){
                    target.classList.remove('notValid')
                }else{
                    target.classList.add('notValid')
                }
                break
            }
            case 'phone' : {
                let isValid = isValidate(/^09\d{9}$/g , target.value)
                if(isValid){
                    target.classList.remove('notValid')
                }else{
                    target.classList.add('notValid')
                }
                break
            }
            case 'password' : {
                let isValid = target.value.length > 7
                if(isValid){
                    target.classList.remove('notValid')
                }else{
                    target.classList.add('notValid')
                }
                break
            }
        }
    })
})
window.addEventListener('load', () => {
    renderCartBasketToDom(JSON.parse(localStorage.getItem('mimKala-cart')).length);
})