import { ProductCard } from "./ProductCard.js";

class ProductCardBlue extends ProductCard {
    product;

    constructor(product) {
        super();
        this.product = product;
    }

    constructUI(editProduct) {
        const $productTemplate = $('.product-row-template.hidden')
        const productId = this.product[0].toNumber()
        const productName = this.product[1]
        const productCategory = this.product[2]
        const productShipmentType = this.product[3]
        const productShipmentDate = (new Date(this.product[4].toNumber() * 1000))
        const productShipmentStatus = this.product[5]
        const productStock = this.product[6].toNumber()
        const productCostPerItem = this.product[7].toNumber()
        const productLastUpdatedBy = this.product[8]

        const $newProductTemplate = $productTemplate.clone()
        $newProductTemplate.removeClass('hidden')
        $newProductTemplate.addClass('blue');
        $newProductTemplate.find('.product-id').html(productId)
        $newProductTemplate.find('.product-name').html(productName.substr(0, 1).toUpperCase() + productName.substr(1))
        $newProductTemplate.find('.product-category').html(productCategory.substr(0, 1).toUpperCase() + productCategory.substr(1))
        $newProductTemplate.find('.product-shipment-type').html(productShipmentType.substr(0, 1).toUpperCase() + productShipmentType.substr(1))
        $newProductTemplate.find('.product-shipment-date').html(productShipmentDate.toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        }))
        $newProductTemplate.find('.product-shipment-status').html(productShipmentStatus.substr(0, 1).toUpperCase() + productShipmentStatus.substr(1))
        $newProductTemplate.find('.product-last-updated-by').html(productLastUpdatedBy.substr(0, 10) + '...')
        $newProductTemplate.find('.product-stock').html(productStock)
        $newProductTemplate.find('.product-cost-per-item').html(productCostPerItem)
        $newProductTemplate.find('.product-edit').find('.product-edit-btn')
            .attr('data-id', productId)
            .prop('id', productId)
            .on('click', editProduct)
        $newProductTemplate.find('.product-edit').find('.product-edit-stock-btn')
            .attr('data-id', productId)
            .prop('id', productId)
            .on('click', editProduct)

        return $newProductTemplate;
    }
}
export { ProductCardBlue };