function loadBills(page){
    let search = $("#search").val();
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/bill?page=${page ? page : "0"}&code=${search}`,
        headers: {
    "Content-Type": "application/json",
        },
        success: function(data){
        
            renderBills(data);
            renderPage(data);
        },
        error: function(error){
            console.log(error);
        }
    })
}

$(document).ready(function(){
    loadBills();
})

function renderBills(billList){
    let elements = "";
    for(let bill of billList.content){
        elements +=`
            <tr>
                <td>${bill.id}</td>
                <td>${bill.code}</td>
                <td>${bill.name}</td>
                <td>${bill.billTypeDTO.type}</td>
                <td><a class="btn btn-primary">Edit</a></td>
                <td>
                <button type="button" class="btn btn-primary" onclick= "getBillIdAndName(${bill.id}, '${bill.name}')" data-toggle="modal" data-target="#modelId">Delete</button>
                </td>
            </tr>
        `
    }
    $("#listBills").html(elements);
}

function movePage(page){
    loadBills(page);
}

function renderPage(billList){
    let pageable = "";
    if(
        billList.number == billList.totalPages - 1 &&
        billList.number > 0
        ){
            pageable +=`
            <button class="btn btn-secondary" onclick="movePage(${billList.number - 1})">
            Previous
            </button>
            `;
        }
    for(let i = 1; i <= billList.totalPages; i++){
        let page = $(`
        <button class="btn btn-secondary" onclick="movePage(${i - 1})">
            ${i}
        </button>`);
        if(i === billList.number + 1){
            page.add("active");
        }else{
            page.remove("active");
        }
        pageable += page.prop("outerHTML");
    }
    if(billList.number == 0 && billList.number < billList.totalPages){
        pageable +=`
        <button class="btn btn-secondary" onclick="movePage(${billList.number + 1})">
        Next
        </button>
        `;
    }
    $("#pagination").html(pageable);
}
// delete
function getBillIdAndName(id, name){
    debugger
    document.getElementById("deleteId").value = id;
    document.getElementById("deleteName").innerText = "Do you wanna delete " + name + "?";
}

function deleteBill(id){
    debugger
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/bill/delete/${id}`,
        success: function(data){
            console.log("success")
            $('#modelId').hide();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            loadBills();
        },
        error: function(error){
            console.log(error);
        }
    })
}

$('#deleteBill').submit(
    function(event){
        debugger
        event.preventDefault();
        let id = $('#deleteId').val();
        deleteBill(id);
    }
);
