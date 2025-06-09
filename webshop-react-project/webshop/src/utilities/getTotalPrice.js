
export function getTotalPrice(cartItems) {
    let sum = 0;

    cartItems.forEach(itemEntry => {
        let price = itemEntry.item.price;
        sum += itemEntry.quantity * price;
    });

    return sum;
}