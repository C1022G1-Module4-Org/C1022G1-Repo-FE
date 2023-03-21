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
                onclick= "openEditModal(${employee.id})" >Edit</button>
            </td>
            <td>
                <button type="button" class="btn btn-danger" 
                onclick= "deleteEmployee('${employee.name}','${employee.id}')" 
                data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
            </td>
        </tr>
    `

    $("#listEmployee").html(element);
         // Update pagination
     let totalPages = employees.totalPages;
     let pageNumber = employees.pageNumber;
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
    debugger
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
            alert("Create success")
        },
        error : (error) => {
            console.log(error);
        }
    })
}

//==========Edit===========

function openEditModal(name, dateofbirth, idCard, phoneNumber, address, image, position) {
  
    document.getElementById("employeeName").value = name;
    document.getElementById("dateofbirth").value = dateofbirth;
    document.getElementById("idCard").value = idCard;
    document.getElementById("phoneNumber").value = phoneNumber;
    document.getElementById("address").value = address;
    document.getElementById("image").value = image;
    document.getElementById("listPositionCategory").value = ('#listPositionValue').val(position);

    // Open the modal
    $('#editModal').modal('show');
  }

  function saveChanges() {
    // Get the employee data from the modal fields
    let nameEmployee = $('#employeeName').val();
    let idCard = $('#idCard').val();
    let dateofbirth = $('#dateofbirth').val();
    let img = $('#img').val();
    let phoneNumber = $('#phoneNumber').val();
    let address = $('#address').val();
    let position = $('#listPositionValue').val();
    addUpdateEmployee(nameEmployee,idCard,dateofbirth,phoneNumber,address,img,position)
}

const addUpdateEmployee = (nameEmployee,dateofbirth,idCard,phoneNumber,address,img,position) => {
    $.ajax({
        type: 'PUT',
        url: 'http://localhost:8080/apple/employee/' + id,
        data: JSON.stringify({
            name: nameEmployee,
            dateOfBirth: dateofbirth,
            idCard: idCard,
            imgUrl: img,
            phoneNumber: phoneNumber,
            address: address,
            position : {id: position}
        }),
        success: (data) =>{
            alert("Update success")
          // Close the edit modal
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
