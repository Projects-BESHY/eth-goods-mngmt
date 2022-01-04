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

    it('creates and lists default product', async () => {
        const goodsCount = await this.goodsList.goodsCount()
        const product = await this.goodsList.products(goodsCount)
        assert.equal(product.id.toNumber(), goodsCount.toNumber())
        assert.equal(product.name, 'Product 1')
        assert.equal(product.category, 'Food')
        assert.equal(product.shipment_type, 'Air freight')
        assert.equal(product.shipment_status, 'pending')
        assert.equal(product.condition, 'unknown')
        assert.equal(product.stock.toNumber(), 0)
        assert.equal(product.cost_per_item.toNumber(), 72)
        assert.equal(goodsCount.toNumber(), 1)
    })

    it('creates product', async () => {
        const result = await this.goodsList.addProduct('A new product', 'Cloth', 'truck', 1641299030161, 34)
        const goodsCount = await this.goodsList.goodsCount()
        assert.equal(goodsCount, 2)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.name, 'A new product')
        assert.equal(event.category, 'Cloth')
        assert.equal(event.shipment_type, 'truck')
        assert.equal(event.shipment_status, 'pending')
        assert.equal(event.condition, 'unknown')
        assert.equal(event.stock.toNumber(), 0)
        assert.equal(event.cost_per_item.toNumber(), 34)
    })

    it('updates shipment status', async () => {
        const result = await this.goodsList.updateShipmentStatus(1, 'arrived', 'perfect', 5)
        const updatedProduct = await this.goodsList.products(1)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), updatedProduct.id.toNumber())
        assert.equal(event.status, updatedProduct.shipment_status)
        assert.equal(event.condition, updatedProduct.condition)
        assert.equal(event.stock.toNumber(), updatedProduct.stock.toNumber())
    })

    it('updates stock - add', async () => {
        const result = await this.goodsList.addToStock(1, 4)
        const updatedProduct = await this.goodsList.products(1)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), updatedProduct.id.toNumber())
        assert.equal(event.unit.toNumber(), (updatedProduct.stock.toNumber() - event.previousStock.toNumber()))
    })

    it('updates stock - remove', async () => {
        const result = await this.goodsList.removeFromStock(1, 4)
        const updatedProduct = await this.goodsList.products(1)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), updatedProduct.id.toNumber())
        assert.equal(event.previousStock.toNumber(), (updatedProduct.stock.toNumber() + event.unit.toNumber()))
    })
    
})