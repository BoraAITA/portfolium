import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { DashboardUserMenu } from "./DashboardUserMenu";

type DashboardHeaderProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string;
  };
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <header className="flex h-14 items-center justify-between border-b px-4 md:px-6">
      <div className="md:hidden">
        <Link href="/" className="font-semibold">
          Portfolium
        </Link>
      </div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-2">
        {user.username && (
          <Button asChild variant="outline" size="sm">
            <Link href={`/${user.username}`} target="_blank">
              View profile
            </Link>
          </Button>
        )}
        <ThemeToggle />
        <DashboardUserMenu user={user} initials={initials} />
      </div>
    </header>
  );
}
