import { ProductList } from './iterator/ProductList.js'
import { ProductCard } from './builder/ProductCard.js'
import { LoadService } from './facade/LoadService.js'

class App {
    contracts = {}

    async load() {
        // Load essential services: web3, account, contract
        const loadService = new LoadService(this);
        await loadService.load();

        // Create ProductList object using goodsList in the contract (JS representation of the solidity contract)
        this.productList = new ProductList(this.goodsList, await this.goodsList.products, await this.goodsList.goodsCount());

        // Display list of products on html
        await this.renderProducts()
    }

    async renderProducts() {
        // Create an iterator for productsList
        const productIterator = this.productList.createIterator();

        // Iterate, construct, and display UI for each product
        while (productIterator.hasNext()) {
            let product = await productIterator.current();
            let card = (new ProductCard(product)).constructUI(this.editProduct);    // Create builder for a product and build the UI using the builder
            $('.products-list').append(card);
            card.show();
            productIterator.next();
        } 
    }

    // function to populate editing modal boxes
    async editProduct(e) {
        const productId = Number(e.target.getAttribute('data-id'));
        const product = await app.goodsList.products(productId);
        const productName = product[1]
        const productCategory = product[2]
        const productShipmentType = product[3]
        const productShipmentDate = (new Date(product[4].toNumber() * 1000))
        const productShipmentStatus = product[5]
        const productCondition = product[6]
        const productStock = product[7].toNumber()
        const productCostPerItem = product[8].toNumber()


        $('.modal-product-id').attr('data-id', productId)
        $('.modal-product-name').attr('value', productName)
        $('.modal-product-category').attr('value', productCategory)
        $('.modal-product-shipment-type').attr('value', productShipmentType)
        $('.modal-product-shipment-date').attr('value', productShipmentDate.toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        }))
        $('.modal-product-shipment-status').val(productShipmentStatus)
        $('.modal-product-condition').val(productCondition)
        $('.modal-product-stock').attr('value', productStock)
        $('.modal-product-cost-per-item').attr('value', productCostPerItem)
    }

    async updateProductStatus() {
        await this.productList.updateProductStatus();
        window.location.reload()
    }

    async updateProductStock() {
        await this.productList.updateProductStock();
        window.location.reload()
    }

    async createProduct() {
        await this.productList.createProduct();
        window.location.reload()
    }
}

$(() => {
    $(window).load(() => {
        window.app = new App();
        app.load();
    })
})