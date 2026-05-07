import AddNewinterview from '@/features/interviews/components/AddNewInterview'
import InterviewList from '@/features/interviews/components/InterviewList'
import AddNewCodingRound from '@/features/coding/components/AddNewCodingRound'
import CodingRoundList from '@/features/coding/components/CodingRoundList'
import { requireCurrentUserEmail } from '@/features/auth/services/session-service'
import { listCodingInterviews } from '@/features/coding/services/coding-interview-service'
import { listTechnicalInterviews } from '@/features/interviews/services/technical-interview-service'
import { Activity, BrainCircuit, Code2, Sparkles } from 'lucide-react'

async function DashboardPage() {
  const email = await requireCurrentUserEmail()

  let technicalInterviews = []
  let codingInterviews = []
  let codingRoundsError = ""

  try {
    technicalInterviews = await listTechnicalInterviews(email)
  } catch (error) {
    console.error('Could not load technical interviews:', error)
  }

  try {
    codingInterviews = await listCodingInterviews(email)
  } catch (error) {
    codingRoundsError =
      error instanceof Error
        ? error.message
        : 'Could not load coding rounds — try refreshing.'
  }

  return (
    <div className="space-y-8">
      <section className="surface-panel overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="eyebrow">
              <Sparkles className="size-4" />
              AI practice workspace
            </span>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Build interview confidence with focused, repeatable reps.
            </h1>
            <p className="mt-4 max-w-2xl text-pretty leading-7 text-slate-400">
              Create technical mocks, generate coding challenges, review feedback,
              and keep every preparation loop in one dark workspace.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <MetricCard icon={BrainCircuit} label="Technical mocks" value={technicalInterviews.length} />
            <MetricCard icon={Code2} label="Coding rounds" value={codingInterviews.length} />
            <MetricCard icon={Activity} label="Active modes" value="3" />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="page-kicker">Create</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Start a new practice loop</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AddNewinterview />
          <AddNewCodingRound />
        </div>
      </section>

      <InterviewList interviews={technicalInterviews} />
      <CodingRoundList interviews={codingInterviews} error={codingRoundsError} />
    </div>
  )
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
          <Icon className="size-5" />
        </span>
        <span className="text-3xl font-semibold text-white">{value}</span>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-400">{label}</p>
    </div>
  )
}

export default DashboardPage
