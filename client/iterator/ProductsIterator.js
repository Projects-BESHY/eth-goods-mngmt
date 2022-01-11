import { Iterator } from './Iterator.js';

class ProductsIterator extends Iterator {
    count;
    products;
    index = 1;

    constructor(count, products) {
        super();
        this.count = count;
        this.products = products;
    }

    hasNext() {
        return this.index <= this.count;
    }

    async current() {
        return await this.products(this.index);
    }

    next() {
        this.index++;
    }
}

export { ProductsIterator }