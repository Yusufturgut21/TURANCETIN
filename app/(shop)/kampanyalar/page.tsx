import { redirect } from "next/navigation";

export default function KampanyalarRedirect() {
  redirect("/urunler?campaign=1");
}
