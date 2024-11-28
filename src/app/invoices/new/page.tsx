"use client"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createAction } from "@/actions/createAction"
import { SyntheticEvent, useState } from "react"
import { Loader2 } from "lucide-react"  

const CreateInvoice = async () => {
   

    return (
        <div className="flex flex-col justify-center h-full gap-6 max-w-5xl mx-auto my-12">
            <div className="flex justify-between">
                <h1 className="text-3xl font-semibold">Create a New Invoice</h1>
            </div>

            <form action={createAction} className="grid gap-4 max-w-xs">
                <div>
                    <Label htmlFor="name" className="block mb-2 font-semibold text-sm">Billing Name</Label>
                    <Input id="name" name="name" type="text" required />
                </div>

                <div>
                    <Label htmlFor="email" className="block mb-2 font-semibold text-sm">Billing Email</Label>
                    <Input id="email" name="email" type="email" required />
                </div>

                <div>
                    <Label htmlFor="value" className="block mb-2 font-semibold text-sm">Value</Label>
                    <Input id="value" name="value" type="text" required />
                </div>

                <div>
                    <Label htmlFor="description" className="block mb-2 font-semibold text-sm">Description</Label>
                    <Textarea id="description" name="description" required />
                </div>

                <div>
                    <Button className="w-full font-semibold">
                            Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateInvoice;
