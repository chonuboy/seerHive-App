
import { store } from "@/Features/Store";



const currentstate = store.getState().credentials;
export const Email = currentstate.Email;
export const Password = currentstate.Password;
