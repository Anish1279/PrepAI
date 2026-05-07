import { requireCurrentUserEmail } from "@/features/auth/services/session-service";
import TechnicalInterviewPreview from "@/features/interviews/components/TechnicalInterviewPreview";
import { getTechnicalInterview } from "@/features/interviews/services/technical-interview-service";

export default async function TechnicalInterviewPage({ params }) {
  const email = await requireCurrentUserEmail();

  const { interviewId } = await params;
  const interview = await getTechnicalInterview(interviewId, email);

  return <TechnicalInterviewPreview interview={interview} />;
}
