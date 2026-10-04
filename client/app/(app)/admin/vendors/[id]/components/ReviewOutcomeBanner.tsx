import { Icon } from "@/components/ui/components/Icon";
import { relativeTime, reviewOutcomeCopy, type ReviewOutcome } from "../../components/adminConfig";

type Props = {
  outcome: ReviewOutcome;
};

export function ReviewOutcomeBanner({ outcome }: Props) {
  const copy = reviewOutcomeCopy(outcome.decision);

  return (
    <div className={`flex flex-col gap-2 rounded-xl p-4 shadow-sm ${copy.tone}`}>
      <div className="flex items-center gap-2">
        <Icon size="sm" aria-hidden="true">{copy.icon}</Icon>
        <p className="text-label-md">{copy.title}</p>
      </div>
      <p className="text-caption">
        {copy.body}
        {outcome.decidedAt ? ` Decision recorded ${relativeTime(outcome.decidedAt)}.` : ""}
      </p>
    </div>
  );
}
