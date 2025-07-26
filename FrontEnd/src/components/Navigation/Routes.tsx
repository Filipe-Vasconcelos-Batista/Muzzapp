import { Navigate } from 'react-router-dom';
import {isLoggedIn} from "../../utils/Auth.ts";
import {JSX} from "react";

export function PrivateRoute({ children }: { children: JSX.Element }) {
    return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

export function PublicOnlyRoute({ children }: { children: JSX.Element }) {
    return isLoggedIn() ? <Navigate to="/dashboard" replace /> : children;
}

