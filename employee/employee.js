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

const listEmployee = (data) => {
    listPosition();
    let element = ``;
    for (let employee of data){
        element += `
        <tr>
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.idCard}</td>
            <td>${employee.dateOfBirth}</td>
            <td>${employee.phoneNumber}</td>
            <td>${employee.address}</td>
            <td>${employee.position.name}</td>
            <td>
                <button type="button" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#editModal"
                onclick= "openEditModal(
                    '${employee.id}','${employee.name}','${employee.idCard}',
                    '${employee.dateOfBirth}','${employee.phoneNumber}','${employee.address}'
                    )" >Edit</button>
            </td>
            <td>
                <button type="button" class="btn btn-danger" 
                onclick= "deleteEmployee('${employee.name}','${employee.id}')" 
                data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
            </td>
        </tr>
    `

    $("#listEmployee").html(element);
    debugger
         // Update pagination
     let totalPages = parseInt(data.totalPages);
     let pageNumber = parseInt(data.number);
     let pagination = `<li class="page-item ${pageNumber == 0 ? 'disabled' : ''}">
     <a class="page-link" href="#" onclick="changePage(${pageNumber - 1})">Previous</a></li>`;
     for (let i = 0; i < totalPages; i++){
         pagination += `<li class="page-item ${i == pageNumber ? 'active' : ''}">
         <a class="page-link" href="#" onclick="changePage(${i})">${i + 1}</a></li>`;
     }
     pagination += `<li class="page-item ${pageNumber == totalPages - 1 ? 'disabled' : ''}">
     <a class="page-link" href="#" onclick="changePage(${pageNumber + 1})">Next</a></li>`;
     $('#pagination').html(pagination);
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
    $("#editListPosition").html(element);


}

const addNew = () => {
    let nameEmployee = $('#employeeName').val();
    let idCard = $('#idCard').val();
    let dateofbirth = $('#dateofbirth').val();
    let img = $('#img').val();
    let phoneNumber = $('#phoneNumber').val();
    let address = $('#address').val();
    let position = $('#listPositionValue').val();
    addNewEmployee(nameEmployee,dateofbirth,idCard,phoneNumber,address,img,position)
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
            phoneNumber : phoneNumber,
            address :address,
            imgUrl : img,
            position : {id: position}
        }),
        success: (data) => {
            alert("Create success")
        },
        error : (error) => {
            console.log(error);
        }
    })
}

//==========Edit===========
 

const openEdit = (id,name, dateOfBirth, idCard, phoneNumber, address, imgUrl) =>{
    actionEdit(name, dateOfBirth, idCard, phoneNumber, address, imgUrl);
    $('#indexFind').val(id);}

    const openEditModal = () => {
        let id = $('#indexFind').val();
        let name = $('#employeeNameEdit').val();
        let dateOfBirth = $('#dateofbirthEdit').val();
        let idCard = $('#idCardEdit').val();
        let phoneNumber = $('#phoneEdit').val();
        let address = $('#addressEdit').val();
        let imgUrl = $('#imgEdit').val();
        addUpdateEmployee(id,name,dateOfBirth,idCard,phoneNumber,address,imgUrl)
    }


  const actionEdit = (name, dateOfBirth, idCard, phoneNumber, address, imgUrl) => {
    debugger
    let element =`
                <div class="mb-3">
                    <label for="employeeIdEdit" class="form-label">Employee name</label>
                    <input type="text" class="form-control" id="employeeIdEdit" aria-describedby="employeeIdEdit">
                </div>      
                <div class="mb-3">
                    <label for="employeeNameEdit" class="form-label">Employee name</label>
                    <input type="text" class="form-control" id="employeeNameEdit" aria-describedby="employeeNameEdit">
                </div>      
                <div class="mb-3">
                    <label for="dateofbirthEdit" class="form-label">Date of Birth</label>
                    <input type="text" class="form-control" id="dateofbirthEdit" aria-describedby="dateofbirthEdit">
                </div>
                <div class="mb-3">
                    <label for="idCardEdit" class="form-label">ID Card</label>
                    <input type="text" class="form-control" id="idCardEdit" aria-describedby="idCardEdit">
                </div>
                <div class="mb-3">
                    <label for="phoneEdit" class="form-label">Phone Number</label>
                    <input type="text" class="form-control" id="phoneEdit" aria-describedby="phoneEdit">
                </div>
                <div class="mb-3">
                    <label for="addressEdit" class="form-label">Address :</label>
                    <input type="text" class="form-control" id="addressEdit" aria-describedby="addressEdit">
                </div>
                <div class="mb-3">
                    <label for="imgEdit" class="form-label">Img</label>
                    <input type="text" class="form-control" id="imgEdit" aria-describedby="imgEdit">
                </div>
                `
    $("#menuEdit").html(element);
}

const addUpdateEmployee = (id,nameEmployee,dateOfBirth,idCard,phoneNumber,address,imgUrl,position) => {
    $.ajax({
        type: 'PUT',
        url: `http://localhost:8080/apple/employee/${id}`,
        data: JSON.stringify({
            name: nameEmployee,
            dateOfBirth: dateOfBirth,
            idCard: idCard,
            imgUrl: imgUrl,
            phoneNumber: phoneNumber,
            address: address,
            position: {id:position}
        }),
        success: (data) =>{
            alert("Update success")
          // Close the edit modal
          loadEmployee();
          $('#editModal').modal('hide');
        },
        error: (error) => {
          console.log(error);
        }
      });
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
            alert("Delete success")
            $('#deleteModal').modal('hide');
        },
        error: (error) => {
            console.log(error);
        }
    })
}
