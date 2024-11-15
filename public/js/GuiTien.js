const { response } = require("express");

// Định dạng số tiền nhap do co với dấu chấm
function formatCurrency(input) {
    let value = input.replace(/\D/g, ''); // Loại số
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Thêm dấu chấm 
}

// Kiểm tra số tiền không được ít hơn 100.000 đồng
function validateAmount(value) {
    let rawValue = value.replace(/\./g, ''); // Loại chấm
    if (parseInt(rawValue) < 100000) {
        return false; // Số tiền nhỏ hơn 100.000 
    }
    return true;
}

// Xử lý sự kiện khi người dùng nhập số tiền
document.getElementById('amount').addEventListener('input', function(e) {
    let formattedValue = formatCurrency(this.value); // Định dạng lại số tiền
    this.value = formattedValue;

    let errorMessage = document.getElementById('error-message');
    
    // Kiểm tra số tiền có hợp lệ không
    if (!validateAmount(this.value)) {
        errorMessage.textContent = 'Số tiền gửi không được ít hơn 100.000 đ';
        document.querySelector('button[type="submit"]').disabled = true; //vô hiệu
    } else {
        errorMessage.textContent = '';
        document.querySelector('button[type="submit"]').disabled = false; //mở lên
    }
});

//kiem tra so tien va cho submit 
    document.getElementById('savingForm').addEventListener('submit', function(event) {
    let amountValue = document.getElementById('amount').value;
    
    // Kiểm tra số tiền trước khi submit
    if (!validateAmount(amountValue)) {
        event.preventDefault(); 
        alert('Số tiền gửi không hợp lệ. Vui lòng nhập số tiền lớn hơn 100.000 đ.');
    } else {
        let form = event.target;
        let formData = new FormData(form);
        let queryString = new URLSearchParams(formData).toString()
        let urlToSend = "./moso?" + queryString;
        fetch('/guitien',{
            method : 'post',
            headers :{
                'Content-Type': 'application/json' 
            },
            body : JSON.stringify({
                url : urlToSend
            })
        }).then(response => {
            const info = response.json();
            if(info.status == true){
                // Nếu hợp lệ show popup
                event.preventDefault(); 
                document.getElementById('popup').classList.add('show');
                document.getElementById('overlay').classList.add('show');
            }
            else{
                alert("Thong tin nhap vao khong chinh xac")
            }
        })
        .catch(error => {
            console.log(error)
        })
        
        
    }
});
// nhấn dô ok thì trở về home
document.getElementById('closePopup').addEventListener('click', function() {
    
    window.location.href = "HomePage";
});
//nút hủy cx về home
document.getElementById('cancelBtn').addEventListener('click', function() {
if (confirm('Bạn có chắc chắn muốn hủy không?')) {
    window.location.href = "HomePage"; // Chuyển về trang homepage /
}
});