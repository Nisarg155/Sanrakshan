import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { useEffect } from "react"
import Image from "next/image"

interface PaymentStatusDialogProps {
    open: boolean
    onClose: () => void
    isSuccess: boolean
    imageSrc: string // e.g. "/images/success.png"
}

export default function PaymentStatusDialog({
                                                open,
                                                onClose,
                                                isSuccess,
                                                imageSrc,
                                            }: PaymentStatusDialogProps) {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => onClose(), 3000)
            return () => clearTimeout(timer)
        }
    }, [open, onClose])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-xl p-6 rounded-xl text-center space-y-4">
                <Image
                    src={imageSrc}
                    alt={isSuccess ? "Success" : "Failure"}
                    width={160}
                    height={160}
                    className="mx-auto"
                />

                <DialogHeader>
                    <DialogTitle className={`text-2xl font-bold ${isSuccess ? "text-green-600" : "text-red-600"}`}>
                        {isSuccess ? "Payment Successful" : "Payment Failed"}
                    </DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground mt-2">
                        {isSuccess
                            ? "Enjoy your premium features and elevate your privacy insights!"
                            : "Oops! Something went wrong. Please try again."}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
