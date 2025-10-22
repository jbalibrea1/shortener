import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutLink } from '@/components/features/logout-link';

const DASHBOARD_KEYBOARD_SHORTCUT = 'd';
const LOGOUT_KEYBOARD_SHORTCUT = 'o';

export function DropdownLogged() {
  const { data: session } = useSession();
  console.log('Session data:', session);
  const user = {
    username: session?.user?.username || '',
    email: session?.user?.email || '',
    avatar: session?.user?.avatar || '/avatars/default.jpg',
  };
  const router = useRouter();

  // Functions to navigate
  const goToDashboard = React.useCallback(() => {
    window.location.href = '/dashboard';
  }, []);

  const logout = React.useCallback(async () => {
    toast.success('Has cerrado sesión correctamente.');
    await signOut({ redirect: false });
    router.push('/');
  }, [router]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === DASHBOARD_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        goToDashboard();
      }
      if (
        event.key === LOGOUT_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        logout();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToDashboard, logout]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1 h-10"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="rounded-lg">
              {user.username?.slice(0, 2).toUpperCase() || 'SH'}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[120px] truncate text-left">
            {user.username}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <a href="/dashboard" className="flex items-center gap-2">
              Dashboard
            </a>
            <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem disabled>Email</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <a
            href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
            rel="noopener noreferrer"
            target="_blank"
            className="dark:text-foreground"
          >
            GitHub
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutLink className="transition-all ease-in-out delay-75 text-foreground/70 hover:text-foreground">
            Log out
          </LogoutLink>
          <DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropdownLogged;
