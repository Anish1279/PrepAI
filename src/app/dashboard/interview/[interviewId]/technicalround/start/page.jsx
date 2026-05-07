import { requireCurrentUserEmail } from "@/features/auth/services/session-service";
import TechnicalInterviewSession from "@/features/interviews/components/TechnicalInterviewSession";
import { getTechnicalInterview } from "@/features/interviews/services/technical-interview-service";

export default async function StartTechnicalInterviewPage({ params }) {
  const email = await requireCurrentUserEmail();

  const { interviewId } = await params;
  const interview = await getTechnicalInterview(interviewId, email);

  return <TechnicalInterviewSession interview={interview} />;
}
