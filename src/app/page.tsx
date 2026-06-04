import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFeaturedUsers } from "@/server/queries/users";

export default async function HomePage() {
  const users = await getFeaturedUsers();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:py-32">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Your portfolio, simplified
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Built for developers and creators. Share your work, write blog posts,
            and showcase projects — all in one minimal place.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/register">Create your portfolio</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/posts">Browse posts</Link>
            </Button>
          </div>
        </section>

        {users.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 pb-20">
            <h2 className="mb-8 text-center text-xl font-semibold tracking-tight">
              Featured creators
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => {
                const avatarUrl = user.avatar || user.image;
                const initials =
                  user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || user.username.slice(0, 2).toUpperCase();

                return (
                  <Link
                    key={user.id}
                    href={`/${user.username}`}
                    className="flex items-center gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={avatarUrl || undefined} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name || user.username}</p>
                      <p className="text-sm text-muted-foreground">
                        @{user.username}
                      </p>
                      {user.bio && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
