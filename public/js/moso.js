// Định dạng số tiền nhap do co với dấu chấm
function formatCurrency(input) {
    let value = input.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Thêm dấu chấm vào các nhóm 3 chữ số
}

// Kiểm tra số tiền không được ít hơn 100.000 đồng
function validateAmount(value) {
    let rawValue = value.replace(/\./g, ''); // Loại bỏ dấu chấm
    if (parseInt(rawValue) < 100000) {
        return false; // Số tiền nhỏ hơn 100.000 đ
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
        document.querySelector('button[type="submit"]').disabled = true; // Vô hiệu hóa nút "Mở sổ"
    } else {
        errorMessage.textContent = '';
        document.querySelector('button[type="submit"]').disabled = false; // Bật lại nút "Mở sổ"
    }
});

//kiem tra so tien va cho submit sang 1 trang moi
document.getElementById('savingForm').addEventListener('submit', function(event) {
    let amountValue = document.getElementById('amount').value;
    
    // Kiểm tra số tiền trước khi submit
    if (!validateAmount(amountValue)) {
        event.preventDefault(); // Ngăn việc submit nếu số tiền không hợp lệ
        alert('Số tiền gửi không hợp lệ. Vui lòng nhập số tiền lớn hơn 100.000 đ.');
    } else {
        let form = event.target;
        let formData = new FormData(form);
        let queryString = new URLSearchParams(formData).toString()
        
        event.preventDefault(); // Ngăn trình duyệt nạp lại trang
        document.getElementById('popup').classList.add('show');
        document.getElementById('overlay').classList.add('show');

        let urlToSend = "./moso?" + queryString;
        console.log(urlToSend)
        fetch('/moso',{
            method : 'post',
            headers : {
                'Content-Type': 'application/json' 
            },
            body : JSON.stringify({
                url : urlToSend
            })
        })
        .then(respone => respone.json())
        .then(data => {
            console.log(data)
        })    
        .catch(error => {
            console.log(error)
        })
    }
});
// Nút đóng popup
document.getElementById('closePopup').addEventListener('click', function() {
    // Chuyển hướng về trang homepage
    window.location.href = "HomePage";
});


document.getElementById('cancelBtn').addEventListener('click', function() {
if (confirm('Bạn có chắc chắn muốn hủy không?')) {
    window.location.href = "HomePage"; // Chuyển về trang homepage /
}
});