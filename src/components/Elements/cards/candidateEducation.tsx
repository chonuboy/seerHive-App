import { fetchEducationsByContact } from "@/api/candidates/education";
import { useEffect, useState } from "react";

export const CandidateEducation = ({ contactId }: { contactId: number }) => {
  const [educations, setEducations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contactId) {
      fetchEducationsByContact(contactId).then((data) => {
        setEducations(data || []);
        setLoading(false);
      });
    }
  }, [contactId]);

  if (loading) {
    return <p className="text-sm text-gray-400">Loading education…</p>;
  }

  if (educations.length === 0) {
    return <p className="text-sm text-gray-400">No education details</p>;
  }

  return (
    <ul className="space-y-1 text-sm text-gray-700">
      {educations.map((edu, i) => (
        <li key={i}>
          <span className="font-semibold text-gray-800">
            {edu.course.courseName}
          </span>
          , In {edu.specialization}
        </li>
      ))}
    </ul>
  );
};
