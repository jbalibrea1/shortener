'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { BadgeCheck, Home, LogOut } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import api from '@/lib/axios';
import {
  type EditProfileSchemaType,
  editProfileSchema,
} from '@/schemas/edit-profile.schema';
import { LogoutLink } from './logout-link';
import { ModeToggle } from './toggle-dark';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function NavUser() {
  const { isMobile } = useSidebar();

  const { data: session } = useSession();
  const user = {
    username: session?.user?.username || '',
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    avatar: session?.user?.avatar || '/avatars/default.jpg',
  };
  console.log('[NavUser] user:', user);
  const form = useForm<EditProfileSchemaType>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name,
      password: '',
      confirmPassword: '',
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.name) {
      form.reset({
        name: user.name,
        password: '',
        confirmPassword: '',
      });
    }
  }, [user.name, form]);

  const onSubmit = async (data: EditProfileSchemaType) => {
    setLoading(true);
    try {
      await api.put('/auth/me', {
        name: data.name,
        password: data.password || undefined,
      });
      toast.success('Profile updated successfully');
      // Opcional: cerrar el diálogo aquí si lo necesitas
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="rounded-lg">
                    {user.name?.slice(0, 2).toUpperCase() || 'SH'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.username}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <CaretSortIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.username}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ModeToggle />
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Edit Profile
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem>
                  <Home />
                  <a href="/">Back to Home</a>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut />
                <LogoutLink>Log out</LogoutLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Name</Label>
                  <Input
                    id="name-1"
                    {...form.register('name')}
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password-1">Password</Label>
                  <Input
                    id="password-1"
                    type="password"
                    {...form.register('password')}
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password-2">Confirm password</Label>
                  <Input
                    id="password-2"
                    type="password"
                    {...form.register('confirmPassword')}
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button" disabled={loading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
