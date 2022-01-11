class LoadService{

    constructor(app){
        this.app = app
    }

    async load() {
        await this.loadWeb3()
        await this.loadAccount()
        await this.loadContract()
    }

    async loadWeb3() {
        if (typeof web3 !== 'undefined') {
            this.app.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dthis browsers...
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
        // Legacy dthis browsers...
        else if (window.web3) {
            this.app.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */ })
        }
        // Non-dthis browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    async loadAccount() {
        this.app.account = web3.eth.accounts[0]
        web3.eth.defaultAccount = web3.eth.accounts[0];
    }

    async loadContract() {
        const goodsList = await $.getJSON('GoodsList.json')
        this.app.contracts.GoodsList = TruffleContract(goodsList)
        this.app.contracts.GoodsList.setProvider(this.app.web3Provider)
        this.app.goodsList = await this.app.contracts.GoodsList.deployed()
    }
}

export { LoadService };