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
    topReferrer: string | null;
    topDevice: string | null;
    topCountry: string | null;
  };
};

// Helper to format date consistently
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper to display metric values with fallback
const displayMetric = (value: string | null) => {
  return value || 'N/A';
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
        className="font-mono text-xs font-medium hover:underline"
        href={`/${row.getValue('shortCode')}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        /{row.getValue('shortCode')}
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
        className="text-muted-foreground hover:text-foreground max-w-[220px] truncate block underline-offset-4 hover:underline"
        title={row.getValue('url')}
      >
        {row.getValue('url')}
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
        {formatDate(row.getValue('createdAt'))}
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
    cell: ({ row }) => (
      <span className="text-sm">
        {displayMetric(row.original.metrics.topReferrer)}
      </span>
    ),
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
    cell: ({ row }) => (
      <span className="text-sm">
        {displayMetric(row.original.metrics.topDevice)}
      </span>
    ),
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
    cell: ({ row }) => (
      <span className="text-sm">
        {displayMetric(row.original.metrics.topCountry)}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const shortCode = row.getValue('shortCode') as string;

      const handleEdit = () => {
        // TODO: Implement edit functionality
        console.log('Edit URL:', shortCode);
      };

      const handleShowGraph = () => {
        // TODO: Navigate to detailed analytics page
        console.log('Show graph for:', shortCode);
      };

      const handleDelete = () => {
        // TODO: Implement delete with confirmation
        console.log('Delete URL:', shortCode);
      };

      return (
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
              <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleShowGraph}>
                Show Graph
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
