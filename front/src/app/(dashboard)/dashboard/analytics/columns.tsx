'use client';

import { IconDotsVertical } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ShortUrlAnalytics = {
  shortCode: string;
  url: string;
  title: string;
  createdAt: string;
  metrics: {
    totalClicks: number;
    lastClickAt: string;
    topReferrer: string;
    topDevice: string;
    topCountry: string;
  };
};

export const columns: ColumnDef<ShortUrlAnalytics>[] = [
  {
    accessorKey: 'shortCode',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Short URL
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Link
        className="font-mono text-xs"
        href={`/${row.getValue('shortCode')}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="link"> /{row.getValue('shortCode')}</Button>
      </Link>
    ),
  },
  {
    id: 'url',
    accessorKey: 'url',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        URL
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <a
        href={row.getValue('url')}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 "
        title={row.getValue('url')}
      >
        <Button
          variant="link"
          className="text-muted-foreground p-0 max-w-[220px] truncate block"
        >
          {row.getValue('url')}
        </Button>
      </a>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.getValue('title')}</span>,
  },
  {
    id: 'totalClicks',
    accessorKey: 'metrics.totalClicks',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="justify-end w-full"
      >
        Clicks
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original.metrics.totalClicks}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {new Date(row.getValue('createdAt')).toLocaleDateString()}
        {/* {new Date(row.getValue('createdAt')).toISOString().slice(0, 10)} */}
      </span>
    ),
  },
  {
    id: 'topReferrer',
    accessorKey: 'metrics.topReferrer',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Top Referrer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.original.metrics.topReferrer}</span>,
  },
  {
    id: 'topDevice',
    accessorKey: 'metrics.topDevice',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Top Device
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.original.metrics.topDevice}</span>,
  },
  {
    id: 'topCountry',
    accessorKey: 'metrics.topCountry',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Top Country
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.original.metrics.topCountry}</span>,
  },
  {
    id: 'actions',
    cell: () => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Show Graph</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
