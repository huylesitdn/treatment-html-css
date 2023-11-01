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
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 2,
    treatment: '013',
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 3,
    treatment: '014',
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 4,
    treatment: '015',
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 5,
    treatment: '016',
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
];

let TREATMENT_CHECKED = [];

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

    const _FIND_FILTERS_SELECTED = FILTERS_SELECTED.find(v => v.value === FILTER_SELECT.value && v.type === FILTER_SELECT.type);
    if(!_FIND_FILTERS_SELECTED) {
      // set filters
      FILTERS_SELECTED = [ 
        ...FILTERS_SELECTED, 
        FILTER_SELECT,
      ];
    }

    // update treatments Selected item
    initialTreatmentsSelected();

    // filter table
    initialTable();
  }
});

function handleTreatmentItemRemove(filter_select, e) {
  // remove item UI
  e.target.closest('.treatments-selected__item').remove();
  // remove filter array
  FILTERS_SELECTED = FILTERS_SELECTED.filter(v => !(v.value === filter_select.value && v.type === filter_select.type));
  const _FIND_INDEX = TABLE_DATAS.findIndex(v => v.treatment === filter_select.value);
  if(_FIND_INDEX >= 0) { // un-check TREATMENT_CHECKED
    TREATMENT_CHECKED[_FIND_INDEX] = false;
  }
  // filter table
  initialTable();
}

function handleTreatmentCheckboxChange(value, e) {
  const checked = e.target.checked;
  const _FIND_FILTERS_SELECTED = FILTERS_SELECTED.find(v => v.value === value && v.type === FILTER_TYPES.TREATMENT);
  // add item
  if (checked && !_FIND_FILTERS_SELECTED) {
    FILTERS_SELECTED = [
      ...FILTERS_SELECTED,
      {
        type: FILTER_TYPES.TREATMENT,
        value
      }
    ];
  }

  // remove item
  if (!checked && !!_FIND_FILTERS_SELECTED) {
    FILTERS_SELECTED = FILTERS_SELECTED.filter(v => !(v.value === value && v.type === FILTER_TYPES.TREATMENT));
  }

  // update treatments Selected item
  initialTreatmentsSelected();

  // filter table
  initialTable();
}

function initialTreatmentsSelected() {
  const treatmentsSelected = document.getElementsByClassName('treatments-selected')[0];
  // remove all child
  treatmentsSelected.innerHTML = '';

  FILTERS_SELECTED.forEach(function (data, key) {
    const treatmentsSelectedItemChild = document.createElement("span");
    treatmentsSelectedItemChild.setAttribute('data-key', key);
    
    const textnode = document.createTextNode(data.value);
    const imgnode = document.createElement('img');
    imgnode.setAttribute('src', '/assets/icons/close.svg');
    imgnode.setAttribute('class', 'treatmentItemRemove');
    imgnode.onclick = function (e) {
      handleTreatmentItemRemove(data, e);
    }
    
    treatmentsSelectedItemChild.appendChild(textnode);
    treatmentsSelectedItemChild.appendChild(imgnode);
    
    const treatmentsSelectedItem = document.createElement("span");
    treatmentsSelectedItem.className = 'treatments-selected__item';
    treatmentsSelectedItem.appendChild(treatmentsSelectedItemChild);
  
    treatmentsSelected.appendChild(treatmentsSelectedItem);
  });
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
    if (!!_FIND_VALUE || !!TREATMENT_CHECKED[key]) {
      formCheckInput.setAttribute('checked', 'checked');
    }
    formCheckInput.onchange = function (e) {
      handleTreatmentCheckboxChange(data.treatment, e);
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