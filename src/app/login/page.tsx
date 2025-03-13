import { LogInIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

const LoginPage = () => {
  return (
    <main className="grid grid-cols-2 h-full">
      <div className="flex flex-col gap-8 h-full justify-center max-w-[600px] mx-auto px-10">
        <Image src="/logo.svg" alt="Brand Zone" width={173} height={42} />
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Welcome</h1>
          <p className="text-muted-foreground">Brand Zone is the branding platform set to boost marketing management and creativity</p>
        </div>
        <Button variant="outline">
          <LogInIcon />
          Sign in or create account
        </Button>
      </div>
      <div className="bg-amber-300 px-20 overflow-hidden">
        <div className="relative h-full w-full">
          <Image src="/login.png" alt="Photo montage" fill className="object-contain animate-[spin_90s_linear_infinite]" />
        </div>
      </div>
    </main>
  );
}

export default LoginPage;