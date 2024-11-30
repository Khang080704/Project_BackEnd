/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`
        create table Depositbill (
	        id int identity(1, 1) primary key,
	        deposit_passbook varchar(255) not null,
	        deposit_money bigint not null,
	        deposit_date date default getdate()
        )
    `);

    await knex.raw(`       
        alter table Depositbill 
	        add constraint fk_passbook_id_1 
	        foreign key (deposit_passbook) 
	        references Passbook(id)
    `);

    await knex.raw(`       
        create trigger trg_UpdatePassbookBalance
        on Depositbill
        after insert
        as
        begin
            -- Cập nhật số dư của sổ tiết kiệm
            update Passbook
            set passbook_balance = passbook_balance + inserted.deposit_money
            from Passbook
            inner join inserted
            on Passbook.id = inserted.deposit_passbook
        end
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`
        DROP TABLE Depositbill;
    `);
};
