function login(){
    let userName = $("#username").val();
    let passWord = $("#password").val();

    $.ajax({
        type: "POST",
        url: `http://localhost:8080/api/auth/login`,
        data: JSON.stringify({
            usernameOrEmail: userName,
            password: passWord
        }),
        headers: {
            "dataType": "json",
            "Content-Type": "application/json",
        },
        success: function (data) {
            localStorage.setItem('token', data.accessToken)
            alert("Login success")
            window.location.href = "layout/index.html"
               },
        error: function (xhr, textStatus, errorThrown) {   
            alert("error");
            console.log(xhr.responceText);
        }
    })
}


function register(){
    debugger
    let userName = $("#username-register").val();
    let passWord = $("#password-register").val();
    let email = $("#email-register").val();
    let fullName = $("#fullname-register").val();

    $.ajax({
        type: "POST",
        url: `http://localhost:8080/api/auth/signup`,
        data: JSON.stringify({
            name: fullName,
            username: userName,
            email: email,
            password: passWord
        }),
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {
            alert("Register success")
            console.log(data)
        },
        error: function (error) {   
            console.log(error);
            if(error.status === 400){
                alert(error.responseJSON
                .message);
        
            }
        }
    })
}