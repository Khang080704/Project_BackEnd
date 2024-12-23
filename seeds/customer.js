/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
// Deletes ALL existing entries


  await knex('Customer').del()
  await knex('Customer').insert([
    {id_card: '01999178481 ', cus_name: 'Liên Hạ', cus_address: '533 Phố Mã Trang Lam, Phường Bạch Cấn, Huyện Khánh Ý Vĩnh Phúc'},
    {id_card: '845105894747', cus_name: 'Ngọc Minh', cus_address: '0, Ấp Nhật Xuân, Phường 03, Quận Hữu Kiều Quảng Nam'},
    {id_card: '0541994438', cus_name: 'Trang Huyền', cus_address: 'Quận Cung Yên Bái'},
    {id_card: '842404269510', cus_name: 'Tùng Huỳnh', cus_address: '27 Phố Thục, Phường Danh, Quận 61 Lai Châu'},
    {id_card: '841680258896 ', cus_name: 'Hoàng Hạ', cus_address: '4405, Thôn Hợp, Phường Duy Phụng, Quận Thơ Mang Bắc Ninh'},
    {id_card: '0685598384 ', cus_name: 'Kiệt Trần', cus_address: '25 Phố Cù Nghiệp Trân, Phường Bảo Oanh, Huyện Kha Điện Biên'},
    {id_card: '842183021668 ', cus_name: 'Nhã Mẫn', cus_address: '3672, Ấp 78, Xã 5, Huyện Tuệ Lĩnh Tiền Giang'},
    {id_card: '02416279735 ', cus_name: 'Nga Thảo', cus_address: '0 Phố Bạch Mỹ Tài, Thôn Hán Vịnh, Quận Ngụy Quảng Nam'},
    {id_card: '0207254506  ', cus_name: 'Dung Chiêu', cus_address: '6, Thôn Bửu Miên, Phường Nông Triết Thực, Quận Hy Cầm Vĩnh Long'},
    {id_card: '0764060344 ', cus_name: 'Vũ Cao', cus_address: '7598, Thôn 93, Phường Diệu Đạo, Huyện 6 Ninh Thuận'},
    {id_card: '07810952026 ', cus_name: 'Huỳnh Thị Phương Đăng', cus_address: 'Thành phố Bạc Liêu'},
  ]);
  

  // Deletes ALL existing entries
  await knex('Passbook').del()
  await knex('Passbook').insert([
    {id: 1, passbook_balance: 5000000, passbook_type: 1, passbook_customer: '01999178481' ,open_date:'2024-12-01', status: 1},
    {id: 2, passbook_balance: 7500000, passbook_type: 2, passbook_customer: '845105894747' ,open_date:'2024-12-02', status: 0},
    {id: 3, passbook_balance: 20000000, passbook_type: 3, passbook_customer: '845105894747' ,open_date:'2024-12-02', status: 1},
    {id: 4, passbook_balance: 30500000, passbook_type: 2, passbook_customer: '845105894747' ,open_date:'2024-12-03', status: 0},
    {id: 5, passbook_balance: 10950000, passbook_type: 1, passbook_customer: '0541994438' ,open_date:'2024-12-03', status: 1},
    {id: 6, passbook_balance: 45000000, passbook_type: 1, passbook_customer: '842404269510' ,open_date:'2024-12-04', status: 0},
    {id: 7, passbook_balance: 3500000, passbook_type: 3, passbook_customer: '842404269510' ,open_date:'2024-12-05', status: 1},
    {id: 8, passbook_balance: 12750000, passbook_type: 1, passbook_customer: '01999178481' ,open_date:'2024-12-05', status: 1},
    {id: 9, passbook_balance: 100000000, passbook_type: 2, passbook_customer: '841680258896' ,open_date:'2024-12-05', status: 0},
    {id: 10, passbook_balance: 5500000, passbook_type: 3, passbook_customer: '841680258896' ,open_date:'2024-12-06', status: 1},
    {id: 11, passbook_balance: 7500000, passbook_type: 3, passbook_customer: '0685598384' ,open_date:'2024-12-07', status: 1},
    {id: 12, passbook_balance: 10950000, passbook_type: 1, passbook_customer: '842183021668' ,open_date:'2024-11-28', status: 0},
    {id: 13, passbook_balance: 11500000, passbook_type: 2, passbook_customer: '0685598384' ,open_date:'2024-11-29', status: 1},
    {id: 14, passbook_balance: 55000000, passbook_type: 3, passbook_customer: '842183021668' ,open_date:'2024-11-30', status: 1},
    {id: 15, passbook_balance: 67500000, passbook_type: 2, passbook_customer: '02416279735' ,open_date:'2024-11-27', status: 0},
    {id: 16, passbook_balance: 100500000, passbook_type: 3, passbook_customer: '02416279735' ,open_date:'2025-01-01', status: 1},
    {id: 17, passbook_balance: 12000000, passbook_type: 1, passbook_customer: '02416279735' ,open_date:'2025-01-02', status: 0},
    {id: 18, passbook_balance: 17000000, passbook_type: 2, passbook_customer: '0207254506' ,open_date:'2025-01-02', status: 1},
    {id: 19, passbook_balance: 18975000, passbook_type: 2, passbook_customer: '0207254506' ,open_date:'2025-01-03', status: 1},
    {id: 20, passbook_balance: 22500000, passbook_type: 1, passbook_customer: '0764060344' ,open_date:'2025-01-03', status: 1},
    {id: 21, passbook_balance: 1000000, passbook_type: 1, passbook_customer: '07810952026' ,open_date:'2025-01-04', status: 0},
    {id: 22, passbook_balance: 35000000, passbook_type: 2, passbook_customer: '07810952026' ,open_date:'2025-01-05', status: 1},
  ]);

  

};
