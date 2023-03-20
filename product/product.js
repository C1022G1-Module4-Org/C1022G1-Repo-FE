$(document).ready(() => {
    loadProducts();
})

const loadProducts = () => {
    let keySearch = $("#search").val();
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/apple/product`,
        headers:{
            "Content-Type":"application/JSON",
        },
        success: (data) => {
            listProduct(data.content);
        },
        error: (error) => {
            console.log(error);
        }
    })
}

const listProduct = (products) => {
    listMadeIn();
    let element = ``;
    for (let product of products){
        element += `
        <div class="d-flex justify-content-center container mt-5">
        <div class="card p-3 bg-white"><i class="fa fa-apple"></i>
            <div class="about-product text-center mt-2"><img src="${product.img}" width="300">
                <div>
                    <h4>${product.name}</h4>
                    <h6 class="mt-0 text-black-50">Apple pro display XDR</h6>
                </div>
            </div>
            <div class="stats mt-2">
                <div class="d-flex justify-content-between p-price"><span>${product.describeProduct}</span><span>Price: ${product.price}$</span></div>
                <div class="d-flex justify-content-between p-price">${product.dateSize}</div>
                <div class="d-flex justify-content-between p-price">${product.quantity}</div>
                <div class="d-flex justify-content-between p-price">Place made: ${product.madeIn.placeMadeIn}</div>
                <div class="d-flex">
                    <div onclick="editProduct('${product.id}','${product.name}','${product.img}','${product.describeProduct}','${product.price}','${product.dateSize}','${product.quantity}')" class="d-flex justify-content-between align-item-center p-price">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal">
                            Edit
                        </button>
                    </div>
                    <div onclick="deleteProduct('${product.name}','${product.id}')" class="d-flex justify-content-between align-item-center p-price">
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `
    $("#listProduct").html(element);
    }
}

const listMadeIn = () => {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/apple/product/madein`,
        headers: {
            "Content-Type":"application/JSON"
        },
        success: (data) => {
            showListMadeIn(data)
        },
        error: (error) => {
            console.log(error);
        }
    })
}

const showListMadeIn = (listMadeInCategory) => {
    let element = `<label for="quantity" class="form-label">Made in</label>
    <select class='form-control' id='madeInValue'>`;
    for (let madeIn of listMadeInCategory){
        element += `<option value=${madeIn.id}>${madeIn.placeMadeIn}</option>`
    }
    element += `</select>`
    $("#madeInCategory").html(element);
    $("#editMadeInCategory").html(element);
}

$("#createNewProduct").submit(() => {
    debugger
    let nameProduct = $('#productName').val();
    let price = $('#price').val();
    let img = $('#img').val();
    let describeProduct = $('#describe').val();
    let dataSize = $('#dataSize').val();
    let quantity = $('#quantity').val();
    let madeInProduct = parseInt($('#madeInValue').val());
    addNewProduct(nameProduct,price,img,describeProduct,dataSize,quantity,madeInProduct)

})

const addNewProduct = (nameProduct,price,img,describeProduct,dataSize,quantity,madeInProduct) => {
    debugger
    $.ajax({
        type: "POST",
        url: `http://localhost:8080/apple/product`,
        headers:{
            "Content-Type" : "application/JSON"
        },
        data: JSON.stringify({
            name : nameProduct,
            dateSize : dataSize,
            img : img,
            price : price,
            quantity :quantity,
            describeProduct :describeProduct,
            madeIn : {id: madeInProduct}
        }),
        success: (data) => {
            alert("Thêm thành công")
        },
        error : (error) => {
            console.log(error);
        }
    })
}
const deleteProduct = (nameProduct, id) => {
    $("#deleteProductName").html(nameProduct);
    $("#deleteProductForm").click(() => {
        deleteProductButton(id);
    } 
    )
}

const deleteProductButton = (id) => {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/apple/product/${id}`,
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

const editProduct = (id,name,img,describe,price,dataSize,quantity) => {
    $("#editProductName").html(name);
    $("#inputEditImg").html(img);
    $("#inputEditPrice").html(price);
    $("#inputEditDescribe").html(describe);
    $("#inputEditDataSize").html(dataSize);
    $("#inputEditQuantity").html(quantity);
    $("#editProduct").click(() => {
        let nameProduct = $('#editProductName').val();
        let priceProduct = $('#editPrice').val();
        let imgProduct = $('#editImg').val();
        let describeProduct = $('#editDescribe').val();
        let dataSizeProduct = $('#editDataSize').val();
        let quantityProduct = $('#editQuantity').val();
        let madeInProduct = $('#editMadeInCategory').val();
        editProductButton(id,nameProduct,priceProduct,imgProduct,describeProduct,dataSizeProduct,quantityProduct,madeInProduct);
    })
}

const editProductButton = (id,name,img,price,dataSize,quantity,madeIn) => {
    $.ajax({
        type: "PUT",
        url: `http://localhost:8080/apple/product/${id}`,
        headers:{
            "Content-Type":"application/JSON"
        },
        data:JSON.stringify({
            name : name,
            dateSize : dataSize,
            img : img,
            price : price,
            quantity :quantity,
            describeProduct :describeProduct,
            madeIn : madeIn
        }),
        success: (data) => {
            console.log("Cập nhật thành công");
        },
        error: (error) => {
            console.log("Cập nhật thất bại");
        }
    })
}
