import { requireCurrentUserEmail } from "@/features/auth/services/session-service";
import CodingAssessmentClient from "@/features/coding/components/CodingAssessmentClient";
import CodingErrorState from "@/features/coding/components/CodingErrorState";
import { getCodingInterview } from "@/features/coding/services/coding-interview-service";

export default async function CodingAssessmentPage({ params }) {
  const email = await requireCurrentUserEmail();

  const { interviewId } = await params;
  const interviewState = await loadCodingInterview(interviewId, email);

  if (interviewState.error) {
    return (
      <CodingErrorState
        title="Could not start coding round"
        message={interviewState.error}
      />
    );
  }

  return <CodingAssessmentClient interview={interviewState.data} interviewId={interviewId} />;
}

async function loadCodingInterview(interviewId, email) {
  try {
    return { data: await getCodingInterview(interviewId, email), error: "" };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Could not load this coding round. Please try again.",
    };
  }
}
