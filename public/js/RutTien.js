// Định dạng số tiền nhập
function formatCurrency(input) {
    let value = input.replace(/\D/g, ''); 
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Thêm dấu chấm vào các nhóm 3 chữ số
}

// kiem so tien cho dung dinh dang
function validateAmount(value) {
    let rawValue = value.replace(/\./g, ''); 
    
}

// Xử lý sự kiện khi người dùng nhập số tiền
document.getElementById('amount').addEventListener('input', function(e) {
    let formattedValue = formatCurrency(this.value); // Định dạng lại số tiền
    this.value = formattedValue;

    
});

// Khi nhấn "Lập phiếu", hiển thị popup rút tiền thành công
document.getElementById('savingForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Hiển thị popup rút tiền thành công
    document.getElementById('popup').classList.add('show');
    document.getElementById('overlay').classList.add('show');
});

// Nút đóng popup
document.getElementById('closePopup').addEventListener('click', function() {
    //chuyen ve trang home
    window.location.href = "HomePage";
});

// Nút hủy cx về home
document.getElementById('cancelBtn').addEventListener('click', function() {
    if (confirm('Bạn có chắc chắn muốn hủy không?')) {
        window.location.href = "HomePage"; // Chuyển về trang homepage
    }
});