window.onload = async () => {
  let response = await axios.get("http://localhost:8080/getAllProducts");
  console.log(response);
  let productList = response.data;
  let productListDiv = ``;

  productList.forEach((item) => {
    productListDiv += `<div class="card m-3" style="width: 10rem;">
        <img src="img/${item.pimg}" class="card-img-top" alt="상품 이미지">
       
        <div class="card-body">
          <b class="card-title">${item.prodname}</b>
          <a href="#" class="review-link" data-product-id="${item.prodcode}" 
          data-bs-toggle="modal" data-bs-target="#commentModal" title="리뷰 보기"> 
            <img src="img/review.png" alt="리뷰 아이콘"> 
          </a>
          <p class="card-text text-danger">${item.price}원</p>   
          <a href="#" class="btn btn-outline-info addToCartBtn" data-product-id="${item.prodcode}" title="장바구니 담기">
            <span>장바구니 담기</span>
          </a>
        </div>
      </div>`;
  });

  document.getElementById("productListDiv").innerHTML = productListDiv;

  document.getElementById("productListDiv").addEventListener("click", async (e) => {
    if (e.target.closest(".addToCartBtn")) {
        const button = e.target.closest(".addToCartBtn");
        const prodcode = button.getAttribute("data-product-id");
        const email = sessionStorage.getItem("email"); // 이메일 가져오기

        if (!email) {  // 로그인하지 않은 경우
            alert("로그인이 필요합니다. 로그인 후 이용해주세요.");
            return;
        }

        console.log("장바구니 추가:", prodcode, "이메일:", email);

        try {
            const res = await axios.post("http://localhost:8080/addToCart", {
                email: email,
                prodcode: prodcode
            });

            console.log("응답 데이터:", res.data);
            alert("장바구니에 추가되었습니다!");
        } catch (error) {
            console.error("장바구니 추가 오류:", error);
            alert("장바구니 추가 중 오류가 발생했습니다.");
        }
    }
});


  // ⭐ 리뷰 모달 열기 (이벤트 위임)
  document.getElementById("productListDiv").addEventListener("click", async (e) => {
    if (e.target.closest(".review-link")) {
      const button = e.target.closest(".review-link");
      const prodcode = button.getAttribute("data-product-id");
      console.log("선택한 상품 코드:", prodcode);

      try {
        const reviewsResponse = await axios.post("http://localhost:8080/getRecentReviews", { prodcode });
        const reviews = reviewsResponse.data;
        console.log("리뷰 데이터:", reviews);

        // 모달 본문에 리뷰 표시
        let reviewListDiv = `<ul>`;
        reviewListDiv += reviews.map((item) => `<li>${item.review}</li>`).join("");
        reviewListDiv += `</ul>`;
        document.getElementById("commentModalBody").innerHTML = reviewListDiv;
      } catch (error) {
        console.error("리뷰를 가져오는 데 오류가 발생했습니다:", error);
        document.getElementById("commentModalBody").innerHTML = "리뷰를 불러오는 데 오류가 발생했습니다.";
      }
    }
  });

  // 💬 댓글 남기기
  document.getElementById("submitComment").addEventListener("click", async () => {
    const review = document.getElementById("commentTextarea").value;
    const nickname = sessionStorage.getItem("nickname");

    // prodcode 값을 모달을 열 때 가져와서 저장
    const prodcode = document.querySelector(".review-link[data-bs-target='#commentModal']")?.getAttribute("data-product-id");
    
    console.log("댓글 등록 정보:", nickname, prodcode, review);
    
    if (review && prodcode) {
      try {
        await axios.post("http://localhost:8080/insertReview", { nickname, prodcode, review });
        document.getElementById("commentTextarea").value = ""; // 입력창 초기화
        alert("후기가 등록되었습니다!");

        // 모달 닫기
        const modal = bootstrap.Modal.getInstance(document.getElementById("commentModal"));
        modal.hide();
      } catch (error) {
        console.error("후기 등록 오류:", error);
        alert("후기를 등록하는 데 오류가 발생했습니다.");
      }
    } else {
      alert("후기를 입력해주세요.");
    }
  });
};
