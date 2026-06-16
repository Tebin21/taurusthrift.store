"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AccountSecurityCard() {
  const t = useTranslations("settings");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email && !newPassword) {
      toast.error(t("noChanges"));
      return;
    }
    if (email && !EMAIL_REGEX.test(email)) {
      toast.error(t("invalidEmail"));
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || undefined, newPassword: newPassword || undefined, confirmPassword: confirmPassword || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(t("accountUpdated"));
        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
      } else if (res.status === 409) {
        toast.error(t("emailConflict"));
      } else {
        toast.error(data.error ?? t("saveFailed"));
      }
    } catch {
      toast.error(t("saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("accountSettingsTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t("newEmail")}</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newEmailPlaceholder")}
              className="mt-1"
            />
          </div>
          <div>
            <Label>{t("newPassword")}</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>{t("confirmPassword")}</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? t("saving") : t("saveChanges")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
