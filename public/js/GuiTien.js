// Định dạng số tiền nhập vào
function formatCurrency(input) {
    let value = input.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Thêm dấu chấm vào các nhóm 3 chữ số
}

function validateAmount(value) {
    let rawValue = value.replace(/\./g, ''); // Loại bỏ dấu chấm
    return parseInt(rawValue) > 100000; // Chỉ hợp lệ khi giá trị > 0
}

// Xử lý nhập số tiền
document.getElementById('amount').addEventListener('input', function () {
    this.value = formatCurrency(this.value);

    let errorMessage = document.getElementById('error-message');
    if (!validateAmount(this.value)) {
        errorMessage.textContent = 'Số tiền gửi không hợp lệ. Vui lòng nhập số tiền lớn hơn 100.000 đ.';
        document.querySelector('button[type="submit"]').disabled = true;
    } else {
        errorMessage.textContent = '';
        document.querySelector('button[type="submit"]').disabled = false;
    }
});

// Xử lý sự kiện submit form
document.getElementById('savingForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Ngăn submit mặc định


    let form = event.target;
    let formData = new FormData(form);
    let queryString = new URLSearchParams(formData).toString()
    let formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value
    });
    console.log(formDataObject);

    fetch('/guitien', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObject)
    })
        .then((respone) => {
            return respone.json()
        })
        .then(data => {
            if (data.status == false) {
                //alert(data.message)
                document.getElementById('message').innerHTML = data.message
                document.getElementById('Error').classList.add('show');
                document.getElementById('overlay').classList.add('show');

                document.getElementById('close').addEventListener('click', () => {
                    document.getElementById('Error').classList.remove('show');
                    document.getElementById('overlay').classList.remove('show');
                })
            }
            else {
                document.getElementById('popup').classList.add('show');
                document.getElementById('overlay').classList.add('show');
            }
        })
        .catch(error => {
            console.log(error)
        })
});

// Đóng popup thành công
document.getElementById('closePopup').addEventListener('click', function () {
    window.location.href = "HomePage";
});

// Xử lý sự kiện hủy
document.getElementById('cancelBtn').addEventListener('click', function () {
    document.getElementById('cancelPopup').classList.add('show');
    document.getElementById('cancelOverlay').classList.add('show');
});

// Xác nhận hủy
document.getElementById('confirmCancel').addEventListener('click', function () {
    window.location.href = "HomePage"; // Điều hướng về trang khác
});

// Đóng popup hủy
document.getElementById('closeCancelPopup').addEventListener('click', function () {
    document.getElementById('cancelPopup').classList.remove('show');
    document.getElementById('cancelOverlay').classList.remove('show');
});