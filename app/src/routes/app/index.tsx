import Header from "@components/Header";
import Home from "@pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function AppRoutes() {
    return (
        <BrowserRouter basename={"/"}>
            <Header name="Water Chamber" />
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}
