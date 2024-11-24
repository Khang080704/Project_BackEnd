/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('Typepassbook').del()
  await knex('Typepassbook').insert([
    {id: '3_thang', typename: '3 tháng', interest_rate: 0.005, term: 3, kind: 'Có kì hạn', withdrawl_term: 90, min_deposit_money: 100000, min_passbook_balance: 100000},
    {id: '6_thang', typename: '6 tháng', interest_rate: 0.0055, term: 6, kind: 'Có kì hạn', withdrawl_term: 180, min_deposit_money: 100000, min_passbook_balance: 100000},
    {id: 'vo_thoi_han', typename: 'Vô thời hạn', interest_rate: 0.0015, term: 0, kind: 'Không kì hạn', withdrawl_term: 15, min_deposit_money: 100000, min_passbook_balance: 100000},
  ]);
};
