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


let TABLE_DATAS = [
  {
    id: 1,
    treatment: '012',
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 2,
    treatment: '013',
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 3,
    treatment: '014',
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 4,
    treatment: '015',
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 5,
    treatment: '016',
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
];
const FILTER_TYPES = {
  TREATMENT: 'TREATMENT',
  DESCRIPTION: 'DESCRIPTION',
}

let FILTERS_SELECTED = [];

window.onload = function() {
  initialTable();
};

document.getElementById('btnFilter').addEventListener('click', function (e) {
  this.classList.toggle("active");
  let filterContent = document.getElementById('filterContent');
  filterContent.classList.toggle("active");

  // reset input value value
  document.getElementsByClassName('treatmentFilter')[0].value = '';
  document.getElementsByClassName('descriptionFilter')[0].value = '';
});

document.getElementById('filter').addEventListener('click', function (e) {
  // get value of input
  const treatmentFilter = document.getElementsByClassName('treatmentFilter')[0].value;
  const descriptionFilter = document.getElementsByClassName('descriptionFilter')[0].value;
  const _filter_value = !!treatmentFilter ? treatmentFilter : !!descriptionFilter ? descriptionFilter : false;
  if(!!_filter_value) {
    const FILTER_SELECT = {
      type: !!treatmentFilter ? FILTER_TYPES.TREATMENT : FILTER_TYPES.DESCRIPTION,
      value: _filter_value
    }

    // toggle filter form
    this.classList.toggle("active");
    let filterContent = document.getElementById('filterContent');
    filterContent.classList.toggle("active");

    const treatmentsSelected = document.getElementsByClassName('treatments-selected')[0];

    // create child node
    const treatmentsSelectedItemChild = document.createElement("span");
    const textnode = document.createTextNode(_filter_value);
    const imgnode = document.createElement('img');
    imgnode.setAttribute('src', '/assets/icons/close.svg');
    imgnode.setAttribute('class', 'treatmentItemRemove');
    imgnode.onclick = function (e) {
      treatmentItemRemove(FILTER_SELECT, e);
    }
    
    treatmentsSelectedItemChild.appendChild(textnode);
    treatmentsSelectedItemChild.appendChild(imgnode);
    
    const treatmentsSelectedItem = document.createElement("span");
    treatmentsSelectedItem.className = 'treatments-selected__item';
    treatmentsSelectedItem.appendChild(treatmentsSelectedItemChild);

    treatmentsSelected.appendChild(treatmentsSelectedItem);

    FILTERS_SELECTED = [ 
      ...FILTERS_SELECTED, 
      FILTER_SELECT,
    ];

    // filter table
    initialTable();
  }
});

function treatmentItemRemove(filter_select, e) {
  console.log(filter_select)
  // remove item UI
  e.target.closest('.treatments-selected__item').remove();
  // remove filter array
  FILTERS_SELECTED = FILTERS_SELECTED.filter(v => !(v.value === filter_select.value && v.type === filter_select.type));
  // filter table
  initialTable();
}

function initialTable() {

  // text filter content
  
  // treatments-table
  const treatmentsTableBody = document.getElementsByClassName('treatments-table-body')[0];

  // remove all child
  treatmentsTableBody.innerHTML = '';
  
  TABLE_DATAS.forEach(function (data, key) {
    const tr = document.createElement("tr");
    tr.setAttribute('data-key', key);

    // td input
    const tdFormCheckInput = document.createElement("td");
    const formCheckInput = document.createElement("input");
    formCheckInput.setAttribute('class', 'form-check-input');
    formCheckInput.setAttribute('type', 'checkbox');
    // filter checked input 
    const _FIND_VALUE = FILTERS_SELECTED.find(v => v.value === data.treatment)
    if (!!_FIND_VALUE) {
      formCheckInput.setAttribute('checked', 'checked');
    }
    tdFormCheckInput.appendChild(formCheckInput);

    // td treatment
    const tdTreatment = document.createElement("td");
    tdTreatment.setAttribute('class', 'fw-bold');
    const treatment = document.createTextNode(data.treatment);
    tdTreatment.appendChild(treatment);

    // td description
    const tdDescription = document.createElement("td");
    const descriptions = document.createTextNode(data.descriptions);
    tdDescription.appendChild(descriptions);
    
    // append td to tr
    tr.appendChild(tdFormCheckInput);
    tr.appendChild(tdTreatment);
    tr.appendChild(tdDescription);

    // append tr to table body
    treatmentsTableBody.appendChild(tr);
  });
}