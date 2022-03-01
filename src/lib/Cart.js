import find from "lodash/find";
import remove from "lodash/remove";
import Dinero from "dinero.js";
import { calculateDiscount } from "./discount.utils";

const Money = Dinero;
Money.defaultCurrency = "BRL";
Money.defaultPrecision = 2;

export default class Cart {
	items = [];

	getTotal() {
		return this.items.reduce((acc, { product, condition, quantity }) => {
			const amount = Money({ amount: quantity * product.price });
			let discount = Money({ amount: 0 });

			if (condition) {
				discount = calculateDiscount(amount, quantity, condition);
			}

			// if (item.condition?.percentage) {
			// 	discount = calculatePercentageDiscount(amount, item);
			// } else if (item.condition?.quantity) {
			// 	discount = calculateQuantityDiscount(amount, item);
			// }

			return acc.add(amount).subtract(discount);
		}, Money({ amount: 0 }));
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

	checkout() {
		const { total, items } = this.summary();

		this.items = [];

		return {
			total: total.getAmount(),
			items,
		};
	}

	summary() {
		const total = this.getTotal();
		const formatted = total.toFormat("$0,0.00");
		const items = this.items;

		return {
			total,
			formatted,
			items,
		};
	}
}
