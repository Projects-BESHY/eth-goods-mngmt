pragma solidity ^0.5.0;

contract GoodsList {
    uint public goodsCount = 0;
    mapping(uint => Product) public products;

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
        string condition;
        uint stock;
        uint cost_per_item;
    }

    event ProductAdded(
        uint id,
        string name,
        string category,
        string shipment_type,
        uint shipment_date,
        string shipment_status,
        string condition,
        uint stock,
        uint cost_per_item
    );

    event ProductStatusUpdated(
        uint id,
        string status,
        string condition,
        uint stock
    );

    event ProductStockUpdated(
        uint id,
        uint unit
    );

    constructor() public {}

    function addProduct(string memory _name, string memory _category, string memory _shipment_type, uint _shipment_date, uint _cost_per_item) public {
        goodsCount++;
        products[goodsCount] = Product(goodsCount, _name, _category, _shipment_type, _shipment_date, "pending", "unknown", 0, _cost_per_item);

        emit ProductAdded(goodsCount, _name, _category, _shipment_type, _shipment_date, "pending", "unknown", 0, _cost_per_item);
    }

    function updateShipmentStatus(uint _id, string memory _status, string memory _condition, uint _stock) public {
        Product memory _product = products[_id];
        _product.shipment_status = _status;
        _product.condition = _condition;
        _product.stock = _stock;
        products[_id] = _product;

        emit ProductStatusUpdated(_id, _status, _condition, _stock);
    }

    function addToStock(uint _id, uint _unit) public {
        Product memory _product = products[_id];
        _product.stock = _product.stock + _unit;
        products[_id] = _product;

        emit ProductStockUpdated(_id, _unit);
    }

    function removeFromStock(uint _id, uint _unit) public {
        Product memory _product = products[_id];
        _product.stock = _product.stock - _unit;
        products[_id] = _product;

        emit ProductStockUpdated(_id, _unit);
    }
}