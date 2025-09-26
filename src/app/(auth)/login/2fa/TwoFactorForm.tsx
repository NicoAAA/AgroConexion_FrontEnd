// Archivo: src/app/(auth)/login/2fa/TwoFactorForm.tsx

"use client"; // ¡MUY IMPORTANTE! Esto lo marca como un Componente de Cliente.

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { twoFactorSchema } from "@/schemas";
import { twoFactor } from "@/actions/auth/2fa";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";

export default function TwoFactorForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof twoFactorSchema>>({
        resolver: zodResolver(twoFactorSchema),
        defaultValues: {
            code: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof twoFactorSchema>) => {
        setError("");
        setSuccess("");
        if (!email) {
            setError("No se encontró el email");
            return;
        }

        const response = await twoFactor(values, email);
        if (response.error) {
            setError(response.error);
        }
        if (response.success) {
            setSuccess(response.success);
            window.location.href = "/dashboard";
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código de verificación</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="123456" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button type="submit" className="w-full">
                    Verificar
                </Button>
            </form>
        </Form>
    );
}
