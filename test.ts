import Auth from "./Managers/Auth";
import {log} from "winston";

Auth.password_hash("Avinash@99").then(r => console.log(r))