
import { useLocalStorageAppStateContext } from "../context/LocalStorageAppStateContext";

export function useAppContext() {
    const ContextHook = useLocalStorageAppStateContext;

    return ContextHook();
}