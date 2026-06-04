import Link from "next/link";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Portfolium
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/posts"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            Posts
          </Link>
          <Link
            href="/projects"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            Projects
          </Link>
          <ThemeToggle />
          {session ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
