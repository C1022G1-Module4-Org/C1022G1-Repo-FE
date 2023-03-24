function loadStores(page) {
    let search = $("#search").val();
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/store?page=${page ? page : "0"}&name=${search}`,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {

            renderStores(data);
            renderPage(data);
        },
        error: function (error) {
            alert(error);
        }
    })
}

$(document).ready(function () {
    loadStores();
})

function renderStores(storeList) {
    let elements = "";
    for (let store of storeList.content) {
        elements += `
            <tr>
                <td>${store.id}</td>
                <td>${store.name}</td>
                <td>${store.address}</td>
                <td>${store.city}</td>
                <td>${store.storeTypeDTO.type}</td>
                <td>
                    <button type="button" class="btn btn-secondary"  data-bs-toggle="modal" data-bs-target="#modalDetail"
                    onclick= "detailStore(${store.id})" >Detail</button>
                </td>
                <td>
                    <button type="button" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#modalUpdate"
                    onclick= "getStoreInfo(${store.id})" >Edit</button>
                </td>
                <td>
                    <button type="button" class="btn btn-danger" onclick= "getStoreIdAndName(${store.id}, '${store.name}')" data-bs-toggle="modal" data-bs-target="#modalDelete">Delete</button>
                </td>
            </tr>
        `
    }
    $("#listStores").html(elements);
}

function movePage(page) {
    loadStores(page);
}

function renderPage(storeList) {
    let pageable = "";
    if (
        storeList.number <= storeList.totalPages - 1 &&
        storeList.number > 0
    ) {
        pageable += `
            <button onclick="movePage(${storeList.number - 1})">
            Previous
            </button>
            `;
    }
    for (let i = 1; i <= storeList.totalPages; i++) {
        let page = $(`
        <button class="page-item number btn mx-1" onclick="movePage(${i - 1})">
            ${i}
        </button>`);
        if (i === storeList.number + 1) {
            page.add("active");
        } else {
            page.remove("active");
        }
        pageable += page.prop("outerHTML");
    }
    if (storeList.number >= 0 && storeList.number < storeList.totalPages - 1) {
        pageable += `
        <button class="page-item number btn mx-1" onclick="movePage(${storeList.number + 1})">
        Next
        </button>
        `;
    }
    $("#pagination").html(pageable);
}
// delete
function getStoreIdAndName(id, name) {

    document.getElementById("deleteId").value = id;
    document.getElementById("deleteName").innerText = "Do you wanna delete " + name + "?";
}

function deleteStore(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/store/delete/${id}`,
        success: function (data) {
            console.log("success")
            $('#modalDelete').hide();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            loadStores();
        },
        error: function (error) {
            alert(error);
        }
    })
}

$('#deleteStore').submit(
    function (event) {
        event.preventDefault();
        let id = $('#deleteId').val();
        deleteStore(id);
    }
);

// add 
$("#addStore").submit(function (event) {
    event.preventDefault();
    let name = $("#name").val();
    let address = $("#address").val();
    let city = $("#city").val();
    let email = $("#email").val();
    let phone = $("#phone").val();
    let storeTypeDTO = $("#selectStore").val();
    addStore(name, address, city, email, phone, storeTypeDTO)
}
)

function addStore(name, address, city, email, phone, storeTypeDTO) {
    $.ajax({
        type: "POST",
        url: `http://localhost:8080/store`,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            name: name,
            address: address,
            city: city,
            email: email,
            phone: phone,
            storeTypeDTO: { idType: storeTypeDTO },
        }),
        success: function (data) {
            alert("Success")
            window.location.replace("store.html");
        },
        error: function (error) {
            for (let key of Object.keys(error.responseJSON)) {
                if ($(`#${key}-error`)) {
                    $(`#${key}-error`).text(error.responseJSON[key]);
                }
            }
            alert("Error");
        },
    })
}
const deleteErrorCreate = () => {
    $("#name-error").text("");
    $("#address-error").text("");
    $("#city-error").text("");
    $("#email-error").text("");
    $("#phone-error").text("");
}
function selectOptionStore() {
    debugger
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/type`,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {
            storeOption(data);
        },
        error: function (error) {
            alert("Error");
        }
    })
}

function storeOption(storeTypes) {
    debugger
    let elements = "";
    elements += `
        <select class="form-control" id="selectStore">`
    for (let store of storeTypes) {
        elements += `<option value="${store.idType}">`
        elements += store.type;
        `</option>`
    }
    `</select>`;
    $("#type").html(elements);
    $("#type-update").html(elements);
    $("#type-detail").html(elements);

}

$(document).ready(function () {
    selectOptionStore();
});

// update
$("#update-performing").submit(function (event) {
    event.preventDefault();
    let id = $("#idUpdate").val();
    let name = $("#nameUpdate").val();
    let address = $("#addressUpdate").val();
    let city = $("#cityUpdate").val();
    let email = $("#emailUpdate").val();
    let phone = $("#phoneUpdate").val();
    let storeTypeDTO = $("#selectStore").val();
    updateStore(id, name, address, city, email, phone, storeTypeDTO)
}
)

function updateStore(id, name, address, city, email, phone, storeTypeDTO) {
    $.ajax({
        type: "PUT",
        url: `http://localhost:8080/store/update/${id}`,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            id: id,
            name: name,
            address: address,
            city: city,
            email: email,
            phone: phone,
            storeTypeDTO: { idType: storeTypeDTO },
        }),
        success: function (data) {
            alert("Update success!")
            $("#modalUpdate").hide();
            $("body").removeClass("modal-open");
            $('.modal-backdrop').remove();
            loadStores();

        },
        error: function (error) {
            for (let key of Object.keys(error.responseJSON)) {
                if ($(`#${key}-error`)) {
                    $(`#${key}Update-error`).text(error.responseJSON[key]);
                }
            }
            alert("Error");
        },
    });
}

