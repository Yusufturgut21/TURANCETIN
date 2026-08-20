import { redirect } from "next/navigation";

export default function KampanyaDetailRedirect() {
  redirect("/urunler?campaign=1");
}
