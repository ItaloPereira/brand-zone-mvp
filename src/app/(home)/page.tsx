import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";

const HomePage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Hello World</h1>
      <Button>Click me</Button>
      <UserButton showName />
    </div>
  );
}

export default HomePage;