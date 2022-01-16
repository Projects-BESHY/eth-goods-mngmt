pragma solidity ^0.5.0;

contract GoodsList {
    uint public goodsCount = 0;
    mapping(uint => Product) public products;
    string[] public accounts;

    enum Category {FOOD, CLOTH, MEDICINE}
    enum ShipmentType {TRUCK, RAIL, OCEAN_FREIGHT, AIR_FREIGHT }
    enum ShipmentStatus {PENDING, DISPATCHED, ARRIVED}
    enum Condition {DAMAGED, PERFECT, UNKNOWN}

    struct Product {
        uint id;
        string name;
        string category;
        string shipment_type;
        uint shipment_date;
        string shipment_status;
        uint stock;
        uint cost_per_item;
        string last_updated_by;
    }

    event ProductAdded(
        uint id,
        string name,
        string category,
        string shipment_type,
        uint shipment_date,
        string shipment_status,
        uint stock,
        uint cost_per_item,
        string last_updated_by
    );

    event ProductStatusUpdated(
        uint id,
        string status,
        uint stock,
        string last_updated_by
    );

    event ProductStockUpdated(
        uint id,
        uint unit,
        uint previousStock,
        string last_updated_by
    );

    constructor() public {
    }

    function exists (string memory _account) public view returns (bool){
        for (uint i; i< accounts.length;i++){
            if (keccak256(bytes(accounts[i])) == keccak256(bytes(_account))) {
                return true;
            }
        }
        return false;
    }

    function getLength() public view returns (uint) {
        return accounts.length;
    }

    function addProduct(string memory _name, string memory _category, string memory _shipment_type, uint _shipment_date, uint _cost_per_item, string memory _last_updated_by) public {
        goodsCount++;
        products[goodsCount] = Product(goodsCount, _name, _category, _shipment_type, _shipment_date, "pending", 0, _cost_per_item, _last_updated_by);
        
        if (!exists(_last_updated_by)) {
            accounts.push(_last_updated_by);
        }

        emit ProductAdded(goodsCount, _name, _category, _shipment_type, _shipment_date, "pending", 0, _cost_per_item, _last_updated_by);
    }

    function updateShipmentStatus(uint _id, string memory _status, uint _stock, string memory _last_updated_by) public {
        Product memory _product = products[_id];
        _product.shipment_status = _status;
        _product.stock += _stock;
        _product.last_updated_by = _last_updated_by;
        products[_id] = _product;
        if (!exists(_last_updated_by)) {
            accounts.push(_last_updated_by);
        }
        emit ProductStatusUpdated(_id, _status, _stock, _last_updated_by);
    }

    function addToStock(uint _id, uint _unit, string memory _last_updated_by) public {
        Product memory _product = products[_id];
        uint previousStock = _product.stock;
        _product.stock = _product.stock + _unit;
        _product.last_updated_by = _last_updated_by;
        products[_id] = _product;

        if (!exists(_last_updated_by)) {
            accounts.push(_last_updated_by);
        }

        emit ProductStockUpdated(_id, _unit, previousStock, _last_updated_by);
    }

    function removeFromStock(uint _id, uint _unit, string memory _last_updated_by) public {
        Product memory _product = products[_id];
        uint previousStock = _product.stock;
        _product.stock = _product.stock - _unit;
        _product.last_updated_by = _last_updated_by;
        products[_id] = _product;

        if (!exists(_last_updated_by)) {
            accounts.push(_last_updated_by);
        }

        emit ProductStockUpdated(_id, _unit, previousStock, _last_updated_by);
    }
}