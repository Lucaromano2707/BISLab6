
export function getCartQuantity(cartItems) {
    return cartItems.reduce((sum, itemEntry) => sum + itemEntry.quantity, 0);
}