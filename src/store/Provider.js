import { ReduxContext } from "./StoreContext";

export const Provider = ({ store, children }) => (
    <ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>
);