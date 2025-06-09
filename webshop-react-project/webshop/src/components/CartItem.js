import { useAppContext } from "../hooks/useAppContext";
import { Button, Stack, Form } from "react-bootstrap"
import { CURRENCY_FORMATTER } from "../utilities/currencyFormatter"
import { TbTrashXFilled } from "react-icons/tb";
import { useState } from 'react';

export function CartItem({ itemEntry }) {
    const id = itemEntry.item.id;
    const name = itemEntry.item.name;
    const price = itemEntry.item.price;
    const quantity = itemEntry.quantity;

    const { removeItemFromCart, setItemQuantity } = useAppContext();
    const [selectedValue, setSelectedValue] = useState(quantity);

    const handleSelectChange = (event) => {
        const val = parseInt(event.target.value, 10);
        setSelectedValue(val);
        setItemQuantity(id, val);
    };

    return (
        <>
            <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
                <img src={`/imgs/${id}.jpg`} alt={"bike" + id}
                    style={{ width: "200px", height: "140px", objectFit: "cover" }} />
                <div className="me-auto">
                    <div>
                        {name}
                    </div>
                    <div className="text-muted" style={{ fontSize: ".80rem" }}>
                        {quantity} x {CURRENCY_FORMATTER.format(price)}
                    </div>
                </div>
                <Form.Select
                    style={{ width: '4rem', height: '2.5rem', border: '1px solid #343a40' }}
                    value={selectedValue}
                    onChange={handleSelectChange}>
                    {Array.from({ length: 9 }, (_, index) => (
                        <option key={index + 1} value={index + 1}>{index + 1}</option>
                    ))}
                </Form.Select>
                <Button
                    style={{ height: '2.5rem' }}
                    variant="danger"
                    onClick={() => removeItemFromCart(itemEntry.item.id)}>
                    <TbTrashXFilled size={25} />
                </Button>
            </Stack>
            <hr />
        </>

    )
}