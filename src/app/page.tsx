"use client";
import { toast } from "react-toastify";
import { Button } from "shadcn/button";
import ButtonToggleMode from "src/components/toggle-mode/ButtonToggleMode";

export default function Home() {
    return (
        <div>
            <ButtonToggleMode></ButtonToggleMode>
            <Button onClick={() => toast.success("OK done!")}>Click</Button>
        </div>
    );
}
