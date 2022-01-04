App = {
    loading: false,
    contracts: {},

    load: async () => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount: async () => {
        App.account = web3.eth.accounts[0]
        web3.eth.defaultAccount = web3.eth.accounts[0];
    },

    loadContract: async () => {
        const goodsList = await $.getJSON('GoodsList.json')
        App.contracts.GoodsList = TruffleContract(goodsList)
        App.contracts.GoodsList.setProvider(App.web3Provider)
        App.goodsList = await App.contracts.GoodsList.deployed()
    },

    render: async () => {
        if (App.loading) {
            return
        }

        App.setLoading(true)
        await App.renderProducts()
        App.setLoading(false)
    },

    renderProducts: async () => {
        const goodsCount = await App.goodsList.goodsCount()
        const $productTemplate = $('.product-row-template')

        for (let i = 1; i <= goodsCount; i++) {
            const product = await App.goodsList.products(i)
            const productId = product[0].toNumber()
            const productName = product[1]
            const productCategory = product[2]
            const productShipmentType = product[3]
            const productShipmentDate = (new Date(product[4].toNumber() * 1000))
            const productShipmentStatus = product[5]
            const productCondition = product[6]
            const productStock = product[7].toNumber()
            const productCostPerItem = product[8].toNumber()

            const $newProductTemplate = $productTemplate.clone()
            $newProductTemplate.find('.product-id').html(productId)
            $newProductTemplate.find('.product-name').html(productName.substr(0,1).toUpperCase() + productName.substr(1))
            $newProductTemplate.find('.product-category').html(productCategory.substr(0,1).toUpperCase() + productCategory.substr(1))
            $newProductTemplate.find('.product-shipment-type').html(productShipmentType.substr(0,1).toUpperCase() + productShipmentType.substr(1))
            $newProductTemplate.find('.product-shipment-date').html(productShipmentDate.toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
            }))
            $newProductTemplate.find('.product-shipment-status').html(productShipmentStatus.substr(0,1).toUpperCase() + productShipmentStatus.substr(1))
            $newProductTemplate.find('.product-condition').html(productCondition.substr(0,1).toUpperCase() + productCondition.substr(1))
            $newProductTemplate.find('.product-stock').html(productStock)
            $newProductTemplate.find('.product-cost-per-item').html(productCostPerItem)
            $newProductTemplate.find('.product-edit').find('.product-edit-btn')
                .attr('data-id', productId)
                .prop('id', productId)
                .on('click', App.editProduct)
            $newProductTemplate.find('.product-edit').find('.product-edit-stock-btn')
                .attr('data-id', productId)
                .prop('id', productId)
                .on('click', App.editProduct)

            $('.products-list').append($newProductTemplate)
            $newProductTemplate.show()
        }
    },

    editProduct: async (e) => {
        const productId = e.target.getAttribute('data-id')
        const product = await App.goodsList.products(productId)
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
    },

    updateProductStatus: async () => {
        App.setLoading(true)
        const productId = Number($('.modal-product-id').attr('data-id'))
        const newShipmentStatus = $('.modal-product-shipment-status').val()
        const newCondition = $('.modal-product-condition').val()
        const newStock = $('.modal-product-stock').val()

        await App.goodsList.updateShipmentStatus(productId, newShipmentStatus, newCondition, newStock)

        window.location.reload()
    },

    updateProductStock: async () => {
        App.setLoading(true)
        const productId = Number($('.modal-product-id').attr('data-id'))
        const unit = Number($('.modal-product-stock-unit').val())
        const stockTo = $('.modal-product-stock-to').val()

        if (stockTo === 'increase')
            await App.goodsList.addToStock(productId, unit)
        else
            await App.goodsList.removeFromStock(productId, unit)
        
        window.location.reload()
    },

    createProduct: async() => {
        App.setLoading(true)
        const newProductName = $('.new-product-name').val()
        const newProductCategory = $('.new-product-category').val()
        const newProductShipmentType = $('.new-product-shipment-type').val()
        const newProductShipmentDate = (new Date($('.new-product-shipment-date').val()).getTime()) / 1000
        const newProductCostPerItem = $('.new-product-cost-per-item').val()

        await App.goodsList.addProduct(newProductName, newProductCategory, newProductShipmentType, newProductShipmentDate, newProductCostPerItem)

        window.location.reload()
    },

    setLoading: (boolean) => {
        App.loading = boolean
    },
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})