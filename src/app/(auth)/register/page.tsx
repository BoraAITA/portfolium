"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerUser } from "@/server/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(registerUser, {
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      const email = document.querySelector<HTMLInputElement>("#email")?.value;
      const password = document.querySelector<HTMLInputElement>("#password")?.value;
      if (email && password) {
        signIn("credentials", {
          email,
          password,
          callbackUrl: "/dashboard",
        });
      } else {
        router.push("/login");
      }
    }
  }, [state.success, router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Start building your portfolio today</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                required
                pattern="[a-z0-9_-]+"
                placeholder="johndoe"
              />
              <p className="text-xs text-muted-foreground">
                Your profile will be at portfolium.app/username
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Create account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
