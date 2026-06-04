import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Portfolium
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/posts" className="hover:text-foreground">
            Posts
          </Link>
          <Link href="/projects" className="hover:text-foreground">
            Projects
          </Link>
        </div>
      </div>
    </footer>
  );
}