function getStoreInfo(id) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/store/detail/${id}`,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        success: function (data) {
            selectOptionStore();
            let store = data;
            let elements = "";
            elements += `

        <div class="form-group">
            <input type="hidden"
                class="form-control" id="idUpdate" value="${store.id}">
        </div>
        <div class="form-group">
                <label for="name-update">Name</label>
                <input type="text" class="form-control" id="nameUpdate" value="${store.name}" onclick="deleteErrorUpdate()">
                <div class="errr-message text-danger" id="nameUpdate-error"></div>
        </div>
        <div class="form-group">
                <label for="address-update">Address</label>
                <input type="text" class="form-control" id="addressUpdate" value="${store.address}" onclick="deleteErrorUpdate()">
                <div class="errr-message text-danger" id="addressUpdate-error"></div>
        </div>
        <div class="form-group">
                <label for="city-update">City</label>
                <input type="text" class="form-control" id="cityUpdate" value="${store.city}" onclick="deleteErrorUpdate()">
                <div class="errr-message text-danger" id="cityUpdate-error"></div>
        </div>
        <div class="form-group">
                <label for="email-update">Email</label>
                <input type="text" class="form-control" id="emailUpdate" value="${store.email}" onclick="deleteErrorUpdate()">
                <div class="errr-message text-danger" id="emailUpdate-error"></div>
        </div>
        <div class="form-group">
                <label for="phone-update">Phone</label>
                <input type="text" class="form-control" id="phoneUpdate" value="${store.phone}" onclick="deleteErrorUpdate()">
                <div class="errr-message text-danger" id="phoneUpdate-error"></div>
        </div>
        <div class="form-group">
        <label for="type-update">Type</label>
        <div id="type-update">
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" >Update</button>
        </div>
            `
            $("#update-performing").html(elements);
        },
        error: function (error) {
            alert("Error");
        }
    })
}
const deleteErrorUpdate = () => {
    $("#nameUpdate-error").text("");
    $("#addressUpdate-error").text("");
    $("#cityUpdate-error").text("");
    $("#emailUpdate-error").text("");
    $("#phoneUpdate-error").text("");
}

// detail
function detailStore(id) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/store/details/${id}`,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {
            debugger
            selectOptionStore();
            store = data
            let elements = "";
            elements = `
            <div class="form-group">
            <label>ID</label>
            <p class="form-control">${store.id}</p>
        </div>
        <div class="form-group">
                <label for="name-detail">Name</label>
                <p class="form-control">${store.name}</p>
        </div>
        <div class="form-group">
                <label for="address-detail">Address</label>
                <p class="form-control">${store.address}</p>
        </div>
        <div class="form-group">
                <label for="city-detail">City</label>
                <p class="form-control">${store.city}</p>
        </div>
        <div class="form-group">
                <label for="email-detail">Email</label>
                <p class="form-control">${store.email}</p>
        </div>
        <div class="form-group">
                <label for="phone-detail">Phone</label>
                <p class="form-control">${store.phone}</p>
        </div>
        <div class="form-group">
        <label for="type-detail">Type</label>
        <p class="form-control">${store.storeTypeDTO.type}</p>
        </div>
            `
            debugger
            $("#detailStore").html(elements)
        },
        error: function (error) {
            console.log("error");
        }
    })
}
$(document).ready(function () {
    detailStore();
});

$('#detailStore').submit(
    function (event) {
        event.preventDefault();
    });
