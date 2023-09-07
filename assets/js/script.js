/** 
 * START MODAL
*/
// data-trigger: "modal" => Dựa vào trigger selector tất cả những thẻ nào có data-trigger='modal'
// data-target: Mỗi một data-trigger sẽ select đến một bộ modal riêng (Phù hợp cho việc tái sử dụng)
// aria-open: Khai báo trạng thái modal
const btnModals = document.querySelectorAll("[data-trigger='modal']");

// Hàm xử lý bật, tắt modal thông qua class cung cấp
function onActiveOrNot(buttonTargetModal, modal, open) {
  if(!modal.classList.contains("modal--active") && open) {
    modal.classList.add("modal--active")
  }
  else {
    modal.classList.remove("modal--active");
  }
  
  // đặt lại trạng thái cho nút button khi modal active | !active
  buttonTargetModal.setAttribute("aria-open", open);
}

// Dựa vào data-trigger='modal' truy xuất toàn bộ nút bật modal
btnModals.forEach(btnModal => {
  // lấy thông tin modal
  const modal = document.querySelector(btnModal.getAttribute("data-target"));
  // lấy trạng thái modal
  const open = btnModal.getAttribute("aria-open") === "true" ? true : false;
  
  // Khởi động trạng thái mặc định của modal được set từ aria-open của button
  onActiveOrNot(btnModal, modal, open);
  
  // Bật modal thông qua button
  btnModal.addEventListener("click", () => {
    onActiveOrNot(btnModal, modal, !open);
  });

  // Tắt modal thông qua nút close
  modal.querySelector(".modal__cancel").addEventListener("click", () => {
    onActiveOrNot(btnModal, modal, !open);
  })
})

/** 
 * END MODAL
*/


document.getElementById('btnFilter').addEventListener('click', function (e) {
  this.classList.toggle("active");
  let filterContent = document.getElementById('filterContent');
  filterContent.classList.toggle("active");
});