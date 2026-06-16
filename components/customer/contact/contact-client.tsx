"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

type Props = { locale: string };

export function ContactClient({ locale }: Props) {
  const t = useTranslations("contact");
  const currentLocale = useLocale();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale: currentLocale }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSuccess(true);
      reset();
    } catch {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-brown mb-2">
          Taurus Thrift
        </p>
        <h1 className="text-4xl font-bold mb-3">{t("title")}</h1>
        <p className="text-muted-foreground max-w-md mx-auto">{t("subtitle")}</p>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {success ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
              <h2 className="text-2xl font-bold">{t("successTitle")}</h2>
              <p className="text-muted-foreground">{t("successMsg")}</p>
              <Button variant="outline" onClick={() => setSuccess(false)}>{t("sendAnother")}</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label htmlFor="name">{t("name")} *</Label>
                <Input id="name" {...register("name")} className="mt-1" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{t("nameRequired")}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" type="email" {...register("email")} className="mt-1" dir="ltr" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{t("emailInvalid")}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <Input id="phone" type="tel" {...register("phone")} className="mt-1" dir="ltr" />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">{t("subject")}</Label>
                <Input id="subject" {...register("subject")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="message">{t("message")} *</Label>
                <Textarea id="message" {...register("message")} rows={5} className="mt-1" />
                {errors.message && <p className="text-xs text-red-500 mt-1">{t("messageRequired")}</p>}
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-brand-brown hover:bg-brand-brown-dark text-white"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t("send")}
              </Button>
            </form>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="rounded-xl bg-brand-beige dark:bg-muted p-6 space-y-5">
            <h2 className="font-semibold text-lg">{t("infoTitle")}</h2>
            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-brand-brown mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">hello@taurusthrift.com</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="h-5 w-5 text-brand-brown mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">{t("phone")}</p>
                <p className="text-sm text-muted-foreground" dir="ltr">+964 750 000 0000</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-brand-brown mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">{t("location")}</p>
                <p className="text-sm text-muted-foreground">Erbil, Kurdistan Region, Iraq</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-brand-beige dark:bg-muted p-6">
            <h3 className="font-semibold mb-2">{t("hoursTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t("hours")}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
