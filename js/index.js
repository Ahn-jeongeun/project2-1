window.onload=async ()=>{
    let response = await axios.get("http://localhost:8080/getAllProducts");
    console.log(response);
    let productList=response.data;
    let productListDiv=``;
    productList.forEach(item => {
        productListDiv += `<div class="card m-3" style="width: 10rem;">
        <img src="img/${item.pimg}" class="card-img-top" alt="...">
        <div class="card-body">
          <b class="card-title">${item.prodname}</b>
          <p class="card-text text-danger">${item.price}원</p>
          <a href="#" class="btn btn-outline-info">장바구니 담기</a>
        </div>
      </div>`;
    });

    document.getElementById("productListDiv").innerHTML=productListDiv;
}