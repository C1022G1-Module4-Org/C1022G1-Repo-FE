function loadStores(page){
    let search = $("#search").val();
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/store?page=${page ? page : "0"}&name=${search}`,
        headers: {
    "Content-Type": "application/json",
        },
        success: function(data){
        
            renderStores(data);
            renderPage(data);
        },
        error: function(error){
            console.log(error);
        }
    })
}

$(document).ready(function(){
    loadStores();
})

function renderStores(storeList){
    let elements = "";
    for(let store of storeList.content){
        elements +=`
            <tr>
                <td>${store.id}</td>
                <td>${store.name}</td>
                <td>${store.address}</td>
                <td>${store.city}</td>
                <td>${store.storeTypeDTO.type}</td>
                <td><a class="btn btn-primary">Edit</a></td>
                <td>
                <button type="button" class="btn btn-primary" onclick= "getStoreIdAndName(${store.id}, '${store.name}')" data-toggle="modal" data-target="#modelId">Delete</button>
                </td>
            </tr>
        `
    }
    $("#listStores").html(elements);
}

function movePage(page){
    loadStores(page);
}

function renderPage(storeList){
    let pageable = "";
    if(
        storeList.number == storeList.totalPages - 1 &&
        storeList.number > 0
        ){
            pageable +=`
            <button class="btn btn-secondary" onclick="movePage(${storeList.number - 1})">
            Previous
            </button>
            `;
        }
    for(let i = 1; i <= storeList.totalPages; i++){
        let page = $(`
        <button class="btn btn-secondary" onclick="movePage(${i - 1})">
            ${i}
        </button>`);
        if(i === storeList.number + 1){
            page.add("active");
        }else{
            page.remove("active");
        }
        pageable += page.prop("outerHTML");
    }
    if(storeList.number == 0 && storeList.number < storeList.totalPages){
        pageable +=`
        <button class="btn btn-secondary" onclick="movePage(${storeList.number + 1})">
        Next
        </button>
        `;
    }
    $("#pagination").html(pageable);
}
// delete
function getStoreIdAndName(id, name){
    debugger
    document.getElementById("deleteId").value = id;
    document.getElementById("deleteName").innerText = "Do you wanna delete " + name + "?";
}

function deleteStore(id){
    debugger
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/store/delete/${id}`,
        success: function(data){
            console.log("success")
            $('#modelId').hide();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            loadStores();
        },
        error: function(error){
            console.log(error);
        }
    })
}

$('#deleteStore').submit(
    function(event){
        debugger
        event.preventDefault();
        let id = $('#deleteId').val();
        deleteStore(id);
    }
);
