import { Text } from "@heroui/react";
import { Button } from "@heroui/react/button";

export default function Home() {
  return (
    <>
      <div className=' flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <Text.Heading className="text-4xl font-bold mb-4">Welcome to Vscan</Text.Heading>
        <Text.Paragraph className="text-lg mb-6">Your ultimate vulnerability scanning tool.</Text.Paragraph>
        <Button variant="primary" size="lg" onClick={() => alert("Get Started clicked!")}>
          Get Started, vikesh!
        </Button>
      </div>
    </>
  );
}
