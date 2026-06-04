"use client";

import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateTheme } from "@/server/actions/profile";

type SettingsFormProps = {
  theme: "dark" | "light";
};

export function SettingsForm({ theme: initialTheme }: SettingsFormProps) {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = async (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    await updateTheme(newTheme);
  };

  return (
    <div className="max-w-lg space-y-6">
      <div className="space-y-3">
        <Label>Theme preference</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={(theme || initialTheme) === "dark" ? "default" : "outline"}
            onClick={() => handleThemeChange("dark")}
          >
            Dark
          </Button>
          <Button
            type="button"
            variant={(theme || initialTheme) === "light" ? "default" : "outline"}
            onClick={() => handleThemeChange("light")}
          >
            Light
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Your theme preference is saved to your account
        </p>
      </div>
    </div>
  );
}
