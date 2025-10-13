import RecruitmentCandidateCard from "@/components/Elements/cards/recruitmentCandidate";
import { useEffect, useRef, useState } from "react";
import {
  fetchRecruitmentData,
  fetchRecruitmentResume,
  uploadRecruitmentResume,
} from "@/api/recruitment/recruitmentData";
import { useRouter } from "next/router";
import { Popup } from "@/components/Elements/cards/popup";
import { toast } from "react-toastify";
import ContentHeader from "@/components/Layouts/content-header";
import MainLayout from "@/components/Layouts/layout";


export default function Home() {
  const [currentCandidate, setCurrentCandidate] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      fetchRecruitmentData(Number(router.query.id)).then((data) => {
        setCurrentCandidate(data);
        console.log(data);
      });
    }
  }, [router.isReady]);

  return (
    <MainLayout>
      <main className="min-h-screen">
        <div className="">
          <RecruitmentCandidateCard
            candidate={currentCandidate ? currentCandidate :[]}
          />
        </div>
      </main>
    </MainLayout>
  );
}
