$(document).ready(() => {
  loadEmployee();
});

const loadEmployee = (nextPage) => {
  let keySearch = $("#search").val();
  $.ajax({
    type: "GET",
    url: `http://localhost:8080/apple/employee/list-employee?page=${nextPage ? nextPage : "0"}&search=`+keySearch,
    headers: {
      "Content-Type": "application/JSON",
    },
    success: (data) => {
      listEmployee(data.content);
      renderPage(data);

    },
    error: (error) => {
      console.log(error);
    },
  });
};

const listEmployee = (data) => {
  listPosition();
  let element = ``;
  for (let employee of data) {
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
                onclick="openEditModal(
                    '${employee.id}','${employee.name}','${employee.idCard}',
                    '${employee.dateOfBirth}','${employee.phoneNumber}','${employee.address}','${employee.imgUrl}'
                    )" class="d-flex justify-content-between align-item-center p-price">Edit</button>
            </td>
            <td>
                <button type="button" class="btn btn-danger" 
                onclick= "deleteEmployee('${employee.name}','${employee.id}')" 
                data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
            </td>
        </tr>
    `;

    $("#listEmployee").html(element);
    }
}

function movePage(nextPage) {
  loadEmployee(nextPage);
}

function renderPage(employee) {
  debugger  
    let page = "";
    if (employee.number == employee.totalPages - 1 && employee.number > 0) {
        page += `
    <button class="page-item btn" 
    onclick="movePage(${employee.number - 1})">
    <i class='fa-solid fa-backward-step'>Backward</i>
    </button>
    `
    }
    for (let i = 1; i <= employee.totalPages; i++) {
        let pageItem = $(`<button class="page-item number btn mx-1"
                      onclick="movePage(${i - 1})">
                      ${i}
                      </button>`);
        if (i === employee.number + 1) {
            pageItem.addClass("active");
        } else {
            pageItem.removeClass("active");
        }
        page += pageItem.prop('outerHTML');
    }

    if (employee.number == 0 && employee.number < employee.totalPages) {
        page += `
    <button class="page-item btn" 
    onclick="movePage(${employee.number + 1})">
    <i class='fa-solid fa-forward-step'>Forward</i>

    </button>
    `
    }
    $("#paging").html(page);
}

const listPosition = () => {
  $.ajax({
    type: "GET",
    url: `http://localhost:8080/apple/employee/position`,
    headers: {
      "Content-Type": "application/JSON",
    },
    success: (data) => {
      showListPosition(data);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

const showListPosition = (listPositionCategory) => {
  let element = `<label class="form-label">Position</label>
    <select class='form-control' id='listPositionValue'>`;
  for (let position of listPositionCategory) {
    element += `<option value=${position.id}>${position.name}</option>`;
  }
  element += `</select>`;
  $("#listPositionCategory").html(element);
  $("#editListPosition").html(element);
};

const addNew = () => {
  let nameEmployee = $("#employeeName").val();
  let idCard = $("#idCard").val();
  let dateofbirth = $("#dateofbirth").val();
  let img = $("#img").val();
  let phoneNumber = $("#phoneNumber").val();
  let address = $("#address").val();
  let position = $("#listPositionValue").val();
  addNewEmployee(
    nameEmployee,
    dateofbirth,
    idCard,
    phoneNumber,
    address,
    img,
    position
  );
};

const addNewEmployee = (
  nameEmployee,
  dateofbirth,
  idCard,
  phoneNumber,
  address,
  img,
  position
) => {
  $.ajax({
    type: "POST",
    url: `http://localhost:8080/apple/employee`,
    headers: {
      "Content-Type": "application/JSON",
    },
    data: JSON.stringify({
      name: nameEmployee,
      dateOfBirth: dateofbirth,
      idCard: idCard,
      phoneNumber: phoneNumber,
      address: address,
      imgUrl: img,
      position: { id: position },
    }),
    success: (data) => {
      alert("Create success");
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      loadEmployee();
    },
    error: (error) => {
      console.log(error);
    },
  });
};

//==========Edit===========

const openEditModal = (
  id,
  name,
  dateOfBirth,
  idCard,
  phoneNumber,
  address,
  imgUrl
) => {
  actionEdit(name, dateOfBirth, idCard, phoneNumber, address, imgUrl);
  $("#indexFind").val(id);
};

const openEdit = () => {
  let id = $("#indexFind").val();
  let name = $("#employeeNameEdit").val();
  let dateOfBirth = $("#dateofbirthEdit").val();
  let idCard = $("#idCardEdit").val();
  let phoneNumber = $("#phoneEdit").val();
  let address = $("#addressEdit").val();
  let imgUrl = $("#imgEdit").val();
  let position = $("#listPositionValue").val();
  addUpdateEmployee(
    id,
    name,
    dateOfBirth,
    idCard,
    phoneNumber,
    address,
    imgUrl,
    position
  );
};

const actionEdit = (
  name,
  dateOfBirth,
  idCard,
  phoneNumber,
  address,
  imgUrl
) => {
  let element = `
                <div class="mb-3">
                    <label for="employeeNameEdit" class="form-label">Employee name</label>
                    <input type="text" class="form-control" id="employeeNameEdit" value="${name}" aria-describedby="employeeNameEdit">
                </div>      
                <div class="mb-3">
                    <label for="dateofbirthEdit" class="form-label">Date of Birth</label>
                    <input type="text" class="form-control" id="dateofbirthEdit" value="${dateOfBirth}" aria-describedby="dateofbirthEdit">
                </div>
                <div class="mb-3">
                    <label for="idCardEdit" class="form-label">ID Card</label>
                    <input type="text" class="form-control" id="idCardEdit" value="${idCard}" aria-describedby="idCardEdit">
                </div>
                <div class="mb-3">
                    <label for="phoneEdit" class="form-label">Phone Number</label>
                    <input type="text" class="form-control" id="phoneEdit" value="${phoneNumber}" aria-describedby="phoneEdit">
                </div>
                <div class="mb-3">
                    <label for="addressEdit" class="form-label">Address :</label>
                    <input type="text" class="form-control" id="addressEdit" value="${address}" aria-describedby="addressEdit">
                </div>
                <div class="mb-3">
                    <label for="imgEdit" class="form-label">Img</label>
                    <input type="text" class="form-control" id="imgEdit" value="${imgUrl}" aria-describedby="imgEdit">
                </div>
                `;
  $("#menuEdit").html(element);
};

const addUpdateEmployee = (
  id,
  nameEmployee,
  dateOfBirth,
  idCard,
  phoneNumber,
  address,
  imgUrl,
  position
) => {
  $.ajax({
    type: "PUT",
    url: `http://localhost:8080/apple/employee/${id}`,
    data: JSON.stringify({
      name: nameEmployee,
      dateOfBirth: dateOfBirth,
      idCard: idCard,
      phoneNumber: phoneNumber,
      address: address,
      imgUrl: imgUrl,
      position: {id: position},
    }),
    success: (data) => {
      alert("Update success");
      $("#editModal").modal("hide");
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      loadEmployee();
    },
    error: (error) => {
      console.log(error);
    },
  });
};

const deleteEmployee = (nameEmployee, id) => {
  $("#deleteEmployeeName").html(nameEmployee);
  $("#deleteEmployeeForm").click(() => {
    deleteEmployeeButton(id);
  });
};

const deleteEmployeeButton = (id) => {
  $.ajax({
    type: "DELETE",
    url: `http://localhost:8080/apple/employee/${id}`,
    headers: {
      "Content-Type": "application/JSON",
    },

    success: (data) => {
      alert("Delete success");
      $("#deleteModal").modal("hide");
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      loadEmployee();
    },
    error: (error) => {
      console.log(error);
    },
  });
};
