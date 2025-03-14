import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

const HomePage = async () => {
  return (
    <div>
      <h1>Hello World</h1>
      <Button>Click me</Button>
      <UserButton showName />
    </div>
  );
}

export default HomePage;