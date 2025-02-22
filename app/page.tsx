import { redirect } from "next/navigation";

export default function Home() {
  throw redirect("https://neon.tech/signup");
}
