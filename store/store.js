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
            console.log(error);
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
                    // onclick= "getStoreInfo(${store.id})" >Detail</button>
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
        storeList.number == storeList.totalPages - 1 &&
        storeList.number > 0
    ) {
        pageable += `
            <button class="btn btn-secondary" onclick="movePage(${storeList.number - 1})">
            Previous
            </button>
            `;
    }
    for (let i = 1; i <= storeList.totalPages; i++) {
        let page = $(`
        <button class="btn btn-secondary" onclick="movePage(${i - 1})">
            ${i}
        </button>`);
        if (i === storeList.number + 1) {
            page.add("active");
        } else {
            page.remove("active");
        }
        pageable += page.prop("outerHTML");
    }
    if (storeList.number == 0 && storeList.number < storeList.totalPages) {
        pageable += `
        <button class="btn btn-secondary" onclick="movePage(${storeList.number + 1})">
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
            console.log(error);
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
    debugger
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
            console.log("success")
            window.location.replace("store.html");
        },
        error: function (error) {
            console.log(error);
        },
    })
}
function selectOptionStore() {
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
            console.log(error);
        }
    })
}

function storeOption(storeTypes) {
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

}

$(document).ready(function () {
    selectOptionStore();
});

// update
$("#update-performing").submit(function (event) {
    event.preventDefault();
    let id = $("#id-update").val();
    let name = $("#name-update").val();
    let address = $("#address-update").val();
    let city = $("#city-update").val();
    let email = $("#email-update").val();
    let phone = $("#phone-update").val();
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
            alert("error");
        },
    })
}

function getStoreInfo(id) {
    debugger
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
            debugger
            let elements = "";
            elements += `
            
        <div class="form-group">
            <input type="hidden"
                class="form-control" id="id-update" value="${store.id}">
        </div>
        <div class="form-group">
                <label for="name-update">Name</label>
                <input type="text" class="form-control" id="name-update" value="${store.name}">
        </div>
        <div class="form-group">
                <label for="address-update">address</label>
                <input type="text" class="form-control" id="address-update" value="${store.address}">
        </div>
        <div class="form-group">
                <label for="city-update">city</label>
                <input type="text" class="form-control" id="city-update" value="${store.city}">
        </div>
        <div class="form-group">
                <label for="email-update">email</label>
                <input type="text" class="form-control" id="email-update" value="${store.email}">
        </div>
        <div class="form-group">
                <label for="phone-update">phone</label>
                <input type="text" class="form-control" id="phone-update" value="${store.phone}">
        </div>
        <div class="form-group">
        <label for="type-update">Type</label>
        <div id="type-update">
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" >Update</button>
        </div>
            `
            $("#update-performing").html(elements);
        },
        error: function (error) {   
            alert("error");
        }
    })
}

// detail
// function detailStore(id) {
//     debugger
//     $.ajax({
//         type: "GET",
//         url: `http://localhost:8080/store/${id}`,
//         headers: {
//             "Content-Type": "application/json",
//         },
//         success: function (data) {
//             debugger
//             store = data
//             let elements = "";
//             elements = `
//             <div class="form-group">
//             <input type="text"
//                 class="form-control" id="id-detail" value="${store.id}">
//         </div>
//         <div class="form-group">
//                 <label for="name-detail">Name</label>
//                 <input type="text" class="form-control" id="name-detail" value="${store.name}">
//         </div>
//         <div class="form-group">
//                 <label for="address-detail">address</label>
//                 <input type="text" class="form-control" id="address-detail" value="${store.address}">
//         </div>
//         <div class="form-group">
//                 <label for="city-detail">city</label>
//                 <input type="text" class="form-control" id="city-detail" value="${store.city}">
//         </div>
//         <div class="form-group">
//                 <label for="email-detail">email</label>
//                 <input type="text" class="form-control" id="email-detail" value="${store.email}">
//         </div>
//         <div class="form-group">
//                 <label for="phone-detail">phone</label>
//                 <input type="text" class="form-control" id="phone-detail" value="${store.phone}">
//         </div>
//         // <div class="form-group">
//         // <label for="type-detail">Type</label>
//         // <input type="text" class="form-control" id="type-detail" value="${store.storeTypeDTO}">
//         // </div>
//         <div class="modal-footer">
//             <button type="submit" class="btn btn-primary" data-dismiss="modal">Close</button>
//             </div>
//             `
//             debugger
//             $("#detailStore").html(elements)
//         },
//         error: function (error) {
//             console.log("error");
//         }
//     })
// }
// $(document).ready(function () {
//     debugger
//     detailStore();
// });
