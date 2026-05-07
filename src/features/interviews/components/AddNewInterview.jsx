"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, BrainCircuit, LoaderCircle, Sparkles } from 'lucide-react'
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api/client";

  
function AddNewinterview() {
    const [openDailog,setOpenDailog]=useState(false)
    const [jobRole ,setJobRole]=useState("")
    const [jobDesc ,setJobDesc]=useState("")
    const [jobExp ,setJobExp]=useState("")
    const [loading, setLoading]=useState(false)
    const router = useRouter()

    const onSubmit=async(e)=>{
        e.preventDefault()
        setLoading(true);

        try {
          const interview = await apiRequest("/api/interviews/technical", {
            method: "POST",
            body: { jobRole, jobDesc, jobExp },
          });

          setOpenDailog(false);
          router.push(`/dashboard/interview/${interview.mockId}/technicalround`);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false)
        }
    }
  return (
    <div>
      <button
        type="button"
        className="premium-card interactive-lift animated-border group w-full rounded-3xl p-6 text-left"
        onClick={()=>setOpenDailog(true)}
      >
        <div className="relative z-10 flex min-h-[190px] flex-col justify-between">
          <div>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
              <BrainCircuit className="size-6" />
            </span>
            <h2 className="mt-6 text-2xl font-semibold text-white">Technical Round</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Generate a role-specific mock interview with AI questions and structured feedback.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-sm font-semibold text-cyan-200">
            <span>Build interview</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </button>
      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
            <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
              <Sparkles className="size-6" />
            </div>
            <DialogTitle>Configure your technical interview</DialogTitle>
            <DialogDescription>
              Add the role, stack, and experience level so PrepAI can generate a precise interview.
            </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div className="space-y-4">
                    <div>
                        <label className='text-sm font-semibold text-slate-200'>Job role</label>
                        <Input placeholder="Ex. Full Stack Developer" required value={jobRole} onChange={(event)=>setJobRole(event.target.value)}/>
                    </div>
                    <div>
                        <label className='text-sm font-semibold text-slate-200'>Job description and tech stack</label>
                        <Textarea  placeholder="Ex. React,Next.js,Sql" required
                        value={jobDesc}
                        onChange={(event)=>setJobDesc(event.target.value)}/>
                    </div>
                    <div>
                        <label className='text-sm font-semibold text-slate-200'>Years of experience</label>
                        <Input placeholder="Ex. 1" type="number" required
                        value={jobExp}
                        onChange={(event)=>setJobExp(event.target.value)}/>
                    </div>
                </div>
            <div className='flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end'>
               <Button type="button" variant="ghost" onClick={()=>setOpenDailog(false)}>Cancel</Button>
                <Button type="submit" disabled={loading} variant="premium">
                    {loading?
                    <>
                    <LoaderCircle className='animate-spin'/>Generating interview
                    </>:'Start Interview'
                    }</Button>
            </div>
            </form>
        </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddNewinterview
