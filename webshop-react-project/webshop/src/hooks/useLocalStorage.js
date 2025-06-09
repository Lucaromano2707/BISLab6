import { useEffect, useState } from "react";

function getValue(key, initialValue) {
    const savedValue = JSON.parse(localStorage.getItem(key));
    if (savedValue) {
        return savedValue;
    } else if (initialValue instanceof Function) {
        return initialValue();
    }

    return initialValue;
}

export default function useLocalStorage(key = null, initialValue) {
    const [value, setValue] = useState(() => {
        return getValue(key, initialValue);
    })

    useEffect(() => {
        if (key !== null && key !== undefined) {
            localStorage.setItem(key, JSON.stringify(value))
        }
    }, [key, value])

    return [value, setValue];

}