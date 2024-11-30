/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`
        create table Passbook (
	        id varchar(255) primary key,
	        passbook_balance bigint not null,
	        passbook_type varchar(255) not null,
	        passbook_customer varchar(15) not null,
	        open_date date default getdate() not null,
	        increasement_date datetime default dateadd(month, 1, getdate()),
	        withdrawl_date datetime default getdate(),
	        status int default 0 
        )
    `);
	await knex.raw(`
        create table Typepassbook (
	        id varchar(255) primary key,
	        typename nvarchar(200) default N'Không kì hạn',
	        interest_rate float not null,
	        term int default 0 unique,
	        kind nvarchar(200) default N'Không kì hạn',
	        withdrawl_term int default 0,
	        min_deposit_money bigint default 0,
	        min_passbook_balance bigint default 0
        )
    `);

    await knex.raw(`
        alter table Passbook 
	        add constraint fk_customer_id 
	        foreign key(passbook_customer) 
	        references Customer(id_card)
    `)
	
    await knex.raw(`
		alter table Passbook 
			add constraint fk_typepassbook_id 
			foreign key(passbook_type) 
			references Typepassbook(id)	
	`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`
        DROP TABLE Passbook;
    `);
	await knex.raw(`
        DROP TABLE Typepassbook;
    `);
};
