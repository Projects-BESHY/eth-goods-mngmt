const { assert } = require("chai")

const GoodsList = artifacts.require('GoodsList')

contract('GoodsList', (accounts) => {
    before(async () => {
        this.goodsList = await GoodsList.deployed()
    })

    it('deploys successfully', async () => {
        const address = await this.goodsList.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

})