import { HeaderComponent } from "../../component/Header/Header.js";
import { FooterComponent } from "../../component/Footer/Footer.js";
window.customElements.define('site-navbar', HeaderComponent);
window.customElements.define('site-footer', FooterComponent);

let loginBtn = document.getElementById('loginBtn');
let emailInput = document.getElementById('emailInput');
let passwordInput = document.getElementById('passwordInput');
// -----------------------------------------------------------
async function readAllUsers(){
    let allUsersReq = await fetch('https://mimkala-default-rtdb.firebaseio.com/users.json');
    let allUserData = await allUsersReq.json();
    return Object.entries(allUserData)
}

// -----------------------------------------------------------
loginBtn.addEventListener('click' , async function (ev) {
    let userEmail = emailInput.value ;
    let userPassword = passwordInput.value ;
    if(userEmail && userPassword){
        ev.target.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
         `
        let allUsers = await readAllUsers();
        let foundedUser = allUsers.find((userDataArr) => {
            return (userDataArr[1].email === userEmail) && (userDataArr[1].password === userPassword)
        })
        if(!foundedUser){
            swal({
                title : 'حساب کاربری وجود ندارد' ,
                text : 'لطفا نام کاربری و یا رمز عبور خود را به درستی وارد کنید و یا از طریق صفحه ثبت نام حساب کاربری خود را ایجاد کنید' , 
                icon: "error",
                button: "باشه",
            })
            ev.target.innerHTML = 'ورود به پنل'
        }else{
            let userToken = foundedUser[0];
            localStorage.setItem('mimKala-user-token' , userToken);
            ev.target.innerHTML = 'ورود به پنل'
            swal({
                title : 'ورود به پنل کاربری با موفقیت انجام شد' ,
                icon: "success",
                button: "ورود به پنل",
            }).then((res) => {
                if(res){
                    if(foundedUser[1].accessLevel === 'user'){
                        window.location.href = './../userPanel/panel.html';
                    }else if(foundedUser[1].accessLevel === 'admin'){
                        window.location.href = './../adminPanel/panel.html';
                    }
                }
            })
        }
    }
})
window.addEventListener('load' , function () {
    let isAlreadyLogined = localStorage.getItem('mimKala-user-token');
    if(!isAlreadyLogined) return
    window.location.href = './../userPanel/panel.html';
})