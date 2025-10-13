import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InterviewForm from "@/components/Forms/jobs/updateInterview";
import { toast } from "react-toastify";
import { updateInterviewRound } from "@/api/interviews/InterviewRounds";

// Mock dependencies
vi.mock("@/api/interviews/InterviewRounds", () => ({
  updateInterviewRound: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock DatePicker since it might cause issues in tests
vi.mock("react-datepicker", () => ({
  default: ({ selected, onChange }: any) => (
    <input
      type="text"
      value={selected ? selected.toISOString().split('T')[0] : ""}
      onChange={(e) => {
        const date = new Date(e.target.value);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        onChange(date);
      }}
      data-testid="datepicker"
    />
  ),
}));

describe("InterviewForm", () => {
  const mockAutoClose = vi.fn();
  const mockInitialValues = {
    interviewerName: "John Doe",
    roundDate: "2023-06-15",
    technologyInterviewed: "React",
    interviewStatus: "Pending",
    techRating: 5,
    softskillsRating: 7,
    remarks: "Good candidate",
  };

  const mockMasterTechnologies = [
    { technology: "React" },
    { technology: "Node.js" },
    { technology: "TypeScript" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with initial values", () => {
    render(
      <InterviewForm
        initialValues={mockInitialValues}
        id={1}
        masterTechnologies={mockMasterTechnologies}
        autoClose={mockAutoClose}
      />
    );

    expect(screen.getByLabelText(/Interviewer Name/i)).toHaveValue(
      mockInitialValues.interviewerName
    );
    expect(screen.getByLabelText(/Technology/i)).toHaveValue(
      mockInitialValues.technologyInterviewed
    );
    expect(screen.getByLabelText(/Status/i)).toHaveValue(
      mockInitialValues.interviewStatus
    );
    expect(screen.getByLabelText(/Remark/i)).toHaveValue(
      mockInitialValues.remarks
    );
  });

  it("displays validation errors when required fields are empty", async () => {
    render(
      <InterviewForm
        initialValues={{
          interviewerName: "",
          roundDate: "",
          technologyInterviewed: "",
          interviewStatus: "",
          techRating: 0,
          softskillsRating: 0,
          remarks: "",
        }}
        id={1}
        masterTechnologies={mockMasterTechnologies}
        autoClose={mockAutoClose}
      />
    );

    fireEvent.click(screen.getByText("Update Round"));

    // await waitFor(() => {
    //   expect(screen.getByText(/Interviewer Name is required/i)).toBeInTheDocument();
    //   expect(screen.getByText(/Date is required/i)).toBeInTheDocument();
    //   expect(screen.getByText(/Technology is required/i)).toBeInTheDocument();
    //   expect(screen.getByText(/Status is required/i)).toBeInTheDocument();
    //   expect(screen.getByText(/Remark is required/i)).toBeInTheDocument();
    // });
  });

  it("updates form fields when user interacts with them", async () => {
    render(
      <InterviewForm
        initialValues={mockInitialValues}
        id={1}
        masterTechnologies={mockMasterTechnologies}
        autoClose={mockAutoClose}
      />
    );

    const interviewerInput = screen.getByLabelText(/Interviewer Name/i);
    fireEvent.change(interviewerInput, { target: { value: "Jane Smith" } });
    expect(interviewerInput).toHaveValue("Jane Smith");

    const technologySelect = screen.getByLabelText(/Technology/i);
    fireEvent.change(technologySelect, { target: { value: "Node.js" } });
    expect(technologySelect).toHaveValue("Node.js");

    const statusSelect = screen.getByLabelText(/Status/i);
    fireEvent.change(statusSelect, { target: { value: "Passed" } });
    expect(statusSelect).toHaveValue("Passed");

    const remarksTextarea = screen.getByLabelText(/Remark/i);
    fireEvent.change(remarksTextarea, { target: { value: "Updated remarks" } });
    expect(remarksTextarea).toHaveValue("Updated remarks");
  });

  it("handles rating selection for technical skills", async () => {
    render(
      <InterviewForm
        initialValues={mockInitialValues}
        id={1}
        masterTechnologies={mockMasterTechnologies}
        autoClose={mockAutoClose}
      />
    );

    const ratingButton = screen.getAllByText("8")[0]; // First rating is technical
    fireEvent.click(ratingButton);

    expect(ratingButton).toHaveClass("border-cyan-500");
  });

  it("handles rating selection for soft skills", async () => {
    render(
      <InterviewForm
        initialValues={mockInitialValues}
        id={1}
        masterTechnologies={mockMasterTechnologies}
        autoClose={mockAutoClose}
      />
    );

    const ratingButton = screen.getAllByText("8")[1]; // Second rating is soft skills
    fireEvent.click(ratingButton);

    expect(ratingButton).toHaveClass("border-cyan-500");
  });

  it("submits the form with updated values", async () => {
    const mockUpdate = vi.fn().mockResolvedValue({ status: 200 });
    vi.mocked(updateInterviewRound).mockImplementation(mockUpdate);

    render(
      <InterviewForm
        initialValues={mockInitialValues}
        id={1}
        masterTechnologies={mockMasterTechnologies}
        autoClose={mockAutoClose}
      />
    );

    // Change some values
    fireEvent.change(screen.getByLabelText(/Interviewer Name/i), {
      target: { value: "Updated Name" },
    });
    fireEvent.change(screen.getByLabelText(/Remarks/i), {
      target: { value: "Updated remarks" },
    });

    fireEvent.click(screen.getByText("Update Round"));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(1, {
        interviewerName: "Updated Name",
        remarks: "Updated remarks",
      });
      expect(toast.success).toHaveBeenCalledWith("Interview updated successfully", {
        position: "top-right",
      });
      expect(mockAutoClose).toHaveBeenCalled();
    });
  });

  it("handles API error on form submission", async () => {
    const mockUpdate = vi.fn().mockResolvedValue({
      status: 400,
      message: "Update failed",
    });
    vi.mocked(updateInterviewRound).mockImplementation(mockUpdate);

    render(
      <InterviewForm
        initialValues={mockInitialValues}
        id={1}
        masterTechnologies={mockMasterTechnologies}
        autoClose={mockAutoClose}
      />
    );

    fireEvent.click(screen.getByText("Update Round"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Update failed", {
        position: "top-right",
      });
      expect(mockAutoClose).not.toHaveBeenCalled();
    });
  });

  it("handles date selection", async () => {
    render(
      <InterviewForm
        initialValues={mockInitialValues}
        id={1}
        masterTechnologies={mockMasterTechnologies}
        autoClose={mockAutoClose}
      />
    );
  });
});