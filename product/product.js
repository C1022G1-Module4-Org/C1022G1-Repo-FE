$(document).ready(() => {
    loadProducts();
})


const loadProducts = (nextPage) => {
    let keySearch = $("#search").val();
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/apple/product?page=${nextPage ? nextPage : "0"}&search=`+keySearch,
        headers:{
            "Content-Type":"application/JSON",
        },
        success: (data) => {
            listProduct(data.content);
            renderPage(data);
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
        <div>
        <div class="d-flex justify-content-center container mt-5">
        <div class="card p-3 bg-white"><i class="fa fa-apple"></i>
            <div class="about-product text-center mt-2"><img src="${product.img}" width="300">
                <div>
                    <h4>${product.name}</h4>
                    <h6 class="mt-0 text-black-50">Apple pro display XDR</h6>
                </div>
            </div>
            <div class="stats mt-2">
                <div class="d-flex justify-content-between p-price"><span>${product.describeProduct}</span>
                <span>Price: ${product.price}$</span></div>
                <div class="d-flex justify-content-between p-price">${product.dateSize}</div>
                <div class="d-flex justify-content-between p-price">${product.quantity}</div>
                <div class="d-flex justify-content-between p-price">Place made: ${product.madeIn.placeMadeIn}</div>
                <div class="d-flex">
                    <div class="pt-2 mx-5" onclick="editProduct('${product.id}','${product.name}','${product.img}','${product.describeProduct}','${product.price}','${product.dateSize}','${product.quantity}')" class="d-flex justify-content-between align-item-center p-price">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal">
                            Edit
                        </button>
                    </div>
                    <div class="pt-2" onclick="deleteProduct('${product.name}','${product.id}')" class="d-flex justify-content-between align-item-center p-price">
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-5 d-flex justify-content-center">
                  <div class="card-voucher voutchers">
    
                    <div class="voutcher-divider">
    
                      <div class="voutcher-left text-center">
                        <span class="voutcher-name">Monday Happy</span>
                        <h5 class="voutcher-code">#MONHPY</h5>
                        
                      </div>
                      <div class="voutcher-right text-center border-left">
                        <h5 class="discount-percent pb-2">20%</h5>
                        <span class="off">Off</span>
                        
                      </div>
                        
                    </div>
                    
                  </div>
                  
                </div>
        </div>
        `
    $("#listProduct").html(element);
    }
}

function movePage(nextPage) {
    loadProducts(nextPage);
}

function renderPage(products) {
    let page = "";
    if (products.number == products.totalPages - 1 && products.number > 0) {
        page += `
    <button class="page-item btn" 
    onclick="movePage(${products.number - 1})">
    <div>Previous</div>
    </button>
    `
    }
    for (let i = 1; i <= products.totalPages; i++) {
        let pageItem = $(`<button class="page-item number btn mx-1"
                      onclick="movePage(${i - 1})">
                      ${i}
                      </button>`);
        if (i === products.number + 1) {
            pageItem.addClass("active");
        } else {
            pageItem.removeClass("active");
        }
        page += pageItem.prop('outerHTML');
    }

    if (products.number == 0 && products.number < products.totalPages) {
        page += `
    <button class="page-item btn" 
    onclick="movePage(${products.number + 1})">
    <div>Next</div>
    </button>
    `
    }
    $("#paging").html(page);
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

const create = () => {
    let nameProduct = $('#productName').val();
    let price = $('#price').val();
    let img = $('#img').val();
    let describeProduct = $('#describe').val();
    let dataSize = $('#dataSize').val();
    let quantity = $('#quantity').val();
    let madeInProduct = parseInt($('#madeInValue').val());
    addNewProduct(nameProduct,price,img,describeProduct,dataSize,quantity,madeInProduct)

}

const addNewProduct = (nameProduct,price,img,describeProduct,dataSize,quantity,madeInProduct) => {
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
            document.getElementById("productName").value = "";
            document.getElementById("price").value = "";
            document.getElementById("img").value = "";
            document.getElementById("describe").value = "";
            document.getElementById("dataSize").value = "";
            document.getElementById("quantity").value = "";
            loadProducts();
            $("#exampleModal").modal('hide');
        },
        error : (error) => {
            for (let key of Object.keys(error.responseJSON)) {
                if ($(`#${key}-error`)) {
                  $(`#${key}-error`).text(error.responseJSON[key]);;
                }
              }
              alert("Loi khi them !!!")
        }
    })
}

const deleteError = () => {
    $("#name-error").text("");
    $("#price-error").text("");
    $("#img-error").text("");
    $("#describeProduct-error").text("");
    $("#quantity-error").text("");
}

const deleteProduct = (nameProduct, id) => {
    $("#deleteProductName").html(nameProduct);
    $('#deleteProductForm').val(id);
}

const deleteProductForm = () => {
    let id = $('#deleteProductForm').val();
    deleteProductButton(id);
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
            loadProducts();
        },
        error: (error) => {
            console.log(error);
        }
    })
}

const editProduct = (id,name,img,describe,price,dataSize,quantity) => {
    categoryEdit(name,img,describe,price,dataSize,quantity);
    $('#indexxxx').val(id);
    
}


const editProductxxx = () => {
    let id = $('#indexxxx').val();
    let nameProduct = $('#editProductName').val();
    let priceProduct = $('#editPrice').val();
    let imgProduct = $('#editImg').val();
    let describeProduct = $('#editDescribe').val();
    let dataSizeProduct = $('#editDataSize').val();
    let quantityProduct = $('#editQuantity').val();
    let madeInProduct = $('#madeInValue').val();
    editProductButton(id,nameProduct,imgProduct,priceProduct,describeProduct,dataSizeProduct,quantityProduct,madeInProduct);
}


const categoryEdit = (name,img,describe,price,dataSize,quantity) => {
    let element =`
    <div class="mb-3">
                    <label for="editProductName" class="form-label">Product name</label>
                    <input type="text" class="form-control" id="editProductName" value="${name}" aria-describedby="productName">
                </div>
                <div class="mb-3">
                    <label for="editPrice" class="form-label">Price</label>
                    <input type="text" class="form-control" id="editPrice" value="${price}" aria-describedby="price">
                </div>
                <div class="mb-3">
                    <label for="editImg" class="form-label">Img</label>
                    <input type="text" class="form-control" id="editImg" value="${img}" aria-describedby="img">
                </div>
                <div class="mb-3">
                    <label for="editDescribe" class="form-label">Describe</label>
                    <input type="text" class="form-control" id="editDescribe" value="${describe}" aria-describedby="describe" required>
                </div>
                <div class="mb-3">
                    <label for="editDataSize" class="form-label">Data size</label>
                    <input type="text" class="form-control" id="editDataSize" value="${dataSize}" aria-describedby="dataSize">
                </div>
                <div class="mb-3">
                    <label for="editQuantity" class="form-label">Quantity</label>
                    <input type="text" class="form-control" id="editQuantity" value="${quantity}" aria-describedby="quantity">
                </div>
    `
    $("#categoryEditInput").html(element);
}

const editProductButton = (id,name,img,price,dataSize,quantity,describeProduct,madeIn) => {
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
            madeIn : {id: madeIn}
        }),
        success: (data) => {
            console.log("Cập nhật thành công");
            loadProducts();
        },
        error: (error) => {
            console.log("Cập nhật thất bại");
        }
    })
}
