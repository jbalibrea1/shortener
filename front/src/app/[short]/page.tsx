import { redirect } from "next/navigation";

export default async function ShortPage({
  params,
}: {
  params: { short: string };
}) {
  const API = process.env.NEXT_PUBLIC_API_URL;
  redirect(`${API}/redirect/${params.short}`);
}
