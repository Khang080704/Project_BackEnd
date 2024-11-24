/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('Customer').del()
  await knex('Customer').insert([
    {id_card: '089204007253', cus_name: 'Pham Gia Khang', cus_address: 'An Giang'},
    {id_card: '089204007254', cus_name: 'Ngọc Minh', cus_address: '0, Ấp Nhật Xuân, Phường 03, Quận Hữu Kiều Quảng Nam'},
    {id_card: '089204007255', cus_name: 'Trang Huyền', cus_address: 'Quận Cung Yên Bái'},
    {id_card: '089204007256', cus_name: 'Tùng Huỳnh', cus_address: '27 Phố Thục, Phường Danh, Quận 61 Lai Châu'},
    {id_card: '089204007257', cus_name: 'Hoàng Hạ', cus_address: '4405, Thôn Hợp, Phường Duy Phụng, Quận Thơ Mang Bắc Ninh'},
  ]);
};
