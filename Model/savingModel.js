
var accounts = [
    {
        id: [ 'MS01' ],
        type: [ '3_thang' ],
        customer: [ 'Phạm Gia Khang' ],
        cmnd: [ '987654321' ],
        address: [ 'An Giang' ],
        openDate: [ '2024-10-17' ],
        amount: [ '100000' ]
    },
    {
        id: [ 'MS02' ],
        type: [ '6_thang' ],
        customer: [ 'Đoàn Gia Huệ' ],
        cmnd: [ '1234' ],
        address: [ 'Phú Yên' ],
        openDate: [ '2024-10-22' ],
        amount: [ '150000' ]
    },
    {
        id: [ 'MS03' ],
        type: [ 'vo_thoi_han' ],
        customer: [ 'Đoàn Gia Huệ' ],
        cmnd: [ '1234' ],
        address: [ 'Phú Yên' ],
        openDate: [ '2024-10-22' ],
        amount: [ '150000' ]
    }
]

function addAccount(account) {
    accounts.push(account);
}

function findByID(data, object){
    for(let i = 0; i < object.length;i++){
        if(data["id"] == object[i]["id"]){
            return object[i];
        }
    }

}

module.exports = {
    accounts,
    findByID,
    addAccount
}