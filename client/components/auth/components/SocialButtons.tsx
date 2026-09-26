import { SocialButton } from "./SocialButton";
import { AppleIcon } from "./AppleIcon";
import { GitHubIcon } from "./GitHubIcon";
import { GoogleIcon } from "./GoogleIcon";

const PROVIDERS = [
  { id: "google", label: "Continue with Google", Icon: GoogleIcon },
  { id: "github", label: "Continue with GitHub", Icon: GitHubIcon },
  { id: "apple", label: "Continue with Apple", Icon: AppleIcon },
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
