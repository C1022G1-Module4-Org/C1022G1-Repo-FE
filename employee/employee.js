$(document).ready(() => {
    loadEmployee();
})

const loadEmployee = () => {
    let keySearch = $("#search").val();
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/apple/employee/list-employee`,
        headers:{
            "Content-Type":"application/JSON",
        },
        success: (data) => {
            listEmployee(data.content);
        },
        error: (error) => {
            console.log(error);
        }
    })
}

const listEmployee = (employees) => {
    listPosition();
    let element = ``;
    for (let employee of employees){
        element += `
        <div class="d-flex justify-content-center container mt-5">
        <div class="card p-3 bg-white"><i class="fa fa-user-o"></i>
            <div class="about-employee text-center mt-2"><img src="${employee.imgUrl}" width="100">
                <div>
                    <h6> ${employee.name}</h6>
                    <h6 class="mt-0 text-black-50"></h6>
                </div>
            </div>
            <div class="stats mt-2">
                <div class="d-flex justify-content-between p-price"> Date Of Birth : ${employee.dateOfBirth}</div>
                <div class="d-flex justify-content-between p-price"> Id-card : ${employee.idCard}</div>
                <div class="d-flex justify-content-between p-price"> Phone Number : ${employee.phoneNumber}</div>
                <div class="d-flex justify-content-between p-price"> Address : ${employee.address}</div>
                <div class="d-flex justify-content-between p-price"> Position: ${employee.position.name}</div>
                <div onclick="deleteEmployee('${employee.name}','${employee.id}')" class="d-flex justify-content-between align-item-center p-price">
                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">
                        Delete
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editModal">
                    Edit
                </button>
                </div>
            </div>
        </div>
    </div>
        `
    $("#listEmployee").html(element);
    }
}

const listPosition = () => {
        $.ajax({
        type: "GET",
        url: `http://localhost:8080/apple/employee/position`,
        headers: {
            "Content-Type":"application/JSON"
        },
        success: (data) => {
            showListPosition(data)
        },
        error: (error) => {
            console.log(error);
        }
    })
}

const showListPosition = (listPositionCategory) => {
    let element = `<label class="form-label">Position</label>
    <select class='form-control' id='listPositionValue'>`;
    for (let position of listPositionCategory){
        element += `<option value=${position.id}>${position.name}</option>`
    }
    element += `</select>`
    $("#listPositionCategory").html(element);
}

const addNew = () => {
    let nameEmployee = $('#employeeName').val();
    let idCard = $('#idCard').val();
    let dateofbirth = $('#dateofbirth').val();
    let img = $('#img').val();
    let phoneNumber = $('#phoneNumber').val();
    let address = $('#address').val();
    let position = $('#listPositionValue').val();
    addNewEmployee(nameEmployee,idCard,dateofbirth,phoneNumber,address,img,position)
}

const addNewEmployee = (nameEmployee,dateofbirth,idCard,phoneNumber,address,img,position) => {
    $.ajax({
        type: "POST",
        url: `http://localhost:8080/apple/employee`,
        headers:{
            "Content-Type" : "application/JSON"
        },
        data: JSON.stringify({
            name : nameEmployee,
            dateOfBirth : dateofbirth,
            idCard: idCard,
            imgUrl : img,
            phoneNumber : phoneNumber,
            address :address,
            position : {id: position}
        }),
        success: (data) => {
            alert("Thêm thành công")
        },
        error : (error) => {
            console.log(error);
        }
    })
}
const deleteEmployee = (nameEmployee, id) => {
    debugger
    $("#deleteEmployeeName").html(nameEmployee);
    $("#deleteEmployeeForm").click(() => {
        deleteEmployeeButton(id);
    } 
    )   
}

const deleteEmployeeButton = (id) => {
    debugger
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/apple/employee/${id}`,
        headers:{
            "Content-Type" : "application/JSON"
        },
        
        success: (data) => {
            console.log("Xóa thành công");
        },
        error: (error) => {
            console.log(error);
        }
    })
}
