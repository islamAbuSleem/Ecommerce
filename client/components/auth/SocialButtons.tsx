import { SocialButton } from "@/components/ui/Button";
import { AppleSvg, GitHubSvg, GoogleSvg } from "./icons";

const PROVIDERS = [
  { id: "google", label: "Continue with Google", Icon: GoogleSvg },
  { id: "github", label: "Continue with GitHub", Icon: GitHubSvg },
  { id: "apple", label: "Continue with Apple", Icon: AppleSvg },
] as const;

export function SocialButtons({ apiUrl }: { apiUrl: string }) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Apple is hidden: backend has no /auth/apple route. */}
      {PROVIDERS.filter(({ id }) => id !== "apple").map(({ id, label, Icon }) => (
        <SocialButton
          key={id}
          onClick={() => {
            window.location.href = `${apiUrl}/auth/${id}`;
          }}
        >
          <Icon />
          <span>{label}</span>
        </SocialButton>
      ))}
    </div>
  );
}
