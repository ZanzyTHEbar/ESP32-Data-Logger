import { useEffect, useState } from "react";
import username from "../../../src-tauri/config/config.json";

export function Greeting() {
    const [name, setName] = useState("");

    useEffect(() => {
        setName(username["name"]);
    }, []);
    return (
        <>
            <div className="flex flex-col justify-center items-center space-y-20">
                <p className="text-sm mb-3">
                    {name ? `Welcome ${name}` : "Welcome"}
                </p>
            </div>
        </>
    );
}
