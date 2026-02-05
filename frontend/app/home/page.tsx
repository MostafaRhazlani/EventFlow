import { LogoutButton } from '@/components/ui/LogoutButton';

export default function HomePage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Participant Home</h1>
        <LogoutButton />
      </div>
      <p>Welcome to the participant home area.</p>
    </div>
  );
}
