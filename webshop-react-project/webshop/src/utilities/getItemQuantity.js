
export function getItemQuantity(id, cartItems) {
    const foundItem = cartItems.find(itemEntry => itemEntry.item.id === id);
    return foundItem ? foundItem.quantity : 0;
}