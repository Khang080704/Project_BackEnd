/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`
        create table Customer (
	        cus_name nvarchar(100) not null,
	        cus_address nvarchar(200) default null,
	        id_card varchar(15) primary key
        )
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`
        DROP TABLE Customer;
    `);
};
