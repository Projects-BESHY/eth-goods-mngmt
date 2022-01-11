import { ProductsIterator } from './ProductsIterator.js'

class ProductList {
    contract;
    products;
    productsCount;

    constructor(contract, products, productsCount) {
        this.contract = contract;
        this.products = products;
        this.productsCount = productsCount;
    }

    createIterator() {
        return new ProductsIterator(this.productsCount, this.products)
    }

    async createProduct() {
        const newProductName = $('.new-product-name').val()
        const newProductCategory = $('.new-product-category').val()
        const newProductShipmentType = $('.new-product-shipment-type').val()
        const newProductShipmentDate = (new Date($('.new-product-shipment-date').val()).getTime()) / 1000
        const newProductCostPerItem = $('.new-product-cost-per-item').val()

        await this.contract.addProduct(newProductName, newProductCategory, newProductShipmentType, newProductShipmentDate, newProductCostPerItem)
    }

    async updateProductStatus() {
        const productId = Number($('.modal-product-id').attr('data-id'))
        const newShipmentStatus = $('.modal-product-shipment-status').val()
        const newCondition = $('.modal-product-condition').val()
        const newStock = $('.modal-product-stock').val()

        await this.contract.updateShipmentStatus(productId, newShipmentStatus, newCondition, newStock)
    }

    async updateProductStock() {
        const productId = Number($('.modal-product-id').attr('data-id'))
        const unit = Number($('.modal-product-stock-unit').val())
        const stockTo = $('.modal-product-stock-to').val()

        if (stockTo === 'increase')
            await this.contract.addToStock(productId, unit)
        else
            await this.contract.removeFromStock(productId, unit)
    }
}

export { ProductList };