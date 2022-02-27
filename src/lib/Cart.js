import find from "lodash/find";
import remove from "lodash/remove";

export default class Cart {
	items = [];

	getTotal() {
		return this.items.reduce((acc, item) => {
			return acc + item.quantity * item.product.price;
		}, 0);
	}

	add(item) {
		const itemToFind = { product: item.product };

		if (find(this.items, itemToFind)) {
			remove(this.items, itemToFind);
		}
		this.items.push(item);
	}

	remove(product) {
		remove(this.items, { product });
	}
}
