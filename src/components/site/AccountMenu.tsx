import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { displayName, useAuth, useProfile } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function AccountMenu() {
  const { user, loading } = useAuth();
  const profile = useProfile();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (loading) return <span className="size-8 animate-pulse rounded-full bg-muted" aria-hidden />;

  if (!user) {
    if (pathname === "/auth") return null;
    return (
      <Button variant="outline" size="sm" asChild>
        <Link to="/auth" search={{ redirect: pathname }}>
          <LogIn /> <span className="hidden sm:inline">Sign in</span>
        </Link>
      </Button>
    );
  }

  const name = displayName(user, profile.data?.full_name);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    if (pathname.startsWith("/account")) void navigate({ to: "/", replace: true });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="grid size-9 place-items-center rounded-full bg-emerald-gradient font-display text-sm font-bold text-primary-foreground shadow-glow transition hover:brightness-110"
        >
          {name.slice(0, 1).toUpperCase()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/account"><UserRound /> My account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void signOut()}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
