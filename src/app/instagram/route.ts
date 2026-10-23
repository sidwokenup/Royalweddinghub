import { redirect } from "next/navigation";
import { BUSINESS_INFO } from "@/lib/contact";

export async function GET() {
  redirect(BUSINESS_INFO.instagram.url);
}
