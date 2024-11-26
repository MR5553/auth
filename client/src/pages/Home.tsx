import { DragEvent, useRef, useState } from "react"
import { HiOutlineUpload } from "react-icons/hi";
import { cn } from "../lib/utils";
import { Dialog } from "../components/Dialog";
import { Button } from "../components/Button";

export default function Home() {
    const [, setImage] = useState<File>();
    const [isDragging, setIsDragging] = useState<boolean>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [open] = useState(false)

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            setImage(file);
        }
    }

    const ref = useRef<HTMLDialogElement>(null)

    const handleDialog = () => {
        ref.current?.showModal()
    }

    return (
        <>
            <Button onClick={handleDialog}>Open Dialog</Button>
            <Dialog open={open} ref={ref}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, rerum? Expedita, voluptate. Quos ducimus corrupti molestiae repellat! Repellendus esse tenetur maiores sint minima, officiis corporis cumque minus a laborum aspernatur.</Dialog>


            <div className="flex items-center justify-center h-dvh">
                <div className={cn(`w-[40rem] h-[15rem] flex flex-col items-center justify-center gap-2  rounded-md p-4 cursor-pointer transition-colors duration-300 border-2 border-dashed border-neutral-300 bg-neutral-100 dark:bg-neutral-800 ${isDragging && "border-blue-700 bg-blue-50"}`)}
                    onDragEnter={(e: DragEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(true);
                    }}
                    onDragOver={(e: DragEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(true);
                    }}
                    onDragLeave={(e: DragEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(false);
                    }}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >

                    <input
                        type="file"
                        name="image"
                        className="hidden"
                        multiple={true}
                        ref={fileInputRef}
                        onChange={(e) => setImage(e.target.files![0])}
                    />

                    <HiOutlineUpload size={40} />

                    <p className={cn("text-blue-900 font-medium")}>
                        Drop your image here, or <span className="text-blue-500">Browse</span>
                    </p>

                    <span className={cn("text-xs text-neutral-400 font-normal")}>Supports: JPG, PNG, JPG2000 </span>
                </div>
            </div >
        </>
    )
}